from confluent_kafka import Producer
import os
from dotenv import load_dotenv
from datetime import datetime
import time
import asyncio
import aiohttp
import async_timeout
import random
from urllib.parse import urlparse, parse_qs
import pytz

load_dotenv()

input_file = "position_for_ult.csv"
broker = os.getenv("BROKERS")
topic = 'ultraviolet-rays'

p = Producer({'bootstrap.servers': broker,
              'compression.codec': 'lz4',
              'acks': 1})


def delivery_report(err, msg):
    """Called once for each message produced to indicate delivery result.
    Triggered by poll() or flush()."""
    if err is not None:
        print("Message delivery failed: {}".format(err))
    else:
        print("Message delivered to {} [{}]".format(msg.topic(), msg.partition()))

def get_tmfc():
    kst = pytz.timezone("Asia/Seoul")
    basetime = datetime.now(kst).strftime("%Y%m%d%H")
    hour = basetime[-2:]

    if hour < '03':
        return basetime[:-2] + '00'
    elif hour < '06':
        return basetime[:-2] + '03'
    elif hour < '09':
        return basetime[:-2] + '06'
    elif hour < '12':
        return basetime[:-2] + '09'
    elif hour < '15':
        return basetime[:-2] + '12'
    elif hour < '18':
        return basetime[:-2] + '15'
    elif hour < '21':
        return basetime[:-2] + '18'
    else:
        return basetime[:-2] + '21'

with open(input_file, mode="r", encoding="utf-8") as infile:
    areaNo_list = infile.read().splitlines()

start = time.time()
CONCURRENCY = 100  # 동시 요청 수 (세마포어로 제어)
TIMEOUT = 30
RETRIES = 3
current_weather_key = os.getenv("ULTRAVIOLET_RAYS_API_KEY")
current_time = get_tmfc()
TPS_LIMIT = 29

def meta_from_url(url: str):
    q = parse_qs(urlparse(url).query)
    areaNo = q.get("areaNo", [""])[0]
    time = q.get("time", [""])[0]
    return areaNo, time

def build_urls(areaNo_list):
    urls = []
    for areaNo in areaNo_list:
        # 원래 호출: get_weather_predict_map(vars, tmfc, tmef)
        # 이제 URL을 문자열로 만들기
        url = f"http://apis.data.go.kr/1360000/LivingWthrIdxServiceV4/getUVIdxV4?serviceKey={current_weather_key}&pageNo=1&numOfRows=10&dataType=JSON&areaNo={areaNo}&time={current_time}"
        urls.append(url)
    return urls
# --- add: Token Bucket Rate Limiter ---


class TokenBucketRateLimiter:
    """
    rate: 초당 허용 토큰 수 (TPS)
    capacity: 버스트 허용치 (기본은 rate와 동일)
    """
    def __init__(self, rate: float, capacity: float | None = None):
        self.rate = float(rate)
        self.capacity = float(capacity if capacity is not None else rate)
        self.tokens = self.capacity
        self.updated = asyncio.get_event_loop().time()
        self._lock = asyncio.Lock()

    async def acquire(self, n: float = 1.0):
        async with self._lock:
            while True:
                now = asyncio.get_event_loop().time()
                elapsed = now - self.updated
                self.updated = now
                # 경과 시간만큼 토큰 충전
                self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
                if self.tokens >= n:
                    self.tokens -= n
                    return
                # 모자란 만큼 대기 (정밀 슬립)
                wait_s = (n - self.tokens) / self.rate
                # 아주 짧은 대기는 이벤트루프 협조를 위해 0으로 보정하지 않음
                await asyncio.sleep(wait_s)


async def fetch_one(session, url):
    for attempt in range(1, RETRIES + 1):
        try:
            async with async_timeout.timeout(TIMEOUT):
                async with session.get(url) as resp:
                    if resp.status in (429, 500, 502, 503, 504):
                        raise aiohttp.ClientResponseError(
                            request_info=resp.request_info,
                            history=resp.history,
                            status=resp.status,
                            message="retryable",
                        )
                    if 200 <= resp.status < 300:
                        areaNo, time = meta_from_url(url)
                        key_bytes = f"{time}-{areaNo}".encode("utf-8")
                        body_bytes = await resp.read()
                        p.poll(0)
                        p.produce(
                            topic,
                            key=key_bytes,
                            value=body_bytes,
                            headers=[  # ← 컨슈머가 구분하기 쉬움
                                ("areaNo", areaNo.encode()),
                                ("time", time.encode()),
                            ],
                            callback=delivery_report,
                        )
                        return {"url": url, "status": resp.status, "error": None}
                    else:
                        return {
                            "url": url,
                            "status": resp.status,
                            "error": f"http_{resp.status}",
                        }
        except Exception:
            if attempt == RETRIES:
                raise
            await asyncio.sleep(
                0.3 * attempt + random.random() * 0.2
            )  # 지수 백오프+지터


async def fetch_many(urls):
    connector = aiohttp.TCPConnector(limit=CONCURRENCY, enable_cleanup_closed=True)

    # 초당 30TPS, 버스트 30 허용 (1초 안에 최대 30건 동시 발사 가능)
    limiter = TokenBucketRateLimiter(rate=TPS_LIMIT, capacity=TPS_LIMIT)

    sem = asyncio.Semaphore(CONCURRENCY)
    async with aiohttp.ClientSession(
        connector=connector  # headers={"Accept-Encoding":"gzip"} 는 호환 이슈시 제거 권장
    ) as session:

        async def bounded(u: str):
            async with sem:
                # --- 핵심: TPS 제한 준수 ---
                await limiter.acquire(1.0)
                return await fetch_one(session, u)

        tasks = [asyncio.create_task(bounded(u)) for u in urls]
        results = []
        for coro in asyncio.as_completed(tasks):
            results.append(await coro)

    p.flush(10)
    ok = sum(1 for r in results if r and r.get("error") is None)
    fail = len(results) - ok
    return {"total": len(results), "ok": ok, "fail": fail}


# 사용
urls = build_urls(areaNo_list)

# 실행
summary = asyncio.run(fetch_many(urls))
print(summary)
print(current_time)
end = time.time()
print(f"실행 시간: {end - start}초")
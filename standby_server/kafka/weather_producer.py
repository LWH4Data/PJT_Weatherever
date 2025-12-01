from confluent_kafka import Producer
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import time
import asyncio
import aiohttp
import async_timeout
import random
from urllib.parse import urlparse, parse_qs
from zoneinfo import ZoneInfo
import json


# 웅희: borker 외부 통신을 위해 수정.
broker = "j13b102a.p.ssafy.io:19092, 52.78.128.129:19092, ec2-13-210-240-255.ap-southeast-2.compute.amazonaws.com:19092"
topic = "weather-3-3"

p = Producer({"bootstrap.servers": broker, "compression.codec": "lz4", "acks": 1})

load_dotenv()


def delivery_report(err, msg):
    """Called once for each message produced to indicate delivery result.
    Triggered by poll() or flush()."""
    if err is not None:
        print("Message delivery failed: {}".format(err))
    else:
        print("Message delivered to {} [{}]".format(msg.topic(), msg.partition()))


vars_list = [
    "TMP", # 기온
    "UUU", # 풍속(동서성분)
    "VVV", # 풍속(남북성분)
    "VEC", # 풍향
    "WSD", # 풍속
    "SKY", # 하늘 상태
    "PTY", # 강수 형태
    "POP", # 강수 확률
    "PCP", # 1시간 강수량 
    "SNO", # 신적설
    "REH", # 습도
    "WAV", # 파고
]


def get_tmfc(basetime):
    hour = basetime % 100
    if hour < 2:
        return basetime - 100 - hour + 23
    elif hour < 5:
        return basetime - hour + 2
    elif hour < 8:
        return basetime - hour + 5
    elif hour < 11:
        return basetime - hour + 8
    elif hour < 14:
        return basetime - hour + 11
    elif hour < 17:
        return basetime - hour + 14
    elif hour < 20:
        return basetime - hour + 17
    elif hour < 23:
        return basetime - hour + 20
    else:
        return basetime - hour + 23


def get_tmef(basetime: str, time_gap: int = 26):
    # 문자열 → datetime 변환
    dt = datetime.strptime(basetime, "%Y%m%d%H")
    
    time_list = []
    for i in range(1, time_gap + 1):
        new_time = dt + timedelta(hours=i)
        time_list.append(new_time.strftime("%Y%m%d%H"))
    
    return time_list

current_data = datetime.now(ZoneInfo("Asia/Seoul")).strftime("%Y%m%d%H")
test_time = get_tmef(current_data)

start = time.time()
CONCURRENCY = 48  # 동시 요청 수 (세마포어로 제어)
TIMEOUT = 30
RETRIES = 3
current_weather_key = os.getenv("WEATHER_API_KEY")


def meta_from_url(url: str):
    q = parse_qs(urlparse(url).query)
    tmfc = q.get("tmfc", [""])[0]
    tmef = q.get("tmef", [""])[0]
    var = q.get("vars", [""])[0]
    return tmfc, tmef, var


def build_urls(test_time, vars_list, current_data):
    urls = []
    tmfc = get_tmfc(int(current_data))  # 네 원래 함수 그대로 사용
    for tmef in test_time:
        for vars in vars_list:
            # 원래 호출: get_weather_predict_map(vars, tmfc, tmef)
            # 이제 URL을 문자열로 만들기
            url = f"https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_shrt_grd?tmfc={tmfc}&tmef={tmef}&vars={vars}&authKey={current_weather_key}"
            urls.append(url)
    return urls


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
                        tmfc, tmef, var = meta_from_url(url)
                        # 웅희: key 수정 
                        key_str = f"{tmfc}-{tmef}-{var}"
                        key_bytes = key_str.encode("utf-8")
                        body_text  = (await resp.text()).strip()
                        # json_data = await resp.json(content_type=None) 
                        # body_bytes = json.dumps(json_data, ensure_ascii=False).encode("utf-8")
                        wrapped_obj = {key_str: body_text}
                        wrapped_bytes = json.dumps(wrapped_obj, ensure_ascii=False).encode("utf-8")
                        p.poll(0)
                        p.produce(
                            topic,
                            key=key_bytes,
                            value=wrapped_bytes,
                            headers=[  # ← 컨슈머가 구분하기 쉬움
                                ("tmfc", tmfc.encode()),
                                ("tmef", tmef.encode()),
                                ("var", var.encode()),
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
    sem = asyncio.Semaphore(CONCURRENCY)
    async with aiohttp.ClientSession(
        connector=connector, headers={"Accept-Encoding": "gzip"}
    ) as session:

        async def bounded(u: str):
            async with sem:
                return await fetch_one(session, u)

        tasks = [asyncio.create_task(bounded(u)) for u in urls]

        results = []
        for coro in asyncio.as_completed(tasks):
            results.append(await coro)

    # 모든 메시지 프로듀스 요청이 큐에 들어갔으니 마무리 flush
    # (이 줄은 비동기 함수 밖(호출부)에서 실행해도 OK)
    p.flush(10)  # 최대 10초 대기

    # 간단한 리포트 반환
    ok = sum(1 for r in results if r and r.get("error") is None)
    fail = len(results) - ok
    return {"total": len(results), "ok": ok, "fail": fail}


# 사용
urls = build_urls(test_time, vars_list, current_data)
# 실행
summary = asyncio.run(fetch_many(urls))
print(summary)
print(current_data)
print(test_time)
print(len(urls))
end = time.time()
print(f"실행 시간: {end - start}초")

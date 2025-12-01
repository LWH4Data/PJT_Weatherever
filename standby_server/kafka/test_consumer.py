from confluent_kafka import Consumer
from collections import defaultdict
import time


start = time.time()
BROKERS = "j13b102a.p.ssafy.io:19092, 52.78.128.129:19092, ec2-13-210-240-255.ap-southeast-2.compute.amazonaws.com:19092"
TOPIC = "weather02"
GROUP_ID = "weather-check01"

VARS_EXPECTED = {'TMP','UUU','VVV','VEC','WSD','SKY','PTY','POP','PCP','SNO','REH','WAV'}

c = Consumer({
    "bootstrap.servers": BROKERS,
    "group.id": GROUP_ID,
    "enable.auto.commit": False,       # 처리 성공 후 커밋
    "auto.offset.reset": "earliest",
    "max.poll.interval.ms": 600000,
    "session.timeout.ms": 45000,
})

c.subscribe([TOPIC])

# tmef별로 var들을 모으는 딕셔너리: { tmef: { var: bytes } }
value = defaultdict(dict)

try:
    while True:
        msg = c.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("consume error:", msg.error())
            continue

        # 헤더 파싱
        headers = dict((k, (v.decode() if v else None)) for k, v in (msg.headers() or []))
        tmef = headers.get("tmef")
        var  = headers.get("var")

        if not tmef or not var:
            # 필요한 헤더가 없으면 스킵(또는 DLQ)
            c.commit(message=msg, asynchronous=False)
            continue

        # 데이터 적재
        data = msg.value()                    # bytes
        value[tmef][var] = data

        # 12개 모이면 동작 수행
        # print(tmef)
        if len(value[tmef]) == len(VARS_EXPECTED):
            # ✅ 변경된 부분: 기존 bundle = value.pop(tmef) → print(tmef)
            print(tmef)                       # <-- 여기만 바꿈
            # 필요 시 실제 처리 로직을 여기에 추가하세요 (DB 저장 등)

        # 메시지 처리 완료 커밋
        c.commit(message=msg, asynchronous=False)

except KeyboardInterrupt:
    pass
finally:
    c.close()


end = time.time()
print(f"실행 시간: {end - start}초")

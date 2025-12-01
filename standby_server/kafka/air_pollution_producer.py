from confluent_kafka import Producer
import requests
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import time
import pytz

load_dotenv()

broker = os.getenv("BROKERS")
topic = 'air-pollution-test'

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


def get_air_pollution_data(searchDate = '2025-09-17'):
    air_pollution_api_key = os.getenv("AIR_POLLUTION_API_KEY")
    url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth'
    params ={'serviceKey' : air_pollution_api_key, 'returnType' : 'json', 'numOfRows' : '100', 'pageNo' : '1', 'searchDate' : searchDate, 'InformCode' : 'PM10' }
    response = requests.get(url, params=params)
    return response.text

kst = pytz.timezone("Asia/Seoul")
today = datetime.now(kst).strftime("%Y-%m-%d")

p.poll(0)
p.produce(topic, get_air_pollution_data(today).encode('utf-8'), callback=delivery_report)
p.flush()
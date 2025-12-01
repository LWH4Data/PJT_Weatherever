# pip install confluent-kafka
from confluent_kafka.admin import AdminClient, NewTopic
from confluent_kafka import KafkaException
import sys
import time

BOOTSTRAP = "j13b102a.p.ssafy.io:19092"
# BOOTSTRAP = "localhost:19092,localhost:29092,localhost:39092"


def create_topic(topic: str,
                 num_partitions: int = 3,
                 replication_factor: int = 3,
                 topic_configs: dict | None = None):
    """토픽이 없으면 생성하고, 있으면 건너뜀."""
    topic_configs = topic_configs or {
        # 필요시 커스텀: 보존/압축/청크 등
        "cleanup.policy": "delete",   # or "compact" / "compact,delete"
        "retention.ms": "604800000",  # 7일
        "segment.bytes": "1073741824" # 1GB
    }

    admin = AdminClient({"bootstrap.servers": BOOTSTRAP})

    # 이미 존재하는지 확인
    md = admin.list_topics(timeout=5)
    if topic in [t for t in md.topics.keys()]:
        print(f"[INFO] Topic '{topic}' already exists. Skip.")
        return

    new_topic = NewTopic(
        topic=topic,
        num_partitions=num_partitions,
        replication_factor=replication_factor,
        config=topic_configs
    )

    fs = admin.create_topics([new_topic])

    # 결과 확인
    try:
        fs[topic].result()  # 완료될 때까지 기다림(예외 발생 시 잡힘)
        print(f"[OK] Created topic '{topic}' "
              f"(partitions={num_partitions}, rf={replication_factor})")
    except KafkaException as e:
        print(f"[ERROR] Failed to create topic '{topic}': {e}")
        sys.exit(1)

    # 메타데이터 리프레시(선택)
    time.sleep(1)
    md = admin.list_topics(timeout=5)
    print(f"[META] Topics now: {', '.join(sorted(md.topics.keys()))}")

if __name__ == "__main__":
    # create_topic("weather_test", num_partitions=3, replication_factor=1)
    # create_topic("ultraviolet-rays", num_partitions=3, replication_factor=1)
    # create_topic("air-pollution", num_partitions=3, replication_factor=1)
    # create_topic("airflow-test", num_partitions=3, replication_factor=1)
    # create_topic("ultraviolet-rays-test", num_partitions=3, replication_factor=3)
    # create_topic("air-pollution-test", num_partitions=3, replication_factor=3)
    pass
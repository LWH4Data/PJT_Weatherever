# ---- 0) JAR 다운로드 전용 스테이지 ----
FROM curlimages/curl:8.10.1 AS jars
ARG KAFKA_CLIENT_VERSION=3.5.1   # ← 브로커 3.6이면 3.6.0로 바꿔 빌드 가능
ARG POOL2_VERSION=2.11.1
ARG MYSQL_VERSION=8.4.0

WORKDIR /tmp/jars
RUN set -eux; \
    # Spark 3.5.1용 Kafka 커넥터 + 토큰 프로바이더
    curl -fsSLO https://repo1.maven.org/maven2/org/apache/spark/spark-sql-kafka-0-10_2.12/3.5.1/spark-sql-kafka-0-10_2.12-3.5.1.jar && \
    curl -fsSLO https://repo1.maven.org/maven2/org/apache/spark/spark-token-provider-kafka-0-10_2.12/3.5.1/spark-token-provider-kafka-0-10_2.12-3.5.1.jar && \
    # Kafka 클라이언트 (드라이버/워커 모두 동일 버전 사용)
    curl -fsSLO https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/${KAFKA_CLIENT_VERSION}/kafka-clients-${KAFKA_CLIENT_VERSION}.jar && \
    # 필수: commons-pool2 (NoClassDefFoundError 원인)
    curl -fsSLO https://repo1.maven.org/maven2/org/apache/commons/commons-pool2/${POOL2_VERSION}/commons-pool2-${POOL2_VERSION}.jar && \
    # MySQL JDBC
    curl -fsSLO https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/${MYSQL_VERSION}/mysql-connector-j-${MYSQL_VERSION}.jar && \
    # (권장) 압축 코덱
    curl -fsSLO https://repo1.maven.org/maven2/org/lz4/lz4-java/1.8.0/lz4-java-1.8.0.jar && \
    curl -fsSLO https://repo1.maven.org/maven2/org/xerial/snappy/snappy-java/1.1.10.5/snappy-java-1.1.10.5.jar

# ---- 1) 실제 Spark 이미지 ----
FROM bitnami/spark:3.5.1
USER root

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# JAR 복사 (bitnami 기본 유저는 1001)
COPY --chown=1001:0 --from=jars /tmp/jars/*.jar /opt/bitnami/spark/jars/

# PySpark 경로
ENV PYSPARK_PYTHON=/opt/bitnami/python/bin/python \
    PYSPARK_DRIVER_PYTHON=/opt/bitnami/python/bin/python

USER 1001

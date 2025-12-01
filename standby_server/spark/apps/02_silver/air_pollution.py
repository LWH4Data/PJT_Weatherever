# spark/apps/02_silver/air_pollution.py

# 기존 세션 정리
try:
    spark.stop()
except Exception:
    pass

import os
from pyspark.sql import SparkSession, functions as F, types as T

# =========================
# 0) ENV 읽기 (필수)
# =========================
# Kafka
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS") or ",".join([
    # 필요시 하드코딩 fallback (없으면 env만 사용)
    "j13b102a.p.ssafy.io:19092",
    "52.78.128.129:19092",
    "ec2-13-210-240-255.ap-southeast-2.compute.amazonaws.com:19092",
])
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "air-pollution")
KAFKA_STARTING = os.getenv("KAFKA_STARTING_OFFSETS", "earliest")
KAFKA_ENDING   = os.getenv("KAFKA_ENDING_OFFSETS", "latest")

# MySQL 접속 정보
MYSQL_HOST = os.getenv("MYSQL_HOST", "ssafy-mysql-db.mysql.database.azure.com")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB   = os.getenv("MYSQL_DB",   "S13P21B102")
MYSQL_USER = os.getenv("MYSQL_USER", "S13P21B102")
MYSQL_PASS = os.getenv("MYSQL_PASS", "dQAPoOeD0z")
MYSQL_URL  = jdbc_url = (
    f"jdbc:mysql://{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    "?useUnicode=true&characterEncoding=utf8"
    "&serverTimezone=Asia/Seoul"
    "&sslMode=REQUIRED"
    "&rewriteBatchedStatements=true"
    "&useServerPrepStmts=false"
    "&connectTimeout=20000"
    "&socketTimeout=600000"
)
MYSQL_TABLE = "air_pollution_data"
MYSQL_DRIVER = "com.mysql.cj.jdbc.Driver"

# =========================
# 1) Spark 세션
# =========================
spark = (
    SparkSession.builder
    .appName("air_pollution_kafka_to_mysql")
    .config(
        "spark.jars.packages",
        ",".join([
            "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1",
            "org.apache.kafka:kafka-clients:3.6.0",
            "com.mysql:mysql-connector-j:8.4.0",
        ])
    )
    .getOrCreate()
)
spark.conf.set("spark.sql.session.timeZone", "Asia/Seoul")

print("[INFO] Kafka:", KAFKA_BOOTSTRAP_SERVERS)
print("[INFO] Topic:", KAFKA_TOPIC)
print("[INFO] MySQL:", f"{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB} -> {MYSQL_TABLE}")

# =========================
# 2) Kafka 배치 읽기
# =========================
raw = (
    spark.read
    .format("kafka")
    .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS)
    .option("subscribe", KAFKA_TOPIC)
    .option("startingOffsets", KAFKA_STARTING)  # earliest / latest
    .option("endingOffsets",   KAFKA_ENDING)
    .load()
    .selectExpr("CAST(value AS STRING) AS value")
)

# =========================
# 3) JSON 파싱 (items를 Array<Map<String,String>>로)
#    response.body.items 배열/객체/대소문자 혼재 모두 대응
# =========================
items_json = F.get_json_object(F.col("value"), "$.response.body.items")
arr_of_maps_schema = T.ArrayType(T.MapType(T.StringType(), T.StringType()))

parsed = raw.select(F.from_json(items_json, arr_of_maps_schema).alias("items"))
exploded = parsed.select(F.explode_outer("items").alias("m"))

# 키를 전부 소문자로 통일
lower_m = F.map_from_entries(
    F.transform(
        F.map_entries(F.col("m")),
        lambda e: F.struct(F.lower(e["key"]).alias("key"), e["value"].alias("value"))
    )
)

# 필요한 키 추출 + PM10만 필터
df_pm10 = (
    exploded.select(
        F.element_at(lower_m, F.lit("informcode")).alias("informCode"),
        F.element_at(lower_m, F.lit("informdata")).alias("informData"),
        F.element_at(lower_m, F.lit("informgrade")).alias("informGrade"),
    )
    .filter(F.upper(F.col("informCode")) == "PM10")
    .dropDuplicates()
)

# =========================
# 4) informGrade → location_code / grade 행 분해
#    "서울 : 좋음,경기남부 : 보통,..." → 행별 분리
# =========================
df_pairs = (
    df_pm10
    .withColumn(
        "pairs",
        F.transform(
            F.split(F.col("informGrade"), ","),
            lambda s: F.trim(s)
        )
    )
    .withColumn("pair", F.explode_outer("pairs"))
    .withColumn(
        "kv",
        F.split(F.regexp_replace(F.col("pair"), r"\s*:\s*", ":"), ":")
    )
    .withColumn("location_code", F.when(F.size(F.col("kv")) >= 1, F.col("kv").getItem(0)))
    .withColumn("grade",         F.when(F.size(F.col("kv")) >= 2, F.col("kv").getItem(1)))
    .select("informData", "location_code", "grade")
    .filter(F.col("location_code").isNotNull() & F.col("grade").isNotNull())
)

# =========================
# 5) forecast_datetime 변환
#    informData: 'YYYY-MM-DD' → KST 자정 timestamp
# =========================
# MySQL TIMESTAMP은 타임존 민감. 여기서는 KST 자정을 그대로 timestamp로 저장.
df_out = (
    df_pairs
    .withColumn("_date", F.to_date("informData", "yyyy-MM-dd"))
    .withColumn("forecast_datetime", F.to_timestamp(F.date_format(F.col("_date"), "yyyy-MM-dd 00:00:00")))
    .select("forecast_datetime", "location_code", "grade")
    .dropDuplicates()
)

# =========================
# 6) MySQL 적재 (REPLACE: TRUNCATE 후 새 데이터로 대체)
#   - 배치 건수가 0이면 안전상 스킵(테이블 유지)
#   - 배치 건수가 1+면 TRUNCATE TABLE 후 INSERT (스키마 보존)
# =========================
row_cnt = df_out.count()
print(f"[INFO] batch row count to write: {row_cnt}")

if row_cnt == 0:
    print("[SAFEGUARD] No rows to write. Skipping TRUNCATE+OVERWRITE to avoid clearing the table.")
else:
    (df_out.write
        .format("jdbc")
        .option("url", MYSQL_URL)
        .option("dbtable", MYSQL_TABLE)
        .option("user", MYSQL_USER)
        .option("password", MYSQL_PASS)
        .option("driver", MYSQL_DRIVER)
        .option("truncate", "true")   # ✅ TRUNCATE TABLE 후 INSERT (스키마 유지)
        .mode("overwrite")            # ✅ overwrite + truncate=true → 대체
        .save()
    )
    print(f"[SUCCESS] Replaced table {MYSQL_TABLE} with {row_cnt} rows.")

# 종료
spark.stop()

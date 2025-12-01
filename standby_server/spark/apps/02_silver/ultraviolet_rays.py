from pyspark.sql import SparkSession, functions as F, types as T
import os

# 기존 세션 정리
try:
    spark.stop()
except Exception:
    pass

# Spark 세션 (MySQL JDBC 포함)
spark = (
    SparkSession.builder
    .appName("uv_topic_extract_to_mysql_3h_utc")
    .config(
        "spark.jars.packages",
        "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1,"
        "org.apache.kafka:kafka-clients:3.6.0,"
        "com.mysql:mysql-connector-j:8.4.0"
    )
    .getOrCreate()
)
# KST로 파싱
spark.conf.set("spark.sql.session.timeZone", "Asia/Seoul")

# Kafka 부트스트랩/토픽
KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS") or ",".join([
    "j13b102a.p.ssafy.io:19092",
    "52.78.128.129:19092",
    "ec2-13-210-240-255.ap-southeast-2.compute.amazonaws.com:19092",
])
KAFKA_TOPIC = "ultraviolet-rays"

print("Kafka bootstrap:", KAFKA_BOOTSTRAP)
print("Kafka topic    :", KAFKA_TOPIC)

# 1) 토픽 읽기 (배치)
raw = (
    spark.read
    .format("kafka")
    .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP)
    .option("subscribe", KAFKA_TOPIC)
    .option("startingOffsets", "earliest")
    .option("endingOffsets", "latest")
    .load()
    .selectExpr("CAST(value AS STRING) AS value")
)

# 2) items.item 배열 파싱 → 키 소문자 통일
items_json = F.get_json_object(F.col("value"), "$.response.body.items.item")
arr_schema = T.ArrayType(T.MapType(T.StringType(), T.StringType()))
items = raw.select(F.from_json(items_json, arr_schema).alias("items"))
exploded = items.select(F.explode_outer("items").alias("m"))

lower_m = F.map_from_entries(
    F.transform(
        F.map_entries(F.col("m")),
        lambda e: F.struct(F.lower(e["key"]).alias("key"), e["value"].alias("value"))
    )
)

# 3) uv_index = [h0,h3,h6,h9,h12,h15,h18,h21]
hours_keys = ["h0","h3","h6","h9","h12","h15","h18","h21"]
uv_index_arr = F.array(*[
    F.when(F.length(F.element_at(lower_m, F.lit(h))) == 0, None)
     .otherwise(F.element_at(lower_m, F.lit(h)).cast("int"))
    for h in hours_keys
])

# 4) 기본 컬럼 선택
df_uv = (
    exploded.select(
        F.element_at(lower_m, F.lit("date")).alias("forecast_datetime"),  # 'yyyyMMddHH' (KST)
        F.element_at(lower_m, F.lit("areano")).alias("area_no"),
        uv_index_arr.alias("uv_index")
    )
    .filter(F.col("forecast_datetime").isNotNull() & F.col("area_no").isNotNull())
    .dropDuplicates()
)

# 5) 3시간 포인트 전개 (문자열 기반 매핑 → 마지막에만 TS/UTC 변환)
offset_hours = [0, 3, 6, 9, 12, 15, 18, 21, 24]

# h 오프셋과 uv 배열을 zip → 행으로 전개 (TS 연산 없음)
df_uv_exp = (
    df_uv
    .withColumn("h_arr", F.array(*[F.lit(h) for h in offset_hours]))
    .withColumn("zipped", F.arrays_zip("h_arr", "uv_index"))
    .withColumn("e", F.explode("zipped"))
    .select(
        F.col("forecast_datetime").alias("base_dt_str"),  # 'yyyyMMddHH' (KST 문자열)
        "area_no",
        F.col("e.h_arr").cast("int").alias("h"),
        F.col("e.uv_index").cast("int").alias("uv_index"),
    )
    .filter(F.col("uv_index").isNotNull())
)

# 문자열 기반으로 날짜/시 계산: (기준 시 + h) → 일 이월/시 모듈러
df_uv_long = (
    df_uv_exp
    .withColumn("base_ymd",  F.substring("base_dt_str", 1, 8))                 # 'yyyyMMdd'
    .withColumn("base_hour", F.substring("base_dt_str", 9, 2).cast("int"))     # 0~23
    .withColumn("sum_hour",  F.col("base_hour") + F.col("h"))
    .withColumn("carry_day", (F.col("sum_hour") / F.lit(24)).cast("int"))      # ✅ INT로 캐스팅
    .withColumn("hour_mod",  F.pmod(F.col("sum_hour"), F.lit(24)).cast("int")) # 0~23
    .withColumn(
        "date_kst",
        F.date_add(F.to_date("base_ymd", "yyyyMMdd"), F.col("carry_day").cast("int"))  # ✅ INT
    )
    .withColumn(
        "forecast_kst_str",
        F.concat_ws(
            " ",
            F.date_format(F.col("date_kst"), "yyyy-MM-dd"),
            F.format_string("%02d:00:00", F.col("hour_mod"))
        )
    )
)


# ===== 여기까지가 너가 본 출력과 동일(KST 기준) =====
# df_uv_long.show(100, truncate=False)

# 6) DB 스키마/UTC 저장
# KST 문자열 → (세션=Asia/Seoul) to_timestamp 로 "이미 UTC 순간"이 됨
df_to_write = (
    df_uv_long
    .withColumn("forecast_datetime",
        F.to_timestamp("forecast_kst_str", "yyyy-MM-dd HH:mm:ss")
    )
    .select(
        "forecast_datetime",                               # ← 이 값이 이미 UTC 순간
        F.col("area_no").cast("bigint").alias("area_no"),
        F.col("uv_index").cast("decimal(5,2)").alias("uv_index")
    )
    .dropDuplicates(["area_no", "forecast_datetime"])
)

rows = df_to_write.count()
print("[INFO] rows to write:", rows)

# 7) MySQL 적재 (TRUNCATE + OVERWRITE)
MYSQL_HOST = os.getenv("MYSQL_HOST", "ssafy-mysql-db.mysql.database.azure.com")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB   = os.getenv("MYSQL_DB",   "S13P21B102")
MYSQL_USER = os.getenv("MYSQL_USER", "S13P21B102")
MYSQL_PASS = os.getenv("MYSQL_PASS", "dQAPoOeD0z")
MYSQL_TABLE = os.getenv("MYSQL_TABLE", "uv_data")

# ✅ JDBC URL UTC 고정 (이중 시프트 방지)
MYSQL_URL = (
    f"jdbc:mysql://{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    "?useUnicode=true&characterEncoding=utf8"
    "&serverTimezone=UTC"
    "&sessionVariables=time_zone=%27%2B00:00%27"
    "&sslMode=REQUIRED"
    "&rewriteBatchedStatements=true"
    "&useServerPrepStmts=false"
)

if rows == 0:
    print("[SAFEGUARD] No rows to write. Skip TRUNCATE+OVERWRITE.")
else:
    (df_to_write.coalesce(1)
        .write
        .format("jdbc")
        .option("url", MYSQL_URL)
        .option("dbtable", MYSQL_TABLE)
        .option("user", MYSQL_USER)
        .option("password", MYSQL_PASS)
        .option("driver", "com.mysql.cj.jdbc.Driver")
        .option("truncate", "true")
        .mode("overwrite")
        .save()
    )
    print(f"[SUCCESS] replaced {MYSQL_TABLE} with {rows} rows.")

# 세션 종료
spark.stop()
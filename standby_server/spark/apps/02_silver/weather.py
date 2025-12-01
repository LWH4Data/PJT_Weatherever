# 맨 위에 추가
try:
    spark.stop()
except Exception:
    pass

# /home/jovyan/apps/weather_to_mysql_batch.py
from pyspark.sql import SparkSession, functions as F, types as T
import os

# ===================== 설정 =====================
GRID_X = 149
GRID_Y = 253

# 추출할 value 들의 key 목록을 리스트로 지정한다.
EXPECTED_VARS = ["PCP","POP","PTY","REH","SKY","SNO","TMP","UUU","VVV","WAV","VEC","WSD"]  # 12개

# Kafka Broker를 설정한다.
BROKERS = [
    "j13b102a.p.ssafy.io:19092",
    "52.78.128.129:19092",
    "ec2-13-210-240-255.ap-southeast-2.compute.amazonaws.com:19092",
]
KAFKA_BOOTSTRAP = ",".join(BROKERS)
KAFKA_TOPIC = "weather-final"

# 데이터를 전송할 엔드포인트 MySQL 접속 정보 (환경변수 권장)
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
TABLE_NAME = "forecast_weather_data"

# ===================== Spark =====================
# Spark 앱을 설정한다.
spark = (
    SparkSession.builder
    .appName("weather_to_mysql_batch")
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
spark.conf.set("spark.sql.session.timeZone", "Asia/Seoul")  # yyyyMMddHH → KST로 파싱/저장

# ===================== 1) Kafka 배치 읽기 =====================
raw = (
    spark.read
    .format("kafka")
    .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP)
    .option("subscribe", KAFKA_TOPIC)
    .option("startingOffsets", "earliest")
    .option("endingOffsets", "latest")
    .load()
    .selectExpr("CAST(value AS STRING) AS value_str")
)

# ===================== 2) 내부 JSON 파싱 =====================
# JSON 형식으로 된 데이터를 topic에서 읽는다.
m  = F.from_json("value_str", T.MapType(T.StringType(), T.StringType()))
kv = (raw.withColumn("m", m)
          .where(F.col("m").isNotNull())
          .withColumn("json_key", F.map_keys("m")[0])
          .withColumn("json_val", F.map_values("m")[0]))

# 읽어온 JSON의 key를 파싱한다.
# key: tmfc-tmef-var
parts = F.split(F.col("json_key"), "-")
kv = (kv.withColumn("tmfc", parts.getItem(0))
       .withColumn("tmef", parts.getItem(1))
       .withColumn("var",  parts.getItem(2)))

# Key 전처리
#   - var: 공백/개행 제거 → 대문자 변환 → 영문자 외 문자 제거 → 필터링
kv = kv.withColumn("var", F.regexp_replace(F.upper(F.trim(F.col("var"))), r"[^A-Z]", ""))
kv = kv.filter(F.col("var").isin(EXPECTED_VARS))

# ===================== 3) 값 문자열 → double 배열 =====================
# 공백/개행 제거 → split → 빈 토큰 제거 → -999/-99 → NULL → 길이 고정(37697)
clean        = F.regexp_replace(F.col("json_val"), r"\s+", "")
arr_str_raw  = F.split(clean, ",")
arr_str      = F.filter(arr_str_raw, lambda s: F.length(F.trim(s)) > 0)

# -999, -99 계열은 NULL로 변환
arr_dbl = F.transform(
    arr_str,
    lambda s: F.when((F.trim(s) == "") | s.isNull(), F.lit(None).cast("double"))
              .when(F.trim(s).isin("-999","-999.0","-999.00","-99","-99.0","-99.00"),
                    F.lit(None).cast("double"))
              .otherwise(F.trim(s).cast("double"))
)

# 전체 격자(X * Y)로 길이를 고정한다.
expected_len = GRID_X * GRID_Y  # 37697
values_fixed = F.when(F.size(arr_dbl) > expected_len,
                      F.slice(arr_dbl, 1, expected_len)
               ).otherwise(arr_dbl)

kv = kv.withColumn("values", values_fixed)

# ===================== 4) 그리드 전개 + (x,y) 필터 =====================
# values 배열을 포지션 익스플로드하여 (idx, val) 쌍으로 전개
# → x, y 좌표 계산
exp = kv.select("tmef","var", F.posexplode("values").alias("idx","val"))
exp = (exp
       .withColumn("x", ((F.col("idx") % F.lit(GRID_X)) + 1).cast("int"))
       .withColumn("y", (F.floor(F.col("idx") / F.lit(GRID_X)) + 1).cast("int"))
)

# ✅ x: 17~142, y: 30~153만 사용
exp = exp.filter( (F.col("x").between(17, 142)) & (F.col("y").between(30, 153)) )

# ===================== 5) 피벗(가로 확장) =====================
# - tmef, x, y 기준으로 var 컬럼을 피벗하여 wide 포맷으로 변환
wide = (
    exp.select(
        F.col("tmef").alias("Forecast_datetime"),
        "x","y","var", F.col("val").alias("value")
    )
    .groupBy("Forecast_datetime","x","y")
    .pivot("var", EXPECTED_VARS)      # 12개 컬럼 강제 생성
    .agg(F.first("value", ignorenulls=True))
)

# 누락 컬럼 보강(드물게 입력이 비면 pivot이 컬럼을 안 만들 수 있으니)
for v in EXPECTED_VARS:
    if v not in wide.columns:
        wide = wide.withColumn(v, F.lit(None).cast("double"))

# ===================== 6) DB 스키마로 캐스팅/리네임 =====================
# - forecast_datetime: 'yyyyMMddHH' → timestamp(Asia/Seoul)
# - pty/pcp/sno/sky: VARCHAR(10) → 문자열로 변환 (정수코드는 소수점 제거)
def as_str_no_trailing_zero(col):
    # 예: 3.0 -> "3", 3.50 -> "3.5"
    return F.when(col.isNull(), F.lit(None).cast("string")) \
            .otherwise(F.regexp_replace(col.cast("string"), r"\.0+$", ""))

def as_str_2f(col):
    return F.when(col.isNull(), F.lit(None).cast("string")) \
            .otherwise(F.format_string("%.2f", col))

# - 나머지 수치형 컬럼들: DECIMAL(5,2)
# - 체감온도 컬럼 추가: DECIMAL(5,2)
df_out = (
    wide
    .withColumn("_local_ts",
                F.to_timestamp(F.col("Forecast_datetime"), "yyyyMMddHH"))
    .withColumn("forecast_datetime",
                F.to_utc_timestamp(F.col("_local_ts"), "Asia/Seoul"))
    .drop("_local_ts")
    # 문자열형 컬럼들
    .withColumn("pty", as_str_no_trailing_zero(F.col("PTY")))
    .withColumn("pcp", as_str_2f(F.col("PCP")))
    .withColumn("sno", as_str_2f(F.col("SNO")))
    .withColumn("sky", as_str_no_trailing_zero(F.col("SKY")))
    # 수치형 컬럼들 → DECIMAL(5,2)
    .withColumn("pop", F.col("POP").cast("decimal(5,2)"))
    .withColumn("reh", F.col("REH").cast("decimal(5,2)"))
    .withColumn("tmp", F.col("TMP").cast("decimal(5,2)"))
    .withColumn("uuu", F.col("UUU").cast("decimal(5,2)"))
    .withColumn("vvv", F.col("VVV").cast("decimal(5,2)"))
    .withColumn("wav", F.col("WAV").cast("decimal(5,2)"))
    .withColumn("vec", F.col("VEC").cast("decimal(5,2)"))
    .withColumn("wsd", F.col("WSD").cast("decimal(5,2)"))
    # (앞부분 동일) ...
    .withColumn("_tmp_d",   F.col("tmp").cast("double")) \
    # WSD가 m/s이면 ×3.6, 이미 km/h면 이 줄을 F.col("wsd")로
    .withColumn("_wsd_kmh", (F.col("wsd").cast("double") * F.lit(3.6))) \
    .withColumn("_wsd_p016", F.pow(F.col("_wsd_kmh"), F.lit(0.16))) \

    # ↓↓↓ 이 블록을 넣으면 됨
    .withColumn(
        "feels_like_temp",
        F.when(F.col("tmp").isNull() | F.col("wsd").isNull(), F.lit(None).cast("double"))
        .otherwise(
            F.lit(13.12)
            + F.lit(0.6215) * F.col("_tmp_d")
            - F.lit(11.37)  * F.col("_wsd_p016")
            + F.lit(0.3965) * F.col("_wsd_p016") * F.col("_tmp_d")
        )
    ) \
    # 결과 스키마에 맞게 소수 둘째 자리 반올림 + DECIMAL(5,2)로 캐스팅
    .withColumn("feels_like_temp", F.bround(F.col("feels_like_temp"), 2).cast("decimal(5,2)")) \
    .drop("_tmp_d","_wsd_kmh","_wsd_p016"))

# ===================== 7) MySQL로 저장 (TRUNCATE 후 INSERT) =====================
# - mode("overwrite") + option("truncate","true") → TRUNCATE TABLE 유지(스키마 보존)
# - dbtable은 기존 테이블명

# DB에 전송을 위한 설정.
(df_out.write
    .format("jdbc")
    .option("url", MYSQL_URL)
    .option("dbtable", TABLE_NAME)
    .option("user", MYSQL_USER)
    .option("password", MYSQL_PASS)
    .option("driver", "com.mysql.cj.jdbc.Driver")   # ← 추가
    .option("truncate", "true")   # 중요: TRUNCATE 후 INSERT (테이블 스키마 유지)
    .mode("overwrite")
    .save()
)

print("✅ Wrote rows:", df_out.count())

# 세션 종료
spark.stop()

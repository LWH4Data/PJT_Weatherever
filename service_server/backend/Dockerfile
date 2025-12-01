# 1. 멀티 스테이징 빌드 시작
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# 2. 작업 디렉토리
WORKDIR /backend

# 3. pom.xml 복사
COPY pom.xml ./

# 4. 의존성 캐시 미리 당겨두기 (테스트 생략)
#    BuildKit 사용 시 캐시마운트로 재빌드 속도 극대화
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B dependency:go-offline

# 6. 전체 코드 복사 후 빌드
COPY . .


RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -DskipTests clean package
#    mvn -B package -DskipTests
    
# 7. plain 아닌 JAR를 app.jar로 고정
#   - target 아래의 *.jar 중 소스/자바독 제외
#   - 첫 번째 매칭을 app.jar로 리네임
RUN set -eu; \
    JAR_FILE="$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*-sources.jar' ! -name '*-javadoc.jar' -print -quit)"; \
    test -n "$JAR_FILE"; \
    mv "$JAR_FILE" target/app.jar

# 8. 경량 JDK 이미지로 실행 환경 구성
FROM openjdk:17-jdk-slim

# 9. 바인드 마운트를 backend에 적용하기에 jar 파일은 다른 디렉토리를 활용.
WORKDIR /app

# 10. 설정한 app에 .jar 파일을 위치.
COPY --from=builder /backend/target/app.jar backend.jar

# 11. 실행 시 명령어 전달.
ENTRYPOINT ["java", "-jar", "backend.jar"]

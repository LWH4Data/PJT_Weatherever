# 1. 프론트의 원본 이지미를 가져온다.
FROM node:22.17.1

# 2. 컨테이너 내에서 다룰 작업 디렉토리 설정 
# (현재와 동일한 명칭 사용)
WORKDIR /frontend

# 3. pnpm 설치
# RUN npm install -g pnpm \
#   && pnpm config set store-dir /root/.local/share/pnpm/store

# 4. 의존성 관리를 위해 호스트 머신의 의존성 파일을 복사
# package.json, pnpm-lock.yaml: 복사할 대상 파일
# ./: 현재 디렉터리를 의미.
COPY package.json package-lock.json* ./


# NOTE: lockfile 있으면 재현성 있게 설치, 없으면 일반 설치
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi


# 5. COPY한 결과를 기반으로 의존성 업데이트
# RUN pnpm install

# 6. 애플리케이션 코드 복사
# 호스트 머신의 모든 파일을 컨테이너 내의 디렉토리(현재 /frontend)로 복사
COPY . .

# 7. Next.js 개발 서버 포트 노출
# 컨테이너 내에서 3000 포트를 노출.
EXPOSE 3000

# 8. Next.js 서버 자동 실행을 위한 코드 작성
CMD ["npm", "start"]
/**
 * 애플리케이션 환경변수 설정 관리
 * 모든 환경변수를 중앙에서 관리하고 타입 안전성을 보장합니다.
 */

// API 엔드포인트 상수 정의 (환경에 관계없이 고정)
export const API_ENDPOINTS = {
  WEATHER: '/weather',
  USER: '/user', 
  CLOTHING: '/weather/clothes',
} as const;

// 기본 설정값들 (환경에 관계없이 고정)
export const DEFAULT_CONFIG = {
  API_TIMEOUT: 10000, // 10초
  WEATHER_UPDATE_INTERVAL: 3600000, // 1시간 (ms)
  LOCATION_TIMEOUT: 15000, // 15초
} as const;

export const config = {
  // API 기본 설정 (환경변수에서 가져오기)
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    version: process.env.EXPO_PUBLIC_API_VERSION || 'v1',
    timeout: DEFAULT_CONFIG.API_TIMEOUT,
  },
  
  // 앱 환경 설정
  app: {
    env: process.env.EXPO_PUBLIC_APP_ENV || 'development',
    isDevelopment: process.env.EXPO_PUBLIC_APP_ENV === 'development',
    isProduction: process.env.EXPO_PUBLIC_APP_ENV === 'production',
  },
  
  // 각 서비스별 완전한 URL 생성 헬퍼
  urls: {
    weather: (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080') + API_ENDPOINTS.WEATHER,
    user: (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080') + API_ENDPOINTS.USER,
    clothing: (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080') + API_ENDPOINTS.CLOTHING,
  },
  
  // 기타 설정값들
  timeouts: {
    api: DEFAULT_CONFIG.API_TIMEOUT,
    location: DEFAULT_CONFIG.LOCATION_TIMEOUT,
  },
  
  intervals: {
    weatherUpdate: DEFAULT_CONFIG.WEATHER_UPDATE_INTERVAL,
  },
} as const;

// 환경변수 유효성 검사 함수
export const validateConfig = (): void => {
  const requiredEnvVars = [
    'EXPO_PUBLIC_API_BASE_URL',
  ] as const;
  
  const missingVars: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Missing environment variables: ${missingVars.join(', ')}. ` +
      'Using fallback values. Check your .env file.'
    );
  }
  
  // 개발 모드에서 설정 정보 로깅
  if (config.app.isDevelopment) {
    // 설정 정보 로깅 제거
  }
};

// 앱 시작시 설정 검증
validateConfig();

import { WeatherData, LocationData } from '../types';
import { config } from '../utils';

// 성능 측정을 위한 간단한 타이머 클래스
class PerformanceTimer {
  private startTime: number | null = null;
  
  constructor(private label: string) {}
  
  start() {
    this.startTime = performance.now();
  }
  
  end() {
    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      console.log(`⏱️ [${this.label}] 완료: ${duration.toFixed(2)}ms`);
      this.startTime = null;
      return duration;
    }
    return 0;
  }
}

// 새로운 config 구조에서 설정 로드
const REQUEST_TIMEOUT = config.timeouts.api;
const WEATHER_API_URL = config.urls.weather;

/**
 * 위치 정보를 기반으로 날씨 데이터를 가져오는 메인 서비스 함수
 */
export const getWeatherData = async (location: LocationData): Promise<WeatherData> => {
  // 성능 측정 타이머 설정
  const totalTimer = new PerformanceTimer('날씨 API 전체');
  const networkTimer = new PerformanceTimer('네트워크 요청');
  const processingTimer = new PerformanceTimer('데이터 처리');
  
  const url = `${WEATHER_API_URL}?lat=${location.latitude}&lon=${location.longitude}`;
  
  totalTimer.start();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    // 네트워크 요청 시작
    networkTimer.start();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.warn('Unexpected content type:', contentType, 'Response:', responseText);
      throw new Error(`Expected JSON response but got ${contentType}`);
    }
    
    const apiData = await response.json();
    networkTimer.end();
    
    // 데이터 처리 시작
    processingTimer.start();
    
    // API 응답을 WeatherData 형식으로 변환
    const weatherData: WeatherData = {
      temperature: Math.round(apiData.temperature || 0),
      condition: determineWeatherCondition({
        precipitationType: apiData.precipitationType,
        precipitation: apiData.oneHourPrecipitation,
        humidity: apiData.humidity
      }),
      humidity: Math.round(apiData.humidity || 0),
      windSpeed: Math.round(apiData.windSpeed || 0),
    };
    
    // 설명 생성
    weatherData.description = generateWeatherDescription(weatherData);
    
    processingTimer.end();
    
    totalTimer.end();
    return weatherData;
  } catch (error) {
    totalTimer.end();
    console.error('Weather API request failed:', {
      url,
      error: error instanceof Error ? error.message : String(error)
    });
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw new Error('네트워크 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요. (URL: ' + url + ')');
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`요청 시간이 초과되었습니다. (서버 응답 시간: ${REQUEST_TIMEOUT}ms)`);
    }
    
    throw error;
  }
};

/**
 * 강수 타입을 날씨 조건으로 변환하는 원자적 함수 (레거시 지원용)
 */
const transformPrecipitationType = (precipitationType: string): string => {
  const typeMap: Record<string, string> = {
    '없음': '맑음',
    '비': '비',
    '눈': '눈',
    '비/눈': '진눈깨비',
    '소나기': '소나기',
  };
  
  return typeMap[precipitationType] || '흐림';
};

/**
 * 종합적인 날씨 상황 판단 함수 (개선된 버전)
 * precipitationType, 실제 강수량, 습도를 모두 고려하여 정확한 날씨 상태 결정
 */
interface WeatherConditionParams {
  precipitationType?: string;
  precipitation?: number;
  humidity?: number;
}

const determineWeatherCondition = (params: WeatherConditionParams): string => {
  const { precipitationType, precipitation = 0, humidity = 0 } = params;
  
  // 1순위: 실제 강수량이 있는 경우
  if (precipitation > 0) {
    // precipitationType으로 비의 종류 세분화
    if (precipitationType === '눈') return '눈';
    if (precipitationType === '비/눈') return '진눈깨비';
    if (precipitationType === '소나기') return '소나기';
    
    // 강수량에 따른 비 강도 구분
    if (precipitation >= 3.0) return '폭우';
    if (precipitation >= 1.0) return '비';
    return '가벼운 비'; // 0.1~0.9mm
  }
  
  // 2순위: 높은 습도 + precipitationType 조합으로 판단
  if (humidity >= 90) {
    if (precipitationType === '비' || precipitationType === '소나기') {
      return '비 예보'; // 곧 비가 올 가능성
    }
    if (precipitationType === '눈') return '눈 예보';
    return '매우 흐림'; // 습도 높고 흐린 상태
  }
  
  // 3순위: precipitationType만으로 판단
  if (precipitationType) {
    const typeMap: Record<string, string> = {
      '없음': humidity >= 70 ? '흐림' : '맑음', // 습도 고려
      '비': '비',
      '눈': '눈',
      '비/눈': '진눈깨비',
      '소나기': '소나기',
    };
    
    return typeMap[precipitationType] || '흐림';
  }
  
  // 4순위: 습도만으로 판단
  if (humidity >= 80) return '흐림';
  if (humidity >= 60) return '구름많음';
  
  return '맑음';
};

/**
 * 날씨 데이터를 기반으로 설명을 생성하는 원자적 함수
 */
const generateWeatherDescription = (weatherData: WeatherData): string => {
  const { temperature, condition, humidity, windSpeed } = weatherData;
  
  // 온도 기반 기본 메시지
  let baseMessage = '';
  if (temperature >= 30) {
    baseMessage = '🌡️ 매우 더운 날씨입니다!';
  } else if (temperature >= 25) {
    baseMessage = '☀️ 따뜻한 날씨입니다!';
  } else if (temperature >= 15) {
    baseMessage = '🌤️ 쾌적한 날씨입니다!';
  } else if (temperature >= 5) {
    baseMessage = '🧥 쌀쌀한 날씨입니다!';
  } else {
    baseMessage = '❄️ 매우 추운 날씨입니다!';
  }
  
  // 날씨 상태별 추가 정보 (확장됨)
  const conditionMessages: Record<string, string> = {
    '비': '🌧️ 우산을 챙기세요!',
    '가벼운 비': '🌦️ 가벼운 비가 내리고 있어요!',
    '폭우': '⛈️ 폭우가 내리고 있습니다! 외출 시 주의하세요!',
    '눈': '⛄ 따뜻하게 입고 미끄러움에 주의하세요!',
    '소나기': '🌦️ 갑작스러운 비에 대비하세요!',
    '진눈깨비': '🌨️ 미끄러운 길에 조심하세요!',
    '흐림': '☁️ 구름이 많은 하루입니다!',
    '매우 흐림': '☁️ 매우 흐리고 습한 날씨입니다!',
    '구름많음': '⛅ 구름이 많지만 괜찮은 날씨예요!',
    '비 예보': '🌧️ 곧 비가 올 수 있으니 우산을 준비하세요!',
    '눈 예보': '❄️ 곧 눈이 올 수 있습니다!',
  };
  
  // 습도 정보 추가
  let humidityMessage = '';
  if (humidity && humidity >= 70) {
    humidityMessage = ' 습도가 높아 끈적할 수 있어요.';
  } else if (humidity && humidity <= 30) {
    humidityMessage = ' 건조하니 수분 섭취를 충분히 하세요.';
  }
  
  // 바람 정보 추가
  let windMessage = '';
  if (windSpeed && windSpeed >= 10) {
    windMessage = ' 바람이 강하니 주의하세요.';
  }
  
  return `${baseMessage} ${conditionMessages[condition] || ''} ${humidityMessage}${windMessage}`.trim();
};

/**
 * 날씨 서비스 객체
 */
export const weatherService = {
  getWeatherData,
};

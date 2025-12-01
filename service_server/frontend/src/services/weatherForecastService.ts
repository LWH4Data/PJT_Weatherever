import { WeatherForecastResponse, WeatherForecastItem, HourlyWeatherData, WeatherIconData, SKY_CONDITIONS, PRECIPITATION_TYPES } from '../types';
import { config } from '../utils';

/**
 * 날씨 예보 API 요청 타임아웃 (ms)
 */
const FORECAST_API_TIMEOUT = config.timeouts.api;

/**
 * 날씨 아이콘 매핑 테이블
 */
const WEATHER_ICON_MAP: Record<string, WeatherIconData> = {
  // 맑음 계열
  'sunny_none': { icon: '☀️', description: '맑음', color: '#FFD700' },
  'sunny_rain': { icon: '🌦️', description: '가벼운 비', color: '#87CEEB' },
  'sunny_sleet': { icon: '🌨️', description: '진눈깨비', color: '#B0C4DE' },
  'sunny_snow': { icon: '❄️', description: '눈', color: '#FFFFFF' },
  'sunny_shower': { icon: '🌦️', description: '소나기', color: '#4682B4' },
  
  // 구름많음 계열
  'cloudy_none': { icon: '🌤️', description: '구름 조금', color: '#F0E68C' },
  'cloudy_rain': { icon: '🌦️', description: '비', color: '#4682B4' },
  'cloudy_sleet': { icon: '🌨️', description: '진눈깨비', color: '#B0C4DE' },
  'cloudy_snow': { icon: '🌨️', description: '눈', color: '#FFFFFF' },
  'cloudy_shower': { icon: '🌦️', description: '소나기', color: '#4682B4' },
  
  // 흐림 계열
  'overcast_none': { icon: '☁️', description: '흐림', color: '#808080' },
  'overcast_rain': { icon: '🌧️', description: '비', color: '#4682B4' },
  'overcast_sleet': { icon: '🌨️', description: '진눈깨비', color: '#B0C4DE' },
  'overcast_snow': { icon: '❄️', description: '눈', color: '#FFFFFF' },
  'overcast_shower': { icon: '⛈️', description: '소나기', color: '#2F4F4F' },
  
  // 기본값
  'default': { icon: '🌤️', description: '정보 없음', color: '#CCCCCC' }
};

/**
 * 날씨 예보 데이터를 가져오는 메인 함수
 */
export const getWeatherForecast = async (lat: number, lon: number): Promise<HourlyWeatherData[]> => {
  
  // 테스트용 고정 좌표 (대전)
  const latitude = 36.3504;
  const longitude = 127.3849;
  const url = `${config.api.baseUrl}/weather-forecast/summary?lat=${latitude}&lon=${longitude}`;


  // 실제 위치 기반 API 사용 시 주석으로 교체
  // const url = `${config.api.baseUrl}/weather-forecast/summary?lat=${lat}&lon=${lon}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FORECAST_API_TIMEOUT);
    
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
    
    const data: WeatherForecastResponse = await response.json();

    
    // API 응답을 UI 표시용 데이터로 변환
    return transformForecastData(data);
    
  } catch (error) {
    console.error('Weather forecast API request failed:', {
      url,
      error: error instanceof Error ? error.message : String(error)
    });
    
    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw new Error('네트워크 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.');
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`요청 시간이 초과되었습니다. (${FORECAST_API_TIMEOUT}ms)`);
    }
    
    throw error;
  }
};

/**
 * API 응답 데이터를 UI 표시용 형태로 변환
 */
const transformForecastData = (data: WeatherForecastResponse): HourlyWeatherData[] => {
  const currentTime = new Date();
  
  return data
    .sort((a, b) => new Date(a.forecastDatetime).getTime() - new Date(b.forecastDatetime).getTime())
    .map((item: WeatherForecastItem) => {
      const datetime = new Date(item.forecastDatetime);
      const isCurrentHour = isCurrentHourTime(datetime, currentTime);
      
      // 날씨 아이콘과 설명 결정
      const skyCondition = SKY_CONDITIONS[item.sky as keyof typeof SKY_CONDITIONS] || 'cloudy';
      const precipitationType = PRECIPITATION_TYPES[item.pty as keyof typeof PRECIPITATION_TYPES] || 'none';
      const weatherKey = `${skyCondition}_${precipitationType}`;
      const weatherInfo = WEATHER_ICON_MAP[weatherKey] || WEATHER_ICON_MAP.default;
      
      return {
        time: isCurrentHour ? '지금' : formatTime(datetime),
        datetime: item.forecastDatetime,
        temperature: Math.round(item.tmp),
        icon: weatherInfo.icon,
        description: weatherInfo.description,
        precipitationProbability: item.pop,
        isCurrentHour,
        skyCondition,
        precipitationType
      };
    });
};

/**
 * 현재 시간과 예보 시간이 같은 시간대인지 확인
 */
const isCurrentHourTime = (forecastTime: Date, currentTime: Date): boolean => {
  return forecastTime.getHours() === currentTime.getHours() &&
         forecastTime.getDate() === currentTime.getDate() &&
         forecastTime.getMonth() === currentTime.getMonth() &&
         forecastTime.getFullYear() === currentTime.getFullYear();
};

/**
 * 시간을 HH:mm 형식으로 포맷팅
 */
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 날씨 상태에 따른 추가 정보 생성
 */
export const generateWeatherStats = (data: HourlyWeatherData) => {
  const stats = [
    {
      icon: '💧',
      text: `강수 ${data.precipitationProbability}%`
    },
  ];
  
  return stats;
};

/**
 * 날씨 예보 서비스 객체
 */
export const weatherForecastService = {
  getWeatherForecast,
  generateWeatherStats
};

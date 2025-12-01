/**
 * 날씨 조건에 따른 테마 색상 및 스타일 유틸리티
 */

export interface WeatherTheme {
  backgroundColor: string;
  gradientColors: string[];
  textColor: string;
  opacity: number;
  emoji: string;
}

export const weatherThemes: Record<string, WeatherTheme> = {
  // 맑음 - 하얀 햇빛에 잘 어울리는 연한 배경
  '맑음': {
    backgroundColor: '#E8F4FD', // 아주 연한 하늘색 (하얀 햇빛이 잘 보이도록)
    gradientColors: ['#E8F4FD', '#D1E7F0'],
    textColor: '#2F4F4F', // 어두운 텍스트로 대비 향상
    opacity: 0.9,
    emoji: '☀️',
  },
  'sunny': {
    backgroundColor: '#E8F4FD',
    gradientColors: ['#E8F4FD', '#D1E7F0'],
    textColor: '#2F4F4F',
    opacity: 0.9,
    emoji: '☀️',
  },
  
  // 구름많음 - 밝은 회색 배경
  '구름많음': {
    backgroundColor: '#B0B8C1', // 밝은 회색
    gradientColors: ['#B0B8C1', '#8B9DC3'],
    textColor: '#2F4F4F', // 어두운 텍스트
    opacity: 0.8,
    emoji: '☁️',
  },
  'cloudy': {
    backgroundColor: '#B0B8C1',
    gradientColors: ['#B0B8C1', '#8B9DC3'],
    textColor: '#2F4F4F',
    opacity: 0.8,
    emoji: '☁️',
  },
  
  // 흐림
  '흐림': {
    backgroundColor: '#708090',
    gradientColors: ['#708090', '#2F4F4F'],
    textColor: '#FFFFFF',
    opacity: 0.9,
    emoji: '🌫️',
  },
  'overcast': {
    backgroundColor: '#708090',
    gradientColors: ['#708090', '#2F4F4F'],
    textColor: '#FFFFFF',
    opacity: 0.9,
    emoji: '🌫️',
  },
  
  // 비 관련 테마들
  '비': {
    backgroundColor: '#6B8DB5',
    gradientColors: ['#6B8DB5', '#4A6B8A'],
    textColor: '#FFFFFF',
    opacity: 0.85,
    emoji: '🌧️',
  },
  '가벼운 비': {
    backgroundColor: '#6B8DB5',
    gradientColors: ['#6B8DB5', '#4A6B8A'],
    textColor: '#FFFFFF',
    opacity: 0.8,
    emoji: '🌦️',
  },
  '폭우': {
    backgroundColor: '#4A6B8A',
    gradientColors: ['#4A6B8A', '#2F4F4F'],
    textColor: '#FFFFFF',
    opacity: 0.9,
    emoji: '⛈️',
  },
  'rain': {
    backgroundColor: '#6B8DB5',
    gradientColors: ['#6B8DB5', '#4A6B8A'],
    textColor: '#FFFFFF',
    opacity: 0.85,
    emoji: '🌧️',
  },
  
  // 소나기
  '소나기': {
    backgroundColor: '#6495ED',
    gradientColors: ['#6495ED', '#4169E1'],
    textColor: '#FFFFFF',
    opacity: 0.9,
    emoji: '🌦️',
  },
  'shower': {
    backgroundColor: '#6495ED',
    gradientColors: ['#6495ED', '#4169E1'],
    textColor: '#FFFFFF',
    opacity: 0.9,
    emoji: '🌦️',
  },
  
  // 눈 - 하얀 배경 (약간 회색 틴트)
  '눈': {
    backgroundColor: '#E8F4F8', // 아주 연한 회색-하얀
    gradientColors: ['#E8F4F8', '#D0E7ED'],
    textColor: '#2F4F4F', // 어두운 텍스트로 대비
    opacity: 0.9,
    emoji: '❄️',
  },
  'snow': {
    backgroundColor: '#E8F4F8',
    gradientColors: ['#E8F4F8', '#D0E7ED'],
    textColor: '#2F4F4F',
    opacity: 0.9,
    emoji: '❄️',
  },
  
  // 천둥번개 - 어두운 배경
  '천둥번개': {
    backgroundColor: '#3A3B5C', // 더 어두운 보라색
    gradientColors: ['#3A3B5C', '#2C2D4A'],
    textColor: '#FFFFFF',
    opacity: 0.95,
    emoji: '⛈️',
  },
  'thunderstorm': {
    backgroundColor: '#3A3B5C',
    gradientColors: ['#3A3B5C', '#2C2D4A'],
    textColor: '#FFFFFF',
    opacity: 0.95,
    emoji: '⛈️',
  },
  
  // 안개
  '안개': {
    backgroundColor: '#D3D3D3',
    gradientColors: ['#D3D3D3', '#A9A9A9'],
    textColor: '#2F4F4F',
    opacity: 0.8,
    emoji: '🌫️',
  },
  'fog': {
    backgroundColor: '#D3D3D3',
    gradientColors: ['#D3D3D3', '#A9A9A9'],
    textColor: '#2F4F4F',
    opacity: 0.8,
    emoji: '🌫️',
  },
};

// 기본 테마 (알 수 없는 날씨 조건)
export const defaultWeatherTheme: WeatherTheme = {
  backgroundColor: '#f3b256ff', // 더 차분한 파란색
  gradientColors: ['#ebba3fff', '#a8945dff'],
  textColor: '#FFFFFF',
  opacity: 0.85,
  emoji: '🌤️',
};

/**
 * 날씨 조건에 따른 테마를 반환합니다.
 */
export const getWeatherTheme = (condition: string): WeatherTheme => {
  const normalizedCondition = condition.trim().toLowerCase();
  
  // 한국어 키로 먼저 찾기
  const koreanTheme = weatherThemes[condition];
  if (koreanTheme) return koreanTheme;
  
  // 영어 키로 찾기
  const englishTheme = weatherThemes[normalizedCondition];
  if (englishTheme) return englishTheme;
  
  // 부분 매칭 시도
  for (const [key, theme] of Object.entries(weatherThemes)) {
    if (normalizedCondition.includes(key) || key.includes(normalizedCondition)) {
      return theme;
    }
  }
  
  return defaultWeatherTheme;
};

/**
 * 날씨 조건에 따른 애니메이션 강도를 결정합니다.
 */
export const getAnimationIntensity = (condition: string, windSpeed?: number): 'light' | 'normal' | 'heavy' => {
  const normalizedCondition = condition.toLowerCase();
  
  // 바람 속도 기반 판단
  if (windSpeed) {
    if (windSpeed > 20) return 'heavy';
    if (windSpeed > 10) return 'normal';
    return 'light';
  }
  
  // 날씨 조건 기반 판단
  if (normalizedCondition.includes('강한') || normalizedCondition.includes('heavy')) {
    return 'heavy';
  }
  if (normalizedCondition.includes('약한') || normalizedCondition.includes('light')) {
    return 'light';
  }
  
  return 'normal';
};

/**
 * 온도에 따른 색상 조정
 */
export const adjustThemeByTemperature = (theme: WeatherTheme, temperature: number): WeatherTheme => {
  let adjustedTheme = { ...theme };
  
  // 매우 높은 온도 (30도 이상) - 더 따뜻한 색조
  if (temperature >= 30) {
    adjustedTheme.backgroundColor = adjustedTheme.backgroundColor.replace(/E1|E2/, 'E8');
  }
  // 매우 낮은 온도 (0도 이하) - 더 차가운 색조
  else if (temperature <= 0) {
    adjustedTheme.backgroundColor = adjustedTheme.backgroundColor.replace(/E1|E2/, 'D5');
  }
  
  return adjustedTheme;
};

/**
 * 시간대에 따른 테마 조정 (야간 모드)
 */
export const adjustThemeByTime = (theme: WeatherTheme, hour: number): WeatherTheme => {
  const isNight = hour < 6 || hour > 20;
  
  if (isNight) {
    return {
      ...theme,
      backgroundColor: theme.backgroundColor.replace(/F|E|D/, '8'),
      gradientColors: theme.gradientColors.map(color => 
        color.replace(/F|E|D/, '6')
      ),
      opacity: Math.max(0.7, theme.opacity - 0.1),
    };
  }
  
  return theme;
};

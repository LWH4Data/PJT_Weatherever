// ========== WEATHEREVER 대시보드 타입 정의 ==========

/**
 * 날씨 예보 API 응답 타입
 */
export interface WeatherForecastItem {
  forecastDatetime: string; // ISO 8601 format
  sky: string;              // 하늘 상태 코드 ("1": 맑음, "3": 구름많음, "4": 흐림)
  pty: string;              // 강수형태 코드 ("0": 없음, "1": 비, "2": 비/눈, "3": 눈, "4": 소나기)
  tmp: number;              // 온도 (°C)
  pop: number;              // 강수 확률 (%)
}

export type WeatherForecastResponse = WeatherForecastItem[];

/**
 * 하늘 상태 코드 매핑
 */
export const SKY_CONDITIONS = {
  '1': 'sunny',
  '3': 'cloudy',
  '4': 'overcast'
} as const;

export type SkyCondition = keyof typeof SKY_CONDITIONS;
export type SkyConditionType = typeof SKY_CONDITIONS[SkyCondition];

/**
 * 강수 형태 코드 매핑
 */
export const PRECIPITATION_TYPES = {
  '0': 'none',
  '1': 'rain',
  '2': 'sleet',
  '3': 'snow',
  '4': 'shower'
} as const;

export type PrecipitationType = keyof typeof PRECIPITATION_TYPES;
export type PrecipitationTypeValue = typeof PRECIPITATION_TYPES[PrecipitationType];

/**
 * 날씨 아이콘 매핑을 위한 타입
 */
export interface WeatherIconData {
  icon: string;          // 이모지 또는 아이콘 문자
  description: string;   // 한국어 설명
  color?: string;        // 선택적 색상
}

/**
 * 시간별 날씨 데이터 (UI 표시용)
 */
export interface HourlyWeatherData {
  time: string;           // 시간 (HH:mm 형식)
  datetime: string;       // 원본 ISO datetime
  temperature: number;    // 온도
  icon: string;          // 날씨 아이콘
  description: string;    // 날씨 설명
  precipitationProbability: number; // 강수확률
  isCurrentHour: boolean; // 현재 시간 여부
  skyCondition: SkyConditionType;
  precipitationType: PrecipitationTypeValue;
}

/**
 * 교통정보 API 응답 타입 (실제 API 스펙에 맞춤)
 */
export interface TrafficInfoResponse {
  updatedTime: string;
  nearbyTrafficInfos: TrafficInfoItem[];
}

export interface TrafficInfoItem {
  roadName: string;
  direction: string;
  distanceMeters: number;
  speedKph: number;
  durationSeconds: number;
}

/**
 * UI 표시용 교통정보 타입
 */
export interface TrafficRouteDisplay {
  id: string;
  roadName: string;
  direction: string;
  distance: string;         // "1.0km" 형태로 포맷된 거리
  estimatedTime: number;    // 분 단위로 변환된 시간
  status: TrafficStatus;    // 속도 기반으로 계산된 상태
  averageSpeed: number;     // km/h
  durationSeconds: number;  // 원본 초 단위 시간
}

/**
 * 교통 정보 관련 타입 (기존 호환성용)
 */
export interface TrafficRoute {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;        // km
  estimatedTime: number;   // 분
  status: TrafficStatus;
  averageSpeed: number;    // km/h
}

export type TrafficStatus = 'smooth' | 'moderate' | 'heavy' | 'blocked';

export interface TrafficStatusInfo {
  color: string;
  label: string;
  description: string;
}

/**
 * 대시보드 탭 타입
 */
export type DashboardTab = 'weather' | 'traffic';

/**
 * 대시보드 상태 타입
 */
export interface DashboardState {
  activeTab: DashboardTab;
  weatherForecast: HourlyWeatherData[];
  trafficRoutes: TrafficRoute[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * 네비게이션 아이템 타입
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
}

/**
 * 대시보드 컴포넌트 Props 타입들
 */
export interface StatusBarProps {
  time?: string;
  batteryLevel?: number;
}

export interface DashboardHeaderProps {
  title?: string;
  onBackPress?: () => void;
}

export interface TabButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
  variant?: 'weather' | 'traffic';
}

export interface WeatherForecastSectionProps {
  data: HourlyWeatherData[];
  loading?: boolean;
  onRefresh?: () => void;
}

export interface TrafficInfoSectionProps {
  routes?: TrafficRoute[];
  loading?: boolean;
  onRefresh?: () => void;
}

export interface BottomNavigationProps {
  items: NavigationItem[];
  onItemPress: (id: string) => void;
}

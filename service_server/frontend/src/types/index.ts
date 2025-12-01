// LocationData는 locationService에서 import
export type { LocationData, LocationPermissionResult } from '../services/locationService';

// 기존 인터페이스들 (호환성 유지)
export interface LocationDataLegacy {
  latitude: number;
  longitude: number;
  district?: string;    // 구/군 (예: 유성구)
  city?: string;        // 시 (예: 대전)
  country?: string;     // 국가 (예: 대한민국)
  fullAddress?: string; // 전체 주소
}

export interface LocationPermissionResultLegacy {
  granted: boolean;
  canAskAgain: boolean;
  message?: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  description?: string;
}

export interface OutfitRecommendation {
  items: string[];
  accessories: string[];
  message: string;
}

// 근무시간 설정 타입
export interface WorkTimeSettings {
  startTime: string; // "09:00" 형식 (HH:mm)
  endTime: string;   // "18:00" 형식 (HH:mm)
}

// ========== API 관련 타입 정의 ==========

// API로 서버에 저장/조회할 사용자 데이터
export interface UserApiData {
  userId: string;
  heatColdPreference: 'hot' | 'normal' | 'cold';
  workTime: WorkTimeSettings;
  createdAt?: string;
  updatedAt?: string;
}

// API 응답 타입
export interface UserApiResponse {
  success: boolean;
  data?: UserApiData;
  error?: string;
}

// API 요청 시 임시 저장용 (재시도 전략용)
export interface PendingUserData {
  userId: string;
  heatColdPreference: 'hot' | 'normal' | 'cold';
  workTime: WorkTimeSettings;
  timestamp: string; // 언제 저장했는지
}

// ========== 로컬 전용 타입 정의 ==========

// 프론트에서만 관리하는 사용자 설정 (로컬 전용)
export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'mph';
  locationService: boolean;
}

// ========== 앱 상태 타입 정의 ==========

// 의류 타입 정의
export type ClothingType = 'short' | 'long' | 'outter';

// UV 지수 타입 정의
export type UVLevel = '낮음' | '보통' | '높음' | '매우높음' | '위험';

// 대기오염 지수 타입 정의
export type AirPollutionLevel = '좋음' | '보통' | '나쁨' | '매우나쁨';

// 의류 추천 API 응답 타입
export interface ClothingRecommendationResponse {
  outfit: ClothingType;
  rainInfo: boolean | string;
  uvInfo: UVLevel;
  airPollutionInfo: AirPollutionLevel;
}

// 액세서리 아이템 타입 정의
export interface AccessoryItem {
  id: string;
  type: 'umbrella' | 'suncream' | 'mask';
  image: any; // require()로 불러온 이미지
  condition: string; // 표시 조건 설명
}

// API 데이터 상태 관리
export interface ApiDataState {
  data: UserApiData | null;
  loading: boolean;
  error: string | null;
  lastSynced: Date | null;
  pendingChanges: Partial<UserApiData> | null; // 아직 서버에 보내지 않은 변경사항
}

// 수정된 전체 앱 상태
export interface AppState {
  userId: string | null;
  location: LocationData | null;
  locationError: string | null;
  weatherData: WeatherData | null;
  outfitData: OutfitRecommendation | null;
  
  // 분리된 사용자 데이터 관리
  userPreferences: UserPreferences;     // 로컬 전용 설정
  apiUserData: ApiDataState;            // API 관리 데이터
  
  // 의류 관련 상태 추가
  clothingType: ClothingType | null;              // 현재 추천된 의류 타입
  clothingRecommendation: ClothingRecommendationResponse | null;  // 전체 의류+액세서리 추천 데이터
  clothingLoading: boolean;                       // 의류 API 로딩 상태
  clothingError: string | null;                   // 의류 API 에러 상태
  clothingLastUpdated: Date | null;               // 마지막 업데이트 시간
  
  loading: boolean;
  lastUpdated: Date | null;
}

// ========== WEATHEREVER 대시보드 타입 ==========
export * from './dashboard';

// ========== 위치 검색 타입 ==========
export * from './locationSearch';

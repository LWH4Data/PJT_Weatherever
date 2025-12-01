export interface LocationSearchResult {
  /** 지역 고유 ID (API에서 제공하는 place_id 등) */
  id: string;
  
  /** 표시할 이름 (예: 학하동) */
  displayName: string;
  
  /** 전체 주소 (예: 대전광역시 유성구 학하동) */
  fullAddress: string;
  
  /** 위도 */
  latitude: number;
  
  /** 경도 */
  longitude: number;
  
  /** 행정구역 정보 */
  administrativeInfo: {
    /** 구/군 (예: 유성구) */
    district?: string;
    
    /** 시/도 (예: 대전광역시) */
    city?: string;
    
    /** 국가 (예: 대한민국) */
    country?: string;
  };
}

export interface LocationSearchRequest {
  /** 검색 쿼리 (예: 학하동) */
  query: string;
  
  /** 검색 결과 제한 수 */
  limit?: number;
  
  /** 검색 언어 (기본: ko) */
  language?: string;
  
  /** 국가 코드 제한 (기본: KR) */
  countryCode?: string;
}

export interface LocationSearchResponse {
  /** 검색 결과 목록 */
  results: LocationSearchResult[];
  
  /** 검색 쿼리 */
  query: string;
  
  /** 총 결과 수 */
  totalCount: number;
}

/** 위치 검색 상태 */
export interface LocationSearchState {
  /** 검색 중 여부 */
  isSearching: boolean;
  
  /** 검색 쿼리 */
  query: string;
  
  /** 검색 결과 */
  results: LocationSearchResult[];
  
  /** 선택된 위치 */
  selectedLocation: LocationSearchResult | null;
  
  /** 검색창 포커스 여부 */
  isFocused: boolean;
  
  /** 에러 메시지 */
  error: string | null;
}

/** 위치 검색 액션 타입 */
export type LocationSearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: LocationSearchResult[] }
  | { type: 'SET_SELECTED'; payload: LocationSearchResult | null }
  | { type: 'SET_FOCUSED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_SEARCH' };

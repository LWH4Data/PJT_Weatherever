import { useReducer, useCallback, useRef } from 'react';
import { locationSearchService } from '../services';
import type { 
  LocationSearchState, 
  LocationSearchAction, 
  LocationSearchResult,
  LocationData
} from '../types';

/**
 * 위치 검색 상태의 초기값
 */
const initialState: LocationSearchState = {
  isSearching: false,
  query: '',
  results: [],
  selectedLocation: null,
  isFocused: false,
  error: null,
};

/**
 * 위치 검색 상태 리듀서
 */
function locationSearchReducer(state: LocationSearchState, action: LocationSearchAction): LocationSearchState {
  switch (action.type) {
    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload,
        error: null, // 새로운 검색 시 에러 초기화
      };

    case 'SET_SEARCHING':
      return {
        ...state,
        isSearching: action.payload,
      };

    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        isSearching: false,
      };

    case 'SET_SELECTED':
      return {
        ...state,
        selectedLocation: action.payload,
        query: action.payload ? action.payload.displayName : '', // 선택된 위치의 이름을 검색창에 표시
        results: [], // 검색 결과 숨기기
        isFocused: false, // 선택 시 포커스 해제
      };

    case 'SET_FOCUSED':
      return {
        ...state,
        isFocused: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isSearching: false,
      };

    case 'CLEAR_SEARCH':
      return {
        ...initialState,
        query: state.query, // 검색어는 유지
      };

    default:
      return state;
  }
}

export interface UseLocationSearchOptions {
  /** 검색 디바운스 시간 (ms) */
  debounceMs?: number;
  
  /** 자동 검색 여부 (입력 시 자동으로 검색 실행) */
  autoSearch?: boolean;
  
  /** 검색 결과 최대 개수 */
  maxResults?: number;

  /** 위치 선택 시 콜백 */
  onLocationSelect?: (location: LocationData) => void;
}

export interface UseLocationSearchReturn {
  // 상태
  state: LocationSearchState;
  
  // 액션
  setQuery: (query: string) => void;
  search: (query?: string) => Promise<void>;
  selectLocation: (location: LocationSearchResult) => void;
  setFocused: (focused: boolean) => void;
  clearSearch: () => void;
  clearError: () => void;
}

/**
 * 위치 검색 기능을 제공하는 Hook
 */
export const useLocationSearch = (options: UseLocationSearchOptions = {}): UseLocationSearchReturn => {
  const {
    debounceMs = 300,
    autoSearch = true,
    maxResults = 10,
    onLocationSelect,
  } = options;

  const [state, dispatch] = useReducer(locationSearchReducer, initialState);
  
  // 디바운스를 위한 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 중복 요청 방지를 위한 ref
  const isProcessingRef = useRef(false);

  /**
   * 검색어 설정
   */
  const setQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });

    // 자동 검색이 활성화된 경우 디바운스 적용하여 검색
    if (autoSearch) {
      // 기존 타이머 클리어
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 빈 검색어인 경우 결과 초기화
      if (!query.trim()) {
        dispatch({ type: 'SET_RESULTS', payload: [] });
        return;
      }

      // 디바운스 타이머 설정
      debounceTimerRef.current = setTimeout(() => {
        search(query);
      }, debounceMs);
    }
  }, [autoSearch, debounceMs]);

  /**
   * 위치 검색 실행
   */
  const search = useCallback(async (searchQuery?: string) => {
    const query = searchQuery || state.query;
    
    if (!query.trim() || isProcessingRef.current) {
      return;
    }

    try {
      isProcessingRef.current = true;
      dispatch({ type: 'SET_SEARCHING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await locationSearchService.searchLocation({
        query,
        limit: maxResults,
      });

      dispatch({ type: 'SET_RESULTS', payload: response.results });

    } catch (error) {
      console.error('위치 검색 실패:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '위치 검색 중 오류가 발생했습니다';
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      isProcessingRef.current = false;
      dispatch({ type: 'SET_SEARCHING', payload: false });
    }
  }, [state.query, maxResults]);

  /**
   * 위치 선택
   */
  const selectLocation = useCallback((location: LocationSearchResult) => {
    dispatch({ type: 'SET_SELECTED', payload: location });

    // LocationSearchResult를 LocationData 형식으로 변환
    const locationData: LocationData = {
      latitude: location.latitude,
      longitude: location.longitude,
      district: location.administrativeInfo.district,
      city: location.administrativeInfo.city,
      country: location.administrativeInfo.country,
      fullAddress: location.fullAddress,
    };

    // 콜백 함수 호출
    onLocationSelect?.(locationData);
  }, [onLocationSelect]);

  /**
   * 포커스 상태 설정
   */
  const setFocused = useCallback((focused: boolean) => {
    dispatch({ type: 'SET_FOCUSED', payload: focused });
  }, []);

  /**
   * 검색 초기화 (결과 및 선택 상태 리셋)
   */
  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
    
    // 디바운스 타이머 클리어
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  /**
   * 에러 상태 클리어
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  return {
    state,
    setQuery,
    search,
    selectLocation,
    setFocused,
    clearSearch,
    clearError,
  };
};

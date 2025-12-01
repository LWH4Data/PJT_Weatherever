import { useState, useCallback, useEffect, useRef } from 'react';
import { locationService, LocationData, LocationPermissionResult } from '../services';
import { handleError, withErrorHandling, getLocationErrorMessage } from '../utils';

export interface UseLocationOptions {
  autoFetch?: boolean;        // 컴포넌트 마운트 시 자동으로 위치 가져오기
  watchPosition?: boolean;    // 위치 변화 감지 (향후 확장용)
  allowManualLocation?: boolean; // 수동 위치 설정 허용 여부
}

export interface UseLocationReturn {
  // 상태
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  isManualLocation: boolean; // 수동 설정된 위치인지 여부
  
  // 액션
  fetchLocation: () => Promise<void>;
  setManualLocation: (location: LocationData) => void; // 수동 위치 설정
  resetToCurrentLocation: () => Promise<void>; // 현재 위치로 리셋
  clearError: () => void;
  
  // 유틸리티
  getLocationText: () => string;
  hasValidLocation: boolean;
}

/**
 * 위치 데이터만 처리하는 메인 훅
 * 권한 관리는 useLocationPermission에서 별도로 처리
 */
export const useLocation = (options: UseLocationOptions = {}): UseLocationReturn => {
  const { autoFetch = false, allowManualLocation = true } = options;
  
  // 상태 관리
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  
  // ref로 중복 요청 방지
  const isProcessingRef = useRef(false);

  /**
   * 현재 위치를 가져옵니다.
   */
  const fetchLocation = useCallback(async () => {
    if (isProcessingRef.current) return;
    
    try {
      isProcessingRef.current = true;
      setLoading(true);
      setError(null);
      
      const { data, error } = await withErrorHandling(
        () => locationService.getCurrentLocation(),
        {
          defaultMessage: '위치를 가져올 수 없습니다',
          context: 'fetchLocation'
        }
      );
      
      if (data) {
        setLocation(data);
      } else if (error) {
        setError(error);
      }
    } finally {
      setLoading(false);
      isProcessingRef.current = false;
    }
  }, []);

  /**
   * 에러를 클리어합니다.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 수동으로 위치를 설정합니다.
   */
  const setManualLocation = useCallback((newLocation: LocationData) => {
    if (!allowManualLocation) {
      console.warn('수동 위치 설정이 허용되지 않습니다.');
      return;
    }
    
    setLocation(newLocation);
    setIsManualLocation(true);
    setError(null);
  }, [allowManualLocation]);

  /**
   * 현재 위치로 리셋합니다.
   */
  const resetToCurrentLocation = useCallback(async () => {
    setIsManualLocation(false);
    await fetchLocation();
  }, [fetchLocation]);

  /**
   * 위치 정보를 텍스트로 반환합니다.
   */
  const getLocationText = useCallback((): string => {
    if (error) return getLocationErrorMessage(error);
    if (loading) return '위치 정보를 가져오는 중...';
    if (!location) return '위치 정보 없음';
    
    // 주소 정보가 있는 경우
    if (location.fullAddress) {
      return location.fullAddress;
    }
    
    // 부분 주소 정보 조합
    const addressParts = [];
    if (location.district) addressParts.push(location.district);
    if (location.city) addressParts.push(location.city);
    if (location.country) addressParts.push(location.country);
    
    if (addressParts.length > 0) {
      return addressParts.join(', ');
    }
    
    // 좌표만 있는 경우
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  }, [location, loading, error]);

  /**
   * 유효한 위치 정보가 있는지 확인합니다.
   */
  const hasValidLocation = Boolean(location && !error);

  // 컴포넌트 마운트 시 자동 실행
  useEffect(() => {
    if (autoFetch) {
      fetchLocation();
    }
  }, [autoFetch, fetchLocation]);

  return {
    // 상태
    location,
    loading,
    error,
    isManualLocation,
    
    // 액션
    fetchLocation,
    setManualLocation,
    resetToCurrentLocation,
    clearError,
    
    // 유틸리티
    getLocationText,
    hasValidLocation,
  };
};


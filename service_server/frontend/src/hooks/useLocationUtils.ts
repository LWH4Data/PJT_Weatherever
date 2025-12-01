import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { LocationPermissionResult, LocationData } from '../services';

/**
 * 위치 권한 관련 유틸리티를 제공하는 훅
 */
export const useLocationPermissionUtils = () => {
  /**
   * 권한 상태에 따른 사용자 안내 메시지를 표시합니다.
   */
  const showPermissionAlert = useCallback((permission: LocationPermissionResult) => {
    if (permission.granted) return;

    const alertOptions = {
      title: '위치 권한 필요',
      message: permission.message || '날씨 정보를 제공하기 위해 위치 권한이 필요합니다.',
      buttons: [] as any[]
    };

    if (permission.canAskAgain) {
      alertOptions.buttons = [
        { text: '취소', style: 'cancel' },
        { text: '권한 허용', style: 'default' }
      ];
    } else {
      alertOptions.buttons = [
        { text: '취소', style: 'cancel' },
        { 
          text: '설정으로 이동', 
          style: 'default',
          onPress: () => Linking.openSettings()
        }
      ];
    }

    return new Promise((resolve) => {
      Alert.alert(
        alertOptions.title,
        alertOptions.message,
        alertOptions.buttons.map(button => ({
          ...button,
          onPress: button.onPress ? button.onPress : () => resolve(button.text !== '취소')
        }))
      );
    });
  }, []);

  // getLocationErrorMessage is now imported from utils

  /**
   * 위치 오류에 따른 사용자 친화적 메시지를 반환합니다.
   */
  const getLocationErrorMessage = useCallback((error: string): string => {
    if (error.includes('권한')) {
      return '📍 위치 권한을 허용해주세요';
    }
    if (error.includes('서비스')) {
      return '📍 위치 서비스를 활성화해주세요';
    }
    if (error.includes('타임아웃') || error.includes('timeout')) {
      return '📍 위치를 찾는 중입니다. 잠시만 기다려주세요';
    }
    return '📍 위치 정보를 가져올 수 없습니다';
  }, []);

  /**
   * 위치 권한 상태에 따른 액션 버튼 텍스트를 반환합니다.
   */
  const getPermissionActionText = useCallback((permission: LocationPermissionResult | null, error?: string): string => {
    if (!permission && error?.includes('권한')) {
      return '권한 요청';
    }
    if (permission && !permission.granted) {
      return permission.canAskAgain ? '권한 요청' : '설정으로 이동';
    }
    return '다시 시도';
  }, []);

  return {
    showPermissionAlert,
    getLocationErrorMessage,
    getPermissionActionText,
  };
};

/**
 * 위치 텍스트 포맷팅 유틸리티를 제공하는 훅
 */
export const useLocationFormatter = () => {
  /**
   * 위치 정보를 사용자 친화적인 텍스트로 변환합니다.
   */
  const formatLocationText = useCallback((location: LocationData | null, options?: {
    showCoordinates?: boolean;
    showCountry?: boolean;
    fallback?: string;
  }) => {
    const { showCoordinates = false, showCountry = true, fallback = '위치 정보 없음' } = options || {};
    
    if (!location) return fallback;

    // 전체 주소가 있는 경우
    if (location.fullAddress) {
      return location.fullAddress;
    }

    // 부분 주소 조합
    const addressParts = [];
    if (location.district) addressParts.push(location.district);
    if (location.city) addressParts.push(location.city);
    if (showCountry && location.country) addressParts.push(location.country);

    if (addressParts.length > 0) {
      const addressText = addressParts.join(', ');
      if (showCoordinates) {
        return `${addressText} (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`;
      }
      return addressText;
    }

    // 좌표만 있는 경우
    if (showCoordinates || !addressParts.length) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }

    return fallback;
  }, []);

  /**
   * 간단한 위치 텍스트를 반환합니다. (시, 구 정도만)
   */
  const formatSimpleLocationText = useCallback((location: LocationData | null) => {
    if (!location) return '위치 정보 없음';
    
    const parts = [];
    if (location.district) parts.push(location.district);
    if (location.city) parts.push(location.city);
    
    return parts.length > 0 ? parts.join(', ') : '위치 확인 중';
  }, []);

  return {
    formatLocationText,
    formatSimpleLocationText,
  };
};

/**
 * 위치 기반 날씨 데이터 관리를 위한 훅
 */
export const useLocationWeather = () => {
  const isLocationValid = useCallback((location: LocationData | null): boolean => {
    return Boolean(
      location && 
      typeof location.latitude === 'number' && 
      typeof location.longitude === 'number' &&
      !isNaN(location.latitude) &&
      !isNaN(location.longitude)
    );
  }, []);

  const shouldFetchWeather = useCallback((location: LocationData | null, weatherData: any, lastUpdated: Date | null): boolean => {
    if (!isLocationValid(location)) return false;
    if (!weatherData) return true;
    
    // 1시간 이상 지났으면 다시 가져오기
    if (lastUpdated) {
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdated.getTime();
      const oneHour = 60 * 60 * 1000;
      return timeDiff > oneHour;
    }
    
    return false;
  }, [isLocationValid]);

  return {
    isLocationValid,
    shouldFetchWeather,
  };
};

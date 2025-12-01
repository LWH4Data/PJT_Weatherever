import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../stores/appStore';
import { locationService } from '../../services';
import { withErrorHandling } from '../../utils';

export interface LocationPermissionState {
  hasPermission: boolean;
  canAskAgain: boolean;
  shouldShowModal: boolean;
  isFirstTime: boolean;
  lastAskedTime: number | null;
}

const PERMISSION_STORAGE_KEY = '@weather_location_permission_state';
const MIN_REQUEST_INTERVAL = 24 * 60 * 60 * 1000; // 24시간

export const useLocationPermission = (options?: { autoShow?: boolean }) => {
  const { userPreferences, updateUserPreferences } = useAppStore();
  const { autoShow = false } = options || {};
  const [permissionState, setPermissionState] = useState<LocationPermissionState>({
    hasPermission: false,
    canAskAgain: true,
    shouldShowModal: false,
    isFirstTime: true,
    lastAskedTime: null,
  });
  
  // 저장된 권한 상태 로드
  useEffect(() => {
    loadPermissionState();
  }, []);

  // 현재 권한 상태 확인
  useEffect(() => {
    checkCurrentPermission();
  }, []);

  // 설정의 위치서비스 스위치와 실제 권한 상태 동기화 (제거됨 - 위치서비스 설정 제거로 인해 불필요)
  // useEffect(() => {
  //   if (permissionState.hasPermission !== userPreferences.locationService) {
  //     updateUserPreferences({
  //       locationService: permissionState.hasPermission
  //     });
  //   }
  // }, [permissionState.hasPermission, userPreferences.locationService]);

  // 메인 페이지에서 autoShow가 true일 때만 자동 모달 표시
  useEffect(() => {
    if (autoShow && shouldShowPermissionModal()) {
      // 약간의 딜레이를 주어 다른 초기화가 완료된 후 모달 표시
      const timer = setTimeout(() => {
        if (shouldShowPermissionModal()) {
          setPermissionState(prev => ({
            ...prev,
            shouldShowModal: true,
          }));
        }
      }, 1000); // 1초 딜레이

      return () => clearTimeout(timer);
    }
  }, [autoShow, permissionState.hasPermission, userPreferences.locationService]);

  const loadPermissionState = async () => {
    try {
      const stored = await AsyncStorage.getItem(PERMISSION_STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        setPermissionState(prev => ({
          ...prev,
          ...parsedState,
          isFirstTime: false,
        }));
      }
    } catch (error) {
      console.warn('Failed to load permission state:', error);
    }
  };

  const savePermissionState = async (state: Partial<LocationPermissionState>) => {
    try {
      const newState = { ...permissionState, ...state };
      await AsyncStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify(newState));
      setPermissionState(newState);
    } catch (error) {
      console.warn('Failed to save permission state:', error);
    }
  };

  const checkCurrentPermission = async () => {
    try {
      const { data, error } = await withErrorHandling(
        () => locationService.checkPermission(),
        {
          defaultMessage: '권한 확인에 실패했습니다',
          context: 'checkCurrentPermission'
        }
      );
      
      if (data) {
        setPermissionState(prev => ({
          ...prev,
          hasPermission: data.granted,
          canAskAgain: data.canAskAgain ?? true,
        }));
      }
    } catch (error) {
      console.warn('Failed to check permission:', error);
    }
  };

  const shouldShowPermissionModal = useCallback((): boolean => {

    
    // 이미 권한이 있으면 모달 표시 안 함
    if (permissionState.hasPermission) {

      return false;
    }
    
    // 재요청 불가능하고 최근에 거부했으면 표시 안 함
    if (!permissionState.canAskAgain && permissionState.lastAskedTime) {
      const timeSinceLastAsk = Date.now() - permissionState.lastAskedTime;
      if (timeSinceLastAsk < MIN_REQUEST_INTERVAL) {
        return false;
      }
    }
    

    return true;
  }, [permissionState]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const currentTime = Date.now();
      
      const { data, error } = await withErrorHandling(
        () => locationService.requestPermission(),
        {
          defaultMessage: '권한 요청에 실패했습니다',
          context: 'requestPermission'
        }
      );
      
      if (data) {
        await savePermissionState({
          hasPermission: data.granted,
          canAskAgain: data.canAskAgain ?? false,
          lastAskedTime: currentTime,
          shouldShowModal: false,
        });

        return data.granted;
      }
      
      return false;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const openAppSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      Alert.alert(
        '설정 열기 실패',
        '설정 앱을 수동으로 열어 위치 권한을 허용해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  const showPermissionModal = () => {
    if (shouldShowPermissionModal()) {
      setPermissionState(prev => ({
        ...prev,
        shouldShowModal: true,
      }));
    }
  };

  const hidePermissionModal = () => {
    setPermissionState(prev => ({
      ...prev,
      shouldShowModal: false,
    }));
  };

  // toggleLocationServiceSetting 제거 (위치서비스 설정 제거로 인해 불필요)

  return {
    // 상태
    ...permissionState,
    shouldShowPermissionModal: shouldShowPermissionModal(),
    
    // 액션
    requestPermission,
    openAppSettings,
    showPermissionModal,
    hidePermissionModal,
    checkCurrentPermission,
  };
};

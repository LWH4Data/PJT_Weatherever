import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Header, LocationSearchInput } from '../components/molecules';
import { WeatherDisplay } from '../components/organisms';
import { Text, LocationPermissionModal, LoadingAnimation } from '../components/atoms';
import { useUserStore, useWeatherStore, useApiUserStore, useClothingStore } from '../stores/appStore';
import {
  useLocation,
  useLocationFormatter,
  useLocationWeather,
  usePerformanceTimer,
  useLocationPermission,
} from '../hooks';
import { theme } from '../styles/theme';
import type { LocationData } from '../types';

export default function MainScreen() {
  // 디바이스 크기 기반 로딩 애니메이션 크기 계산
  const screenWidth = Dimensions.get('window').width;
  const loadingSize = screenWidth * 0.6; // 디바이스 가로 크기의 60%
  
  // 성능 측정
  const { start, end } = usePerformanceTimer('위치정보 로딩');
  
  // 분리된 store 사용
  const { userId, initializeUser } = useUserStore(); // ✅ Hook을 최상위로 이동
  const { initializeUserWithApi } = useApiUserStore();
  const { weatherData, loading: weatherLoading, fetchWeatherData, lastUpdated } = useWeatherStore();
  
  // 의류 store 추가
  const { 
    clothingType,
    clothingRecommendation, 
    clothingLoading, 
    clothingError, 
    fetchClothingWithAccessories,
    clothingLastUpdated 
  } = useClothingStore();

  // 위치 관련 로직 (위치 데이터만)
  const {
    location,
    loading: locationLoading,
    hasValidLocation,
    isManualLocation,
    fetchLocation,
    setManualLocation,
    resetToCurrentLocation,
    clearError,
  } = useLocation({ autoFetch: true, allowManualLocation: true });

  // 위치권한 관리 로직 (메인 페이지에서만 자동 모달 표시)
  const {
    hasPermission,
    canAskAgain,
    shouldShowModal,
    requestPermission: requestLocationPermission,
    openAppSettings,
    hidePermissionModal,
  } = useLocationPermission({ autoShow: true });

  // 유틸리티 훅들
  const { formatSimpleLocationText } = useLocationFormatter();
  const { shouldFetchWeather } = useLocationWeather();

  // 위치 선택 처리 함수
  const handleLocationSelect = useCallback((selectedLocation: LocationData) => {
    // 수동 위치로 설정
    setManualLocation(selectedLocation);
    
    // 새로운 위치로 날씨 데이터 가져오기
    fetchWeatherData(selectedLocation);
    
    // userId가 있으면 의류 추천 데이터도 새로 가져오기
    if (userId) {
      fetchClothingWithAccessories(userId, selectedLocation);
    }
  }, [setManualLocation, fetchWeatherData, userId, fetchClothingWithAccessories]);

  // 성능 측정 시작 및 사용자 초기화
  useEffect(() => {
    start(); // 성능 측정 시작
    
    // 앱 시작시 로컬 userId 초기화 (API 호출 없이)
    const initializeLocalUser = async () => {
      await initializeUser(); // ✅ 이미 추출된 메서드 사용
    };
    
    initializeLocalUser();
  }, [start, initializeUser]); // ✅ 의존성 배열에 initializeUser 추가

  // 위치 정보가 있고 날씨 데이터가 필요한 경우 가져오기
  useEffect(() => {
    if (hasValidLocation && shouldFetchWeather(location, weatherData, lastUpdated)) {
      fetchWeatherData(location!);
    }
  }, [hasValidLocation, location, weatherData, lastUpdated]);

  // 위치와 userId가 있을 때 의류+액세서리 추천 데이터 가져오기
  useEffect(() => {
    if (hasValidLocation && userId) {
      // 데이터가 없거나 30분 이상 지난 경우 새로 가져오기
      const shouldFetch = !clothingRecommendation || 
                         !clothingLastUpdated || 
                         (new Date().getTime() - clothingLastUpdated.getTime()) > 30 * 60 * 1000;
      
      if (shouldFetch) {
        fetchClothingWithAccessories(userId, location!);
      }
    }
  }, [hasValidLocation, userId, location, clothingRecommendation, clothingLastUpdated, fetchClothingWithAccessories]);

  // 성능 측정 종료: 위치 정보와 날씨 데이터 모두 로딩 완료 시
  useEffect(() => {
    if (hasValidLocation && weatherData && !locationLoading && !weatherLoading) {
      end(); // 성능 측정 종료
    }
  }, [hasValidLocation, weatherData, locationLoading, weatherLoading, end]);

  const isLoading = locationLoading || weatherLoading;

  // 로딩 상태일 때는 완전히 다른 화면을 렌더링 (헤더, 탭바 없음)
  if (isLoading) {
    return (
      <View style={styles.fullScreenLoadingContainer}>
        <LoadingAnimation
          size="custom"
          width={loadingSize}
          height={loadingSize}
          containerStyle={styles.loadingAnimationContainer}
          showMessage={false}
        />
        
        {/* 로딩 중에도 권한 모달은 표시 */}
        <LocationPermissionModal
          visible={shouldShowModal}
          canAskAgain={canAskAgain}
          onRequestPermission={requestLocationPermission}
          onOpenSettings={openAppSettings}
          onClose={hidePermissionModal}
        />
      </View>
    );
  }

  // 화면에 표시할 데이터 준비
  const temperature = weatherData ? `${weatherData.temperature}°C` : "23°C";
  const condition = weatherData?.condition || "맑음";
  // 📍 이모지는 WeatherCard에서 추가하므로 여기서는 순수 텍스트만 전달
  const locationText = formatSimpleLocationText(location);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="WEATHEREVER" />

      {/* Location Search Input */}
      <View style={styles.searchContainer}>
        <LocationSearchInput
          onLocationSelect={handleLocationSelect}
          placeholder="지역을 검색하세요 (예: 학하동)"
          maxResults={8}
        />
      </View>

      {/* Weather Display (새로운 3단계 분할 구조) */}
      <WeatherDisplay
        temperature={temperature}
        condition={condition}
        location={locationText}
        windSpeed={weatherData?.windSpeed}
        weatherAccessoryData={clothingRecommendation || undefined}
        accessoryError={clothingError ? '의류 데이터를 불러올 수 없습니다' : undefined}
        showTestLabel={__DEV__}
      />



      {/* Location Permission Modal */}
      <LocationPermissionModal
        visible={shouldShowModal && !isLoading}
        canAskAgain={canAskAgain}
        onRequestPermission={requestLocationPermission}
        onOpenSettings={openAppSettings}
        onClose={hidePermissionModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // #2D2D2D (Mine Shaft)
  },

  searchContainer: {
    paddingHorizontal: theme.layout.contentPaddingHorizontal,
    paddingVertical: theme.spacing.md,
    zIndex: 1002, // 드롭다운이 다른 요소를 덕도록 하기 위해
    position: 'relative', // 상대 위치 설정
  },

  // 전체 화면 로딩 컨테이너 (헤더, 탭바 없는 순수 로딩 화면)
  fullScreenLoadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingAnimationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  characterPlaceholder: {
    // 피그마: image-removebg-preview 1 영역 (크기는 동적으로 계산)
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    // 피그마: transform: matrix(-1, 0, 0, 1, 0, 0)
    transform: [{ scaleX: -1 }],
  },


});

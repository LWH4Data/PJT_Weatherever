import { useWindowDimensions, Platform } from 'react-native';
import { theme } from '../styles/theme';

// react-native-safe-area-context 안전한 사용
let useSafeAreaInsets: () => { top: number; bottom: number; left: number; right: number };

try {
  // react-native-safe-area-context가 있으면 사용
  const safeAreaModule = require('react-native-safe-area-context');
  const originalUseSafeAreaInsets = safeAreaModule.useSafeAreaInsets;
  
  // Provider 없을 때도 안전하게 처리
  useSafeAreaInsets = () => {
    try {
      return originalUseSafeAreaInsets();
    } catch (error) {
      // Provider가 없을 때 기본값 사용
      console.warn('SafeAreaProvider not found, using default safe area values');
      return {
        top: Platform.OS === 'ios' ? 44 : 24,
        bottom: Platform.OS === 'ios' ? 34 : 0,
        left: 0,
        right: 0,
      };
    }
  };
} catch (error) {
  // 모듈이 없으면 기본값 사용
  console.warn('react-native-safe-area-context not installed, using default safe area values');
  useSafeAreaInsets = () => ({
    top: Platform.OS === 'ios' ? 44 : 24,
    bottom: Platform.OS === 'ios' ? 34 : 0,
    left: 0,
    right: 0,
  });
}

/**
 * 디바이스별 레이아웃 계산을 담당하는 훅
 * iPhone 13을 포함한 다양한 디바이스에서 일관된 UI 제공
 */
export const useDeviceLayout = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // 탭바 실제 높이 계산 (정확한 계산)
  const tabBarActualHeight = 
    16 +        // paddingTop (TabBar container)
    15 +        // paddingVertical top (tabBarBackground)
    8 +         // paddingVertical top (tabItem)
    24 +        // icon height
    4 +         // icon margin bottom
    12 +        // text height (approximate)
    8 +         // paddingVertical bottom (tabItem)
    15 +        // paddingVertical bottom (tabBarBackground)
    34;         // paddingBottom (고정값 - iPhone safe area 호환)

  // 헤더 높이 (SafeAreaView 내부이므로 안전영역 제외)
  const headerHeight = theme.layout.headerHeight;

  // 실제 사용 가능한 컨텐츠 높이
  const safeContentHeight = height - insets.top - insets.bottom;
  
  // WeatherSection이 사용할 수 있는 높이
  const weatherSectionHeight = safeContentHeight - headerHeight - tabBarActualHeight;

  // MessageBanner 높이 (고정)
  const messageBannerHeight = theme.layout.messageBannerHeight + (theme.spacing.md * 2); // 상하 마진 포함

  // WeatherCard가 사용할 수 있는 최적 높이 (MessageBanner 제거로 공간 확보)
  const weatherCardOptimalHeight = weatherSectionHeight - theme.spacing.md; // MessageBanner 높이 제거

  // WeatherCard 최소/최대 높이 (반응형)
  const weatherCardMinHeight = Math.max(300, height * 0.3); // 화면 높이의 30% 또는 최소 300px
  const weatherCardMaxHeight = Math.min(weatherCardOptimalHeight, height * 0.6); // 화면 높이의 60% 이하

  // 탭바까지의 마진 계산 (동적)
  const weatherCardBottomMargin = Math.max(20, tabBarActualHeight - 20);

  // 캠릭터 영역 계산 (3분할 구조)
  const weatherInfoHeight = 120; // 온도, 위치 정보 영역
  const accessoryHeight = 60;   // 액세서리 영역
  const characterAreaHeight = weatherCardOptimalHeight - weatherInfoHeight - accessoryHeight;
  
  // 캠릭터 최대 크기 (height 기준, 비율 유지)
  const characterMaxHeight = Math.max(200, characterAreaHeight * 0.9); // 여백 10% 확보
  const characterAspectRatio = 0.75; // 캠릭터 비율 (width/height) - GIF 비율에 맞게 조정
  const characterWidth = characterMaxHeight * characterAspectRatio;

  return {
    // 기본 디바이스 정보
    screenWidth: width,
    screenHeight: height,
    safeAreaInsets: insets,
    
    // 계산된 레이아웃 정보
    safeContentHeight,
    headerHeight,
    tabBarActualHeight,
    weatherSectionHeight,
    
    // WeatherCard 관련
    weatherCardOptimalHeight,
    weatherCardMinHeight,
    weatherCardMaxHeight,
    weatherCardBottomMargin,
    
    // MessageBanner 관련
    messageBannerHeight,
    
    // 반응형 여백 계산
    contentPadding: Math.max(16, width * 0.05), // 화면 너비의 5% 또는 최소 16px
    
    // 디바이스 타입 감지
    isSmallDevice: height < 700, // iPhone SE 등
    isMediumDevice: height >= 700 && height < 900, // iPhone 13, 14 등
    isLargeDevice: height >= 900, // iPhone 13 Pro Max, iPad 등
  };
};

/**
 * WeatherCard 전용 스타일 계산 훅
 */
export const useWeatherCardLayout = () => {
  const layout = useDeviceLayout();
  
  return {
    // WeatherCard 스타일 속성
    cardHeight: layout.weatherCardOptimalHeight,
    cardMinHeight: layout.weatherCardMinHeight,
    cardMaxHeight: layout.weatherCardMaxHeight,
    cardBottomMargin: Math.max(20, layout.tabBarActualHeight - 20), // 다른 스크린과 일관성 있게
    
    // 컨텐츠 영역 높이 (캐릭터 영역)
    contentAreaHeight: layout.weatherCardOptimalHeight - 100, // 상단 정보 영역 제외
    
    // 반응형 패딩
    cardPaddingHorizontal: layout.isSmallDevice ? theme.spacing.md : theme.spacing.lg,
    cardPaddingVertical: layout.isSmallDevice ? theme.spacing.md : theme.spacing.lg,
  };
};

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { WeatherInfoSection, AccessorySection } from '../../molecules';
import { Text } from '../../atoms';
import { CharacterSection } from '../../molecules';
import { WeatherAnimation } from '../../atoms';
import { theme } from '../../../styles/theme';
import { useWeatherCardLayout } from '../../../hooks';
import type { ClothingRecommendationResponse } from '../../../types';
import { 
  getWeatherTheme, 
  adjustThemeByTemperature, 
  adjustThemeByTime,
  getAnimationIntensity 
} from '../../../utils/weatherThemeUtils';

export interface WeatherDisplayProps {
  // WeatherInfoSection props
  temperature: string;
  condition: string;
  location: string;
  windSpeed?: number;
  
  // AccessorySection props - API 데이터 기반으로 변경
  weatherAccessoryData?: ClothingRecommendationResponse;
  accessoryError?: string; // 네트워크 에러 등을 표시하기 위한 prop
  
  // CharacterSection props
  showTestLabel?: boolean;
  characterFallback?: React.ReactNode;
  
  // WeatherDisplay specific props
  style?: ViewStyle;
  showAnimation?: boolean;
  showWeatherIcon?: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  temperature,
  condition,
  location,
  windSpeed,
  weatherAccessoryData,
  showTestLabel = false,
  characterFallback,
  style,
  showAnimation = true,
  showWeatherIcon = true,
  accessoryError,
}) => {
  const layout = useWeatherCardLayout();
  
  // 날씨 테마 계산 (기존 WeatherCard 로직 유지)
  const baseTheme = getWeatherTheme(condition);
  const temperatureValue = parseInt(temperature.replace('°C', '').replace('°F', ''));
  const currentHour = new Date().getHours();
  
  // 온도와 시간에 따른 테마 조정
  const adjustedTheme = adjustThemeByTime(
    adjustThemeByTemperature(baseTheme, temperatureValue),
    currentHour
  );
  
  // 애니메이션 강도 계산
  const animationIntensity = getAnimationIntensity(condition, windSpeed);
  
  // 동적 스타일 계산
  const dynamicCardStyle = {
    height: layout.cardHeight * 0.9, // 카드 높이 90%로 축소
    minHeight: layout.cardMinHeight * 0.9,
    maxHeight: layout.cardMaxHeight * 0.9,
    marginBottom: 20, // 탭바와의 간격 증가
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: layout.cardPaddingVertical,
    backgroundColor: adjustedTheme.backgroundColor,
    opacity: adjustedTheme.opacity,
  };

  return (
    <View style={[styles.card, dynamicCardStyle, style]}>
      {/* 날씨 애니메이션 배경 */}
      {showAnimation && (
        <WeatherAnimation
          condition={condition}
          intensity={animationIntensity}
        />
      )}

      <View style={styles.contentContainer}>
        {/* 날씨 정보 영역 */}
        <WeatherInfoSection
          temperature={temperature}
          condition={condition}
          location={location}
          windSpeed={windSpeed}
          showWeatherIcon={showWeatherIcon}
        />

        {accessoryError ? (
          // 에러 발생 시 중앙에 에러 메시지 표시
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>네트워크 오류: 의상 추천을 불러올 수 없습니다</Text>
          </View>
        ) : (
          // 정상 상태일 때 액세서리와 캐릭터 표시
          <>
            <AccessorySection
              weatherAccessoryData={weatherAccessoryData}
              showTitle={!!weatherAccessoryData}
            />
            <CharacterSection
              weather={condition}
              showTestLabel={showTestLabel}
              fallback={characterFallback}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // 기본 카드 스타일 (WeatherCard와 동일)
    marginHorizontal: theme.layout.weatherCardSide, // 47px 좌우 여백
    marginTop: theme.spacing.md, // 상단 여백
    
    borderRadius: theme.borderRadius.md, // 20px
    
    // flex 기반 레이아웃
    flexDirection: 'column',
    

    
    // 모든 자식 요소들도 borderRadius를 따르도록 설정
    overflow: 'hidden',
  },
  
  // 툴팁을 위한 별도의 컨테이너
  contentContainer: {
    overflow: 'visible', // 툴팁이 보이도록 설정
    flex: 1,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

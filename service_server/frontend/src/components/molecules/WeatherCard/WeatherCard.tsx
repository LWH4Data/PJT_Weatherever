import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../../atoms';
import { WeatherAnimation } from '../../atoms/WeatherAnimation';
import { WeatherIcon } from '../../atoms/WeatherIcon';
import { theme } from '../../../styles/theme';
import { useWeatherCardLayout } from '../../../hooks';
import { 
  getWeatherTheme, 
  adjustThemeByTemperature, 
  adjustThemeByTime,
  getAnimationIntensity 
} from '../../../utils/weatherThemeUtils';

export interface WeatherCardProps {
  temperature: string;
  condition: string;
  location: string;
  windSpeed?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
  showAnimation?: boolean;
  showWeatherIcon?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  location,
  windSpeed,
  children,
  style,
  showAnimation = true,
  showWeatherIcon = true,
}) => {
  const layout = useWeatherCardLayout();
  
  // 날씨 테마 계산
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
    height: layout.cardHeight,
    minHeight: layout.cardMinHeight,
    maxHeight: layout.cardMaxHeight,
    marginBottom: layout.cardBottomMargin,
    paddingHorizontal: layout.cardPaddingHorizontal,
    paddingVertical: layout.cardPaddingVertical,
    backgroundColor: adjustedTheme.backgroundColor,
    opacity: adjustedTheme.opacity,
  };

  const dynamicTextStyle = {
    color: adjustedTheme.textColor,
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

      {/* Weather Info Container - Top */}
      <View style={styles.topContainer}>
        {/* Weather Info - Left */}
        <View style={styles.weatherInfoContainer}>
          <Text variant="h2" style={StyleSheet.flatten([styles.temperature, dynamicTextStyle])}>
            {temperature}
          </Text>
          <View style={styles.conditionContainer}>
            {showWeatherIcon && (
              <WeatherIcon 
                condition={condition} 
                size="small" 
                animated={false}
                style={styles.conditionIcon}
              />
            )}
            <Text variant="body" style={StyleSheet.flatten([styles.condition, dynamicTextStyle])}>
              {condition}
            </Text>
          </View>
          {/* 바람 정보를 왼쪽 아래로 이동 */}
          {/* {windSpeed && (
            <Text variant="caption" style={StyleSheet.flatten([styles.windInfo, dynamicTextStyle])}>
              🌬️ 바람: {windSpeed}km/h
            </Text>
          )} */}
        </View>

        {/* Location Info - Right */}
        <View style={styles.locationContainer}>
          <Text variant="body" style={StyleSheet.flatten([styles.location, dynamicTextStyle])}>
            📍 {location}
          </Text>
        </View>
      </View>

      {/* Character/Content Area - Center */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // 기본 카드 스타일 (크기 관련 속성은 동적으로 계산)
    marginHorizontal: theme.layout.weatherCardSide, // 47px 좌우 여백
    marginTop: theme.spacing.md, // 상단 여백
    
    borderRadius: theme.borderRadius.md, // 20px
    
    // flex 기반 레이아웃
    flexDirection: 'column',
  
    
    // 오버플로우 설정 (애니메이션을 카드 내부로 제한)
    overflow: 'hidden',
  },
  
  topContainer: {
    // 상단 날씨 정보 컨테이너
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    minHeight: 39,
    zIndex: 10, // 애니메이션 위에 표시
  },
  
  weatherInfoContainer: {
    // 피그마: Container (날씨 정보)
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 80,
    zIndex: 10,
  },
  
  temperature: {
    // 피그마: 23°C 
    fontFamily: theme.typography.fontFamily,
    fontWeight: '700', // React Native 호환 타입
    fontSize: theme.typography.fontSize.lg, // 16px
    lineHeight: theme.typography.lineHeight.lg, // 19px

  } as TextStyle,
  
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  conditionIcon: {
    marginRight: 2,
  },
  
  condition: {
    // 피그마: 맑음
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400', // React Native 호환 타입
    fontSize: theme.typography.fontSize.sm, // 12px
    lineHeight: theme.typography.lineHeight.base, // 14px

  } as TextStyle,
  
  windInfo: {
    // 바람 정보 스타일
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
    fontSize: theme.typography.fontSize.xs, // 10px
    lineHeight: theme.typography.lineHeight.sm, // 12px
    marginTop: 4,

  } as TextStyle,
  
  locationContainer: {
    // 피그마: Container (위치)
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 100,
    zIndex: 10,
  },
  
  location: {
    // 피그마: 📍 서울, 대한민국
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400', // React Native 호환 타입
    fontSize: theme.typography.fontSize.sm, // 12px
    lineHeight: theme.typography.lineHeight.base, // 14px
    textAlign: 'right',

  } as TextStyle,
  
  contentContainer: {
    // 피그마: 캐릭터 영역
    flex: 1,
    position: 'relative',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0, // 하단 패딩 제거
    zIndex: 5,
  },
});

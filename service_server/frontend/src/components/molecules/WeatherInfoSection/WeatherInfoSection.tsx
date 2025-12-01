import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../../atoms';
import { WeatherIcon } from '../../atoms/WeatherIcon';
import { theme } from '../../../styles/theme';
import { useWeatherCardLayout } from '../../../hooks';
import { WEATHER_INFO_RATIO } from '../../../constants/layoutRatios';

export interface WeatherInfoSectionProps {
  temperature: string;
  condition: string;
  location: string;
  windSpeed?: number;
  style?: ViewStyle;
  showWeatherIcon?: boolean;
}

export const WeatherInfoSection: React.FC<WeatherInfoSectionProps> = ({
  temperature,
  condition,
  location,
  windSpeed,
  style,
  showWeatherIcon = true,
}) => {
  const layout = useWeatherCardLayout();
  
  // WeatherCard 전체 높이의 15% 계산
  const sectionHeight = layout.cardHeight * WEATHER_INFO_RATIO;
  
  const dynamicStyle = {
    height: sectionHeight,
  };

  const textColor = condition === '맑음' ? '#000000' : theme.colors.white;

  return (
    <View style={[styles.container, dynamicStyle, style]}>
      {/* Weather Info - Left */}
      <View style={styles.weatherInfoContainer}>
        <Text style={[styles.temperature, { color: textColor }]}>
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
          <Text style={[styles.condition, { color: textColor }]}>
            {condition}
          </Text>
        </View>
        {/* 바람 정보 */}
        {/* {windSpeed && (
          <Text style={styles.windInfo}>
            🌬️ 바람: {windSpeed}km/h
          </Text>
        )} */}
      </View>

      {/* Location Info - Right */}
      <View style={styles.locationContainer}>
        <Text style={[styles.location, { color: textColor }]}>
          📍 {location}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 25% 영역 컨테이너
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    zIndex: 10, // 애니메이션 위에 표시
  },
  
  weatherInfoContainer: {
    // 날씨 정보 (왼쪽)
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 80,
    zIndex: 10,
  },
  
  temperature: {
    // 온도 텍스트
    fontFamily: theme.typography.fontFamily,
    fontWeight: '700',
    fontSize: theme.typography.fontSize.lg, // 16px
    lineHeight: theme.typography.lineHeight.lg, // 19px
    color: theme.colors.white,
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
    // 날씨 상태
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
    fontSize: theme.typography.fontSize.sm, // 12px
    lineHeight: theme.typography.lineHeight.base, // 14px
    color: theme.colors.white,
  } as TextStyle,
  
  windInfo: {
    // 바람 정보
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
    fontSize: theme.typography.fontSize.xs, // 10px
    lineHeight: theme.typography.lineHeight.sm, // 12px
    color: theme.colors.white80,
    marginTop: 4,
  } as TextStyle,
  
  locationContainer: {
    // 위치 정보 (오른쪽)
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 100,
    zIndex: 10,
  },
  
  location: {
    // 위치 텍스트
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400',
    fontSize: theme.typography.fontSize.sm, // 12px
    lineHeight: theme.typography.lineHeight.base, // 14px
    color: theme.colors.white,
    textAlign: 'right',
  } as TextStyle,
});

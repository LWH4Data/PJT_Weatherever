import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HourlyWeatherData } from '../../../types';
import { weatherForecastService } from '../../../services';

export interface WeatherHourCardProps {
  data: HourlyWeatherData;
  onPress?: () => void;
  isActive?: boolean;
}

/**
 * 시간별 날씨 정보를 표시하는 원자 컴포넌트 (비클릭 버전)
 */
export const WeatherHourCard: React.FC<WeatherHourCardProps> = ({
  data,
  onPress,
  isActive = false
}) => {
  const { time, temperature, icon, description, precipitationProbability  } = data;

  // 강수확률이 0% 초과면 icon을 "비"로 교체
  const displayIcon = precipitationProbability > 0 ? "🌧️" : icon;
  const displayDescription = precipitationProbability > 0 ? "비" : description || "흐림";

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{time}</Text>
      <Text style={styles.iconText}>{displayIcon}</Text>
      <Text style={styles.precipitationText}>{precipitationProbability}%</Text>
      <Text style={styles.temperatureText}>{temperature}°C</Text>
      <Text style={styles.descriptionText}>{displayDescription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  
  iconText: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  
  temperatureText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  
  descriptionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'center',
  },
  
  precipitationText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'center',
  },
});

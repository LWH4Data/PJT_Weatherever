import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MessageBanner, WeatherCard } from '../../molecules';

export interface WeatherSectionProps {
  message: string;
  temperature: string;
  condition: string;
  location: string;
  windSpeed?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const WeatherSection: React.FC<WeatherSectionProps> = ({
  message,
  temperature,
  condition,
  location,
  windSpeed,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Message Banner */}
      <MessageBanner message={message} />

      {/* Weather Card */}
      <WeatherCard
        temperature={temperature}
        condition={condition}
        location={location}
        windSpeed={windSpeed}
      >
        {children}
      </WeatherCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // WeatherSection은 이제 flex 기반 레이아웃 사용
    flex: 1,
    flexDirection: 'column',
  },
});

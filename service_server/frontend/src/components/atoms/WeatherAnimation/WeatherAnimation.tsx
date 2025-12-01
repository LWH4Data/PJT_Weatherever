import React from 'react';
import { View, Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

export interface WeatherAnimationProps {
  condition: string;
  intensity?: 'light' | 'normal' | 'heavy';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({
  condition,
  intensity = 'normal',
  style,
  imageStyle,
}) => {
  // 날씨 조건에 따른 GIF 파일 매핑
  const getWeatherGif = (weatherCondition: string) => {
    const normalizedCondition = weatherCondition.toLowerCase().trim();
    
    // 비 관련
    if (normalizedCondition.includes('비') || 
        normalizedCondition.includes('rain') || 
        normalizedCondition.includes('소나기') || 
        normalizedCondition.includes('shower')) {
      return require('../../../../assets/weatherAnimation/rain.gif');
    }
    
    // 눈 관련
    if (normalizedCondition.includes('눈') || 
        normalizedCondition.includes('snow')) {
      return require('../../../../assets/weatherAnimation/snow.gif');
    }
    
    // 맑음 관련
    if (normalizedCondition.includes('맑음') || 
        normalizedCondition.includes('sunny') || 
        normalizedCondition.includes('clear') ||
        normalizedCondition.includes('sun')) {
      return require('../../../../assets/weatherAnimation/sunshine.gif');
    }
    
    // 구름 관련 (구름많음, 흐림, 구름 등)
    if (normalizedCondition.includes('구름') || 
        normalizedCondition.includes('cloud') || 
        normalizedCondition.includes('흐림') ||
        normalizedCondition.includes('overcast') ||
        normalizedCondition.includes('안개') ||
        normalizedCondition.includes('fog')) {
      return require('../../../../assets/weatherAnimation/clouds.gif');
    }
    
    // 기본값 (맑음)
    return require('../../../../assets/weatherAnimation/sunshine.gif');
  };

  // 강도에 따른 투명도 조절
  const getOpacityByIntensity = (intensity: string): number => {
    switch (intensity) {
      case 'light': return 0.6;
      case 'heavy': return 1.0;
      default: return 0.8;
    }
  };

  const weatherGif = getWeatherGif(condition);
  const opacity = getOpacityByIntensity(intensity);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={weatherGif}
        style={[
          styles.weatherGif,
          { opacity },
          imageStyle
        ]}
        resizeMode="cover"
        testID="weather-animation-gif"
        accessible={true}
        accessibilityLabel={`${condition} 날씨 애니메이션`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  
  weatherGif: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

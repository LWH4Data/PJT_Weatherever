import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet, TextStyle } from 'react-native';
import { getWeatherTheme } from '../../../utils/weatherThemeUtils';

export interface WeatherIconProps {
  condition: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  style?: TextStyle;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = 'medium',
  animated = true,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const theme = getWeatherTheme(condition);
  const emoji = theme.emoji;

  useEffect(() => {
    // 애니메이션 비활성화 - 아이콘을 고정된 상태로 유지
    if (animated) {
      // 애니메이션을 끗고 기본 상태로 설정
      scaleAnim.setValue(1);
      rotateAnim.setValue(0);
      opacityAnim.setValue(1);
    }
  }, [condition, animated]);

  const startAnimation = () => {
    const normalizedCondition = condition.toLowerCase();
    
    // 태양 - 회전 애니메이션
    if (normalizedCondition.includes('맑') || normalizedCondition.includes('sunny')) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    }
    
    // 구름 - 부드러운 스케일 애니메이션
    else if (normalizedCondition.includes('구름') || normalizedCondition.includes('cloud')) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    // 비/눈 - 반짝임 애니메이션
    else if (normalizedCondition.includes('비') || normalizedCondition.includes('눈') || 
             normalizedCondition.includes('rain') || normalizedCondition.includes('snow')) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    // 천둥번개 - 강한 스케일 + 회전
    else if (normalizedCondition.includes('천둥') || normalizedCondition.includes('thunder')) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0.1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(1000),
        ])
      ).start();
    }
  };

  const getIconStyle = (): TextStyle => {
    return StyleSheet.flatten([
      styles.icon,
      styles[size],
      style,
    ]);
  };

  const getTransform = () => {
    const rotateInterpolate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return [
      { scale: scaleAnim },
      { rotate: rotateInterpolate },
    ];
  };

  return (
    <Animated.Text
      style={[
        getIconStyle(),
        {
          transform: getTransform(),
          opacity: opacityAnim,
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
  
  // Size variants
  small: {
    fontSize: 16,
    lineHeight: 20,
  },
  medium: {
    fontSize: 20,
    lineHeight: 24,
  },
  large: {
    fontSize: 24,
    lineHeight: 28,
  },
  xlarge: {
    fontSize: 32,
    lineHeight: 36,
  },
});

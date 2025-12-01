import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AnimatedCharacterDisplay } from '../AnimatedCharacterDisplay';
import { theme } from '../../../styles/theme';
import { useWeatherCardLayout, useDeviceLayout } from '../../../hooks';
import { CHARACTER_RATIO, WEATHER_INFO_RATIO, ACCESSORY_RATIO } from '../../../constants/layoutRatios';

export interface CharacterSectionProps {
  weather?: string; // 날씨 상태 기반 캐릭터 선택
  style?: ViewStyle;
  showTestLabel?: boolean;
  fallback?: React.ReactNode;
}

export const CharacterSection: React.FC<CharacterSectionProps> = ({
  weather = 'default',
  style,
  showTestLabel = false,
  fallback,
}) => {
  const layout = useWeatherCardLayout();
  const { isSmallDevice, screenWidth } = useDeviceLayout();

  // 🎯 정확한 캐릭터 영역 크기 계산 (75% 비율 사용)
  const actualCardHeight = layout.cardHeight * 0.9; // WeatherDisplay에서 사용하는 실제 카드 높이
  const paddingVertical = layout.cardPaddingVertical; // 상하 패딩
  const availableHeight = actualCardHeight - (paddingVertical * 2); // 실제 사용 가능 높이
  
  // 각 영역의 실제 높이 계산
  const weatherInfoHeight = availableHeight * WEATHER_INFO_RATIO;
  const accessoryHeight = availableHeight * ACCESSORY_RATIO;
  const characterHeight = availableHeight * CHARACTER_RATIO;

  // 🚀 개선된 로직: height 기준으로 width 계산 (비율 고정)
  const characterAspectRatio = 0.80; // 4:5 비율 - 필요시 1:1 등으로 조정 가능
  const characterWidth = characterHeight * characterAspectRatio;
  
  // 화면 너비를 초과하지 않도록 안전 장치
  const maxAllowedWidth = screenWidth * 0.8;
  
  // 🔧 핵심 수정: width가 제한되면 height도 같이 줄이기 (비율 유지)
  let finalCharacterWidth, finalCharacterHeight;
  
  if (characterWidth > maxAllowedWidth) {
    // Width가 제한될 때: 비율을 유지하면서 둘 다 줄이기
    finalCharacterWidth = maxAllowedWidth;
    finalCharacterHeight = maxAllowedWidth / characterAspectRatio; // 비율 유지
  } else {
    // Width가 제한되지 않을 때: 원래 크기 사용
    finalCharacterWidth = characterWidth;
    finalCharacterHeight = characterHeight;
  }
  


  return (
    <View
      style={[
        styles.container,
        { width: finalCharacterWidth, height: finalCharacterHeight }, // 비율 유지된 최종 크기 사용
        style,
      ]}
    >
      <View style={styles.characterWrapper}>
        <AnimatedCharacterDisplay 
          width={finalCharacterWidth} 
          height={finalCharacterHeight} 
          style={styles.character} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 섹션 컨테이너
    alignSelf: 'center', // 가로 중앙 정렬
  },

  characterWrapper: {
    // 캐릭터를 감싸는 래퍼
    width: '100%',
    height: '100%',
    justifyContent: 'center', // 세로 중앙 정렬 (기존 flex-end에서 변경)
    alignItems: 'center', // 가로 중앙 정렬
    overflow: 'hidden', // 캐릭터 잘림 방지
    padding: 20, // 더 많은 여유 공간 확보
  },

  character: {
    width: '90%', // height 기준 로직으로 더 크게 조정 가능
    height: '90%', // height 기준 로직으로 더 크게 조정 가능
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

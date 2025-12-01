import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AccessoryItem, ClothingRecommendationResponse } from '../../../types';

export interface AccessoryTooltipProps {
  accessoryItem: AccessoryItem;
  weatherData: ClothingRecommendationResponse;
  visible: boolean;
  itemIndex: number;      // 현재 아이템의 인덱스
  totalItems: number;     // 전체 아이템 수
}

/**
 * 악세사리 터치 시 표시되는 툴팁 컴포넌트
 * 말풍선 스타일로 기후 정보를 표시
 */
export const AccessoryTooltip: React.FC<AccessoryTooltipProps> = ({
  accessoryItem,
  weatherData,
  visible,
  itemIndex,
  totalItems,
}) => {
  if (!visible) return null;

  // 악세사리 타입별 기후 정보 생성 (간결한 형태)
  const getClimateInfo = (): string => {
    switch (accessoryItem.type) {
      case 'umbrella':
        if (typeof weatherData.rainInfo === 'string') {
          return weatherData.rainInfo;
        }
        return weatherData.rainInfo ? '비 예보 있음' : '비 정보 없음';
        
      case 'suncream':
        return weatherData.uvInfo;
        
      case 'mask':
        return weatherData.airPollutionInfo;
        
      default:
        return '정보 없음';
    }
  };

  const climateInfo = getClimateInfo();

  return (
    <View style={styles.tooltipContainer}>
      {/* 말풍선 본체 */}
      <View style={styles.tooltipBody}>
        <View style={styles.header}>
          <Text style={styles.title}>{getAccessoryName(accessoryItem.type)}</Text>
          <Text style={styles.climateText}>{climateInfo}</Text>
        </View>
      </View>
      
      {/* 말풍선 화살표 */}
      <View style={styles.arrow} />
    </View>
  );
};

// 악세사리 타입별 이름 반환
const getAccessoryName = (type: AccessoryItem['type']): string => {
  switch (type) {
    case 'umbrella': return '비 예보';
    case 'suncream': return '자외선';
    case 'mask': return '미세먼지';
    default: return '악세사리';
  }
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 200, // 오버레이(100)보다 훨씬 높게
    bottom: 60, // 액세서리 위로 고정된 거리
    width: '100%',
    left: 0,
  },
  
  tooltipBody: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 100,
    maxWidth: 140,
    alignItems: 'center',        // 가로 중앙 정렬
    justifyContent: 'center',    // 세로 중앙 정렬
    alignSelf: 'center',         // 부모 내에서 중앙 정렬
    
    elevation: 10,
  },
  
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    width: '100%',
  },
  
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  
  climateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.85)',
    marginTop: -1, // 말풍선 본체와 연결
  },
});

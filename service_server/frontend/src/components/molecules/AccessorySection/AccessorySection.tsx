import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, Image, ImageStyle, TouchableOpacity } from 'react-native';
import { Text, AccessoryTooltip } from '../../atoms';
import { theme } from '../../../styles/theme';
import { useWeatherCardLayout } from '../../../hooks';
import { ACCESSORY_RATIO } from '../../../constants/layoutRatios';
import type { ClothingRecommendationResponse, AccessoryItem } from '../../../types';

// 이미지 assets import
const ACCESSORY_IMAGES = {
  umbrella: require('../../../../assets/accessary/umbrella.png'),
  suncream: require('../../../../assets/accessary/suncream.png'),
  mask: require('../../../../assets/accessary/mask.png'),
};

export interface AccessorySectionProps {
  // API 응답 데이터 기반으로 변경
  weatherAccessoryData?: ClothingRecommendationResponse;
  style?: ViewStyle;
  showTitle?: boolean;
  error?: string;
}

export const AccessorySection: React.FC<AccessorySectionProps> = ({
  weatherAccessoryData,
  style,
  showTitle = true,
  error,
}) => {
  const layout = useWeatherCardLayout();
  const [selectedAccessory, setSelectedAccessory] = useState<AccessoryItem | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // WeatherCard 전체 높이의 10% 계산
  const sectionHeight = layout.cardHeight * ACCESSORY_RATIO;
  
  const dynamicStyle = {
    height: sectionHeight,
  };

  // 자동 툴팁 닫기 타이머 (3초)
  useEffect(() => {
    if (selectedAccessory) {
      closeTimeoutRef.current = setTimeout(() => {
        setSelectedAccessory(null);
      }, 3000);
    }
    
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [selectedAccessory]);

  // 악세사리 터치 핸들러
  const handleAccessoryPress = (item: AccessoryItem) => {
    // 기존 타이머 취소
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // 같은 악세사리를 다시 누르면 툴팁 닫기
    if (selectedAccessory?.id === item.id) {
      setSelectedAccessory(null);
      return;
    }
    
    setSelectedAccessory(item);
  };
  
  // 툴팁 닫기
  const closeTooltip = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setSelectedAccessory(null);
  };

  // API 데이터를 기반으로 표시할 액세서리 결정
  const getAccessoryItems = (): AccessoryItem[] => {
    if (!weatherAccessoryData) return [];
    
    const items: AccessoryItem[] = [];
    
    // 1. 비 정보 확인 - rainInfo가 false가 아니면 우산 추가
    if (weatherAccessoryData.rainInfo !== false) {
      items.push({
        id: 'umbrella',
        type: 'umbrella',
        image: ACCESSORY_IMAGES.umbrella,
        condition: '비 예상',
      });
    }
    
    // 2. UV 지수 확인 - 높음, 매우높음, 위험이면 선크림 추가
    if (['높음', '매우높음', '위험'].includes(weatherAccessoryData.uvInfo)) {
      items.push({
        id: 'suncream',
        type: 'suncream',
        image: ACCESSORY_IMAGES.suncream,
        condition: `UV 지수 ${weatherAccessoryData.uvInfo}`,
      });
    }
    
    // 3. 대기오염 확인 - 나쁨, 매우나쁨이면 마스크 추가
    if (['나쁨', '매우나쁨'].includes(weatherAccessoryData.airPollutionInfo)) {
      items.push({
        id: 'mask',
        type: 'mask',
        image: ACCESSORY_IMAGES.mask,
        condition: `대기오염 ${weatherAccessoryData.airPollutionInfo}`,
      });
    }
    
    return items;
  };
  
  const accessoryItems = getAccessoryItems();

  // 에러가 있으면 에러 메시지 표시
  if (error) {
    return (
      <View style={[styles.container, dynamicStyle, style]}>
        <View style={styles.errorContainer}>
          <Text 
            variant="body" 
            color="error" 
            style={{ textAlign: 'center' }}
          >
            {error}
          </Text>
        </View>
      </View>
    );
  }
  
  // 액세서리가 없으면 빈 영역으로 표시
  if (accessoryItems.length === 0) {
    return <View style={[styles.container, dynamicStyle, style]} />;
  }

  return (
    <View style={[styles.container, dynamicStyle, style]}>
      {/* 배경 터치로 툴팁 닫기 */}
      {selectedAccessory && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={closeTooltip}
        />
      )}
      
      <View style={styles.accessoryGrid}>
        {accessoryItems.map((item, index) => (
          <View key={item.id} style={styles.accessoryWrapper}>
            {selectedAccessory?.id === item.id && weatherAccessoryData && (
              <AccessoryTooltip
                accessoryItem={item}
                weatherData={weatherAccessoryData}
                visible={true}
                itemIndex={index}
                totalItems={accessoryItems.length}
              />
            )}
            <TouchableOpacity

              style={[
                styles.accessoryItemContainer,
                selectedAccessory?.id === item.id && styles.selectedAccessory
              ]}
              activeOpacity={0.7}
              onPress={() => handleAccessoryPress(item)}
            >
              <View style={styles.accessoryImageWrapper}>
                <Image
                  source={item.image}
                  style={styles.accessoryImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 10% 영역 컨테이너
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 4,
    zIndex: 12, // WeatherInfo(10)보다 낮고, Character(5)보다 높음
    // 툴팁이 컴테이너를 벗어날 수 있도록 설정
    overflow: 'visible',
  },
  
  overlay: {
    position: 'absolute',
    top: -2000, // 화면 전체를 덮도록 충분히 큰 값
    left: -2000,
    right: -2000,
    bottom: -2000,
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // 아주 연한 반투명 배경
    zIndex: 100, // 액세서리보다 위에 있지만 툴팁보다는 아래
  },
  
  accessoryGrid: {
    // 액세서리 그리드 컨테이너 (좌우 대칭 정렬)
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    zIndex: 1, // 오버레이보다 낮게 설정
  },

  accessoryWrapper: {
    // 액세서리와 툴팁을 포함하는 컨테이너
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  accessoryItemContainer: {
    // 개별 액세서리 아이템 컨테이너
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  selectedAccessory: {
    // 선택된 액세서리 스타일
    transform: [{ scale: 1.1 }],
  },
  
  accessoryImageWrapper: {
    // 이미지 래퍼 (원형 배경)
    width: 50,
    height: 50,
    borderRadius: 25, // 원형
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  
  accessoryImage: {
    width: '80%',
    height: '80%',
  } as ImageStyle,
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
});

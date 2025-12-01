import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AnimatedCharacter } from '../../atoms';
import { Text } from '../../atoms';
import { getCharacterGif } from '../../../utils/characterGifMapper';
import { useClothingStore } from '../../../stores/appStore';

interface AnimatedCharacterDisplayProps {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
  showTestLabel?: boolean; // 테스트용 라벨 표시 여부
  message?: string; // 캐릭터와 함께 표시할 메시지
}

export const AnimatedCharacterDisplay: React.FC<AnimatedCharacterDisplayProps> = ({
  width = 250,
  height = 400,
  style,
  showTestLabel = false,
  message,
}) => {
  // 의류 상태에서 데이터 가져오기
  const { clothingType, clothingLoading, clothingError } = useClothingStore();
  
  // ViewStyle로 변환 - 수정된 로직
  const containerStyle = {
    width: typeof width === 'number' ? width : width,
    height: typeof height === 'number' ? height : height,
    minWidth: 200,  // 최소 크기 보장
    minHeight: 300, // 최소 크기 보장
  };

  // 에러 상태일 때 표시할 내용
  if (clothingError) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.characterContainer, containerStyle]}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingSubText}>의류 데이터를 불러올 수 없습니다</Text>
          </View>
        </View>
      </View>
    );
  }
  
  // 의류 타입이 없을 때는 표시하지 않음
  if (!clothingType) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.characterContainer, containerStyle]}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingSubText}>의류 데이터를 불러올 수 없습니다</Text>
          </View>
        </View>
      </View>
    );
  }
  
  // 의류 타입을 파라미터로 전달
  const gifSource = getCharacterGif(clothingType);

  // 로딩 중일 때 표시할 내용
  if (clothingLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.characterContainer, containerStyle]}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingSubText}>의류 분석 중...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.characterContainer, containerStyle]}>
        <AnimatedCharacter
          gifSource={gifSource}
          width="100%"
          height="100%"
          resizeMode="contain"
          style={styles.character}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden', // 중요: 캐릭터 잘림 방지
  },
  characterContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // 중요: 캐릭터 잘림 방지
    width: '100%', // 명시적 크기 설정
    height: '100%', // 명시적 크기 설정
  },
  character: {
    width: '100%',
    height: '100%',
  },
  
  // 새로 추가: 로딩 스타일
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  loadingText: {
    fontSize: 40,
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  
  // 새로 추가: 디버그 스타일
  debugContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 10,
    marginTop: 2,
  },
  
  // 기존 스타일들
  messageContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    maxWidth: 200,
  },
  messageText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AnimatedCharacterDisplay;

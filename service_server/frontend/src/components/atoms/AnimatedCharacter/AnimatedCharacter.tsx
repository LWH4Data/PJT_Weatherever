import React from 'react';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';
import { Text } from '../Text';

interface AnimatedCharacterProps {
  gifSource?: any; // require() 또는 uri
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;      // ✅ 캐릭터 원본 비율(예: 3/4)
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  style?: ViewStyle;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  gifSource,
  width = '100%',
  height = '100%',
  resizeMode = 'contain',
  style,
}) => {
  // GIF가 있으면 Image 컴포넌트로 표시
  if (gifSource) {
    const sourceObject = typeof gifSource === 'string'
      ? { uri: gifSource }
      : gifSource;

    return (
      <View style={[styles.container, { width, height }, style]}>
        <Image
          source={sourceObject}
          style={styles.gif}
          resizeMode="contain" // 강제로 contain 설정
          fadeDuration={0} // 페이드 애니메이션 비활성화
        />
      </View>
    );
  }

  // GIF가 없을 때 Placeholder 표시
  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>🎭</Text>
        <Text style={styles.placeholderSubText}>캐릭터 영역</Text>
        <Text style={styles.placeholderInfo}>GIF 없음</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden', // 캐릭터 잘림 방지를 위해 다시 추가
    justifyContent: 'center', // 세로 중앙 정렬
    alignItems: 'center', // 가로 중앙 정렬
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // 배경색과 테두리 제거 - 깔끔한 placeholder
  },
  placeholderText: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderSubText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  placeholderInfo: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  gif: {
    width: '100%',
    height: '100%',
    maxWidth: '100%', // 최대 크기 제한
    maxHeight: '100%', // 최대 크기 제한
    objectFit: 'contain', // 웹에서 object-fit 직접 사용
    transform: [{ scale: 0.85 }], // 안전하게 85%로 축소
  },
});

export default AnimatedCharacter;

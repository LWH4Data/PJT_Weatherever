import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Text } from '../Text';

export interface LoadingAnimationProps {
  /** 로딩 메시지 (선택사항) */
  message?: string;
  /** 로딩 애니메이션 크기 */
  size?: 'small' | 'medium' | 'large' | 'custom';
  /** custom 크기 사용 시 너비 */
  width?: number;
  /** custom 크기 사용 시 높이 */
  height?: number;
  /** 컨테이너 스타일 */
  containerStyle?: ViewStyle;
  /** 이미지 스타일 */
  imageStyle?: ImageStyle;
  /** 메시지 표시 여부 */
  showMessage?: boolean;
  /** 테스트ID */
  testID?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  message,
  size = 'medium',
  width,
  height,
  containerStyle,
  imageStyle,
  showMessage = true,
  testID = 'loading-animation',
}) => {
  // 사전 정의된 크기들
  const getSizeStyle = (): ImageStyle => {
    if (size === 'custom') {
      return {
        width: width || 80,
        height: height || 80,
      };
    }

    const sizeMap = {
      small: { width: 40, height: 40 },
      medium: { width: 80, height: 80 },
      large: { width: 120, height: 120 },
    };

    return sizeMap[size];
  };

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <Image
        source={require('../../../../assets/loading.gif')}
        style={[styles.loadingImage, getSizeStyle(), imageStyle]}
        resizeMode="contain"
        testID={`${testID}-image`}
        accessible={true}
        accessibilityLabel="로딩 중 애니메이션"
      />
      
      {showMessage && message && (
        <Text 
          variant="body" 
          color="white80" 
          style={styles.message}
          testID={`${testID}-message`}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  
  loadingImage: {
    // 기본 이미지 스타일
  } as ImageStyle,
  
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});

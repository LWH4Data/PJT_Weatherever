import React from 'react';
import { Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

export interface LogoProps {
  /** 로고 크기 사전 정의 */
  size?: 'small' | 'medium' | 'large' | 'custom';
  /** custom 크기 사용 시 너비 */
  width?: number;
  /** custom 크기 사용 시 높이 */
  height?: number;
  /** 추가 스타일 */
  style?: ImageStyle;
  /** 테스트ID */
  testID?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  width,
  height,
  style,
  testID = 'weatherever-logo',
}) => {
  // 사전 정의된 크기들
  const getSizeStyle = (): ImageStyle => {
    if (size === 'custom') {
      return {
        width: width || 120,
        height: height || 40,
      };
    }

    const sizeMap = {
      small: { width: 80, height: 26 },
      medium: { width: 120, height: 40 },
      large: { width: 160, height: 53 },
    };

    return sizeMap[size];
  };

  return (
    <Image
      source={require('../../../../assets/logo.png')}
      style={[styles.logo, getSizeStyle(), style]}
      resizeMode="contain"
      testID={testID}
      accessible={true}
      accessibilityLabel="WEATHEREVER 로고"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // 기본 스타일
  } as ImageStyle,
});

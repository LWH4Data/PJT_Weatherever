import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../../atoms';
import { theme } from '../../../styles/theme';
import { useDeviceLayout } from '../../../hooks';

export interface MessageBannerProps {
  message: string;
  style?: ViewStyle;
}

export const MessageBanner: React.FC<MessageBannerProps> = ({
  message,
  style,
}) => {
  const { isSmallDevice } = useDeviceLayout();
  
  // 동적 스타일 계산 (좌우 여백은 기존 47px 유지)
  const dynamicContainerStyle = {
    marginHorizontal: theme.layout.messageBannerSide, // 47px 고정값 유지
    paddingHorizontal: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
    paddingVertical: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
  };
  
  return (
    <View style={[styles.container, dynamicContainerStyle, style]}>
      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 메시지 배너를 하단 탭바 위에 고정
    position: 'absolute',
    bottom: 70, // 탭바 높이(60) + 여백(10)
    left: theme.layout.messageBannerSide,
    right: theme.layout.messageBannerSide,
    
    // 피그마: Overlay+Border+OverlayBlur
    flexDirection: 'column',
    alignItems: 'center',
    
    // 피그마: 스타일
    backgroundColor: theme.colors.white10,
    borderWidth: 1,
    borderColor: theme.colors.white20,
    borderRadius: theme.borderRadius.base, // 15px
    

    
    // 항상 탭바 위에 표시되도록 zIndex 설정
    zIndex: 999,
  },
  
  message: {
    // 피그마: 메시지 텍스트
    fontFamily: theme.typography.fontFamily,
    fontWeight: '500', // React Native 호환 타입으로 직접 지정
    fontSize: theme.typography.fontSize.base, // 13px
    lineHeight: theme.typography.lineHeight.md, // 15px
    
    textAlign: 'center',
    color: theme.colors.white,
    
    // 유연한 너비로 변경
    flex: 1,
    alignSelf: 'stretch',
  } as TextStyle,
});

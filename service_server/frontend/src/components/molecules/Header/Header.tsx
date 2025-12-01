import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text, Logo } from '../../atoms';
import { theme } from '../../../styles/theme';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  style?: ViewStyle;
  /** 로고 사용 여부 (title이 "WEATHEREVER"일 때 자동으로 true) */
  useLogo?: boolean;
  /** 로고 크기 */
  logoSize?: 'small' | 'medium' | 'large';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  style,
  useLogo,
  logoSize = 'medium',
}) => {
  // "WEATHEREVER" 타이틀이거나 useLogo가 명시적으로 true인 경우 로고 표시
  const shouldShowLogo = useLogo || title === 'WEATHEREVER';

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.content, 
        shouldShowLogo && !showBackButton && styles.contentCentered
      ]}>
        {showBackButton && (
          <View style={styles.backButton}>
            <Text variant="body" color="azureRadiance" style={styles.backText}>
              ← 홈
            </Text>
          </View>
        )}
        
        <View style={[
          styles.titleContainer,
          shouldShowLogo && styles.titleContainerCentered
        ]}>
          {shouldShowLogo ? (
            <Logo 
              size={logoSize}
              style={styles.logoImage}
              testID="header-logo"
            />
          ) : (
            <Text style={styles.title}>
              {title}
            </Text>
          )}
          
          {subtitle && (
            <Text variant="caption" color="white80" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 상대 위치로 변경
    paddingTop: theme.spacing.lg, // 상단 여백
    paddingBottom: theme.spacing.md, // 하단 여백
    paddingHorizontal: theme.layout.contentPaddingHorizontal, // 47px 좌우 여백
    
    // 피그마: 오토레이아웃
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.base,
  },
  
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.base,
  },
  
  contentCentered: {
    // 로고를 중앙 정렬할 때의 컨테이너 스타일
    justifyContent: 'center',
  },
  
  backButton: {
    // 피그마: Link 컨테이너
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 2,
    width: 37,
    height: 24,
  },
  
  backText: {
    // 피그마: Semantic/Link
    fontFamily: theme.typography.fontFamily,
    fontWeight: '400', // React Native 호환 타입
    fontSize: theme.typography.fontSize.xl, // 17px
    lineHeight: theme.typography.lineHeight.xl, // 20px
    color: theme.colors.azureRadiance,
  } as TextStyle,
  
  titleContainer: {
    // 피그마: Heading 1 컨테이너
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 2,
    paddingBottom: 3,
  },
  
  titleContainerCentered: {
    // 로고를 중앙 정렬할 때의 제목 컨테이너 스타일
    alignItems: 'center',
    flex: 1,
  },
  
  title: {
    // 피그마: Semantic/Heading 1
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600', // React Native 호환 타입
    fontSize: theme.typography.fontSize['2xl'], // 22px
    lineHeight: theme.typography.lineHeight['2xl'], // 26px
    color: theme.colors.white,
  } as TextStyle,
  
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  
  logoImage: {
    // 로고 특별 스타일이 필요한 경우
  },
});

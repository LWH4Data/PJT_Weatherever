/**
 * 폰트 관련 유틸리티
 */

import { theme } from '../styles/theme';

// React Native의 FontWeight 타입
export type FontWeight = 
  | 'normal' 
  | 'bold' 
  | '100' 
  | '200' 
  | '300' 
  | '400' 
  | '500' 
  | '600' 
  | '700' 
  | '800' 
  | '900';

/**
 * 테마의 fontWeight를 React Native FontWeight로 매핑
 */
export const getFontWeight = (weight: keyof typeof theme.typography.fontWeight): FontWeight => {
  const weightMap: Record<keyof typeof theme.typography.fontWeight, FontWeight> = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  };

  return weightMap[weight] || '400';
};

/**
 * 숫자 형태의 fontWeight를 문자열로 변환
 */
export const normalizeFontWeight = (weight: number | string): FontWeight => {
  const weightString = weight.toString();
  
  switch (weightString) {
    case '100': return '100';
    case '200': return '200';
    case '300': return '300';
    case '400': 
    case 'normal': 
    case 'regular': return '400';
    case '500': 
    case 'medium': return '500';
    case '600': 
    case 'semibold': return '600';
    case '700': 
    case 'bold': return '700';
    case '800': return '800';
    case '900': return '900';
    default: return '400';
  }
};

/**
 * 폰트 크기와 가중치를 조합한 스타일 객체 생성
 */
export const createFontStyle = (
  size: keyof typeof theme.typography.fontSize,
  weight: keyof typeof theme.typography.fontWeight = 'regular'
) => ({
  fontSize: theme.typography.fontSize[size],
  fontWeight: getFontWeight(weight),
  fontFamily: theme.typography.fontFamily,
});

/**
 * 텍스트 variant에 따른 기본 스타일 반환
 */
export const getTextVariantStyle = (variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label') => {
  const variantStyles = {
    h1: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: getFontWeight('bold'),
      lineHeight: 28,
    },
    h2: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: getFontWeight('semibold'),
      lineHeight: 26,
    },
    h3: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: getFontWeight('semibold'),
      lineHeight: 22,
    },
    body: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: getFontWeight('regular'),
      lineHeight: 20,
    },
    caption: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: getFontWeight('regular'),
      lineHeight: 18,
    },
    label: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: getFontWeight('medium'),
      lineHeight: 16,
    },
  };

  return {
    ...variantStyles[variant],
    fontFamily: theme.typography.fontFamily,
  };
};

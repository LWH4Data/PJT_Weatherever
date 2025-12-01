import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../../../styles/theme';
import { getFontWeight, getTextVariantStyle, FontWeight } from '../../../utils';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: keyof typeof theme.colors;
  weight?: keyof typeof theme.typography.fontWeight;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'white',
  weight,
  align = 'left',
  numberOfLines,
  style,
}) => {
  const getTextStyle = (): TextStyle => {
    const variantStyle = getTextVariantStyle(variant);
    
    const baseStyle = [
      variantStyle,
      { color: theme.colors[color] },
      { textAlign: align },
    ];

    if (weight) {
      baseStyle.push({ fontWeight: getFontWeight(weight) });
    }

    return StyleSheet.flatten([...baseStyle, style]);
  };

  return (
    <RNText style={getTextStyle()} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  // Typography variants are now handled by fontUtils
  // No additional styles needed as getTextVariantStyle handles everything
});

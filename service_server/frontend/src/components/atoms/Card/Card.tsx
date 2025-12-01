import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../../styles/theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'primary' | 'secondary';
  padding?: keyof typeof theme.spacing;
  borderRadius?: keyof typeof theme.borderRadius;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'base',
  borderRadius = 'base',
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle = [
      styles.card,
      styles[variant],
      { 
        padding: theme.spacing[padding],
        borderRadius: theme.borderRadius[borderRadius]
      }
    ];
    
    return StyleSheet.flatten([...baseStyle, style]);
  };

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base card styles
  },
  
  // Variants
  default: {
    backgroundColor: theme.colors.white10,
    borderWidth: 1,
    borderColor: theme.colors.white20,
  },
  glass: {
    backgroundColor: theme.colors.white10,
    borderWidth: 1,
    borderColor: theme.colors.white20,
    // Note: React Native doesn't support backdrop-filter
  },
  primary: {
    backgroundColor: theme.colors.primary, // Theme primary color
  },
  secondary: {
    backgroundColor: theme.colors.primaryDark, // Theme primary dark color
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)', // 상대적으로 동적 색상이므로 유지
  },
});

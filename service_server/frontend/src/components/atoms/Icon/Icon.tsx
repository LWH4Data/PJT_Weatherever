import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../../styles/theme';

export interface IconProps {
  name: string; // For emoji icons
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: TextStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  style,
}) => {
  const getIconStyle = (): TextStyle => {
    const baseStyle = [styles.icon, styles[size]];
    return StyleSheet.flatten([...baseStyle, style]);
  };

  return (
    <Text style={getIconStyle()}>
      {name}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
  
  // Size variants
  small: {
    fontSize: 16,
    lineHeight: 20,
  },
  medium: {
    fontSize: 20,
    lineHeight: 24,
  },
  large: {
    fontSize: 24,
    lineHeight: 28,
  },
  xlarge: {
    fontSize: 32,
    lineHeight: 36,
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../../styles/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    if (disabled) baseStyle.push(styles.disabledButton);
    return StyleSheet.flatten([...baseStyle, style]);
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
    if (disabled) baseStyle.push(styles.disabledText);
    return StyleSheet.flatten([...baseStyle, textStyle]);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  primaryButton: {
    backgroundColor: theme.colors.azureRadiance,
  },
  secondaryButton: {
    backgroundColor: theme.colors.white10,
    borderWidth: 1,
    borderColor: theme.colors.white20,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 32,
  },
  mediumButton: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.base,
    minHeight: 52,
  },
  
  // Text styles
  text: {
    fontWeight: theme.typography.fontWeight.medium,
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  ghostText: {
    color: theme.colors.azureRadiance,
  },
  
  // Text sizes
  smallText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.base,
  },
  largeText: {
    fontSize: theme.typography.fontSize.md,
  },
  
  // Disabled states
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { TabButtonProps } from '../../../types';

/**
 * 탭 전환을 위한 버튼 원자 컴포넌트
 */
export const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isActive,
  onPress,
  variant = 'weather'
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.container,
    variant === 'weather' ? styles.weatherVariant : styles.trafficVariant,
    isActive ? styles.active : styles.inactive
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}>
        {icon} {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
    minHeight: 50,
  },
  
  weatherVariant: {
    backgroundColor: '#6366f1', // indigo-500
  },
  
  trafficVariant: {
    backgroundColor: '#64748b', // slate-600
  },
  
  active: {
    transform: [{ translateY: 0 }],
    zIndex: 5,
    opacity: 1,
  },
  
  inactive: {
    transform: [{ translateY: 8 }],
    zIndex: 1,
    opacity: 0.6,
  },
  
  text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  activeText: {
    color: 'white',
  },
  
  inactiveText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

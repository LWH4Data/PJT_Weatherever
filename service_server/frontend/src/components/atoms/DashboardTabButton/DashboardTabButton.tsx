import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../Text'; // 상대경로로 직접 import
import { TabButtonProps } from '../../../types/dashboard';

/**
 * 대시보드 탭 버튼 원자 컴포넌트 (북마크 스타일)
 */
export const DashboardTabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isActive,
  onPress,
  variant = 'weather'
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles[variant],
        isActive ? styles.active : styles.inactive
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {typeof icon === 'string' ? (
        <Text style={styles.iconText}>{icon}</Text>
      ) : (
        icon
      )}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  
  weather: {
    backgroundColor: '#6366f1',
    marginRight: 0,
  },
  
  traffic: {
    backgroundColor: '#64748b',
    marginLeft: 0,
  },
  
  active: {
    transform: [{ translateY: 0 }],
    zIndex: 5,
    paddingBottom: 20,
    opacity: 1,
  },
  
  inactive: {
    transform: [{ translateY: 8 }],
    zIndex: 1,
    opacity: 0.6,
    paddingBottom: 15,
  },
  
  iconText: {
    fontSize: 16,
    marginBottom: 4,
  },
  
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});

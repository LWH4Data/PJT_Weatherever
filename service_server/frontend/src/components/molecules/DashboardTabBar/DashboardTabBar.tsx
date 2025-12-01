import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardTabButton } from '../../atoms';
import { DashboardTab } from '../../../types/dashboard';
import { theme } from '../../../styles/theme';

export interface DashboardTabBarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

/**
 * 대시보드 탭바 분자 컴포넌트
 */
export const DashboardTabBar: React.FC<DashboardTabBarProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <View style={styles.container}>
      <DashboardTabButton
        label="날씨 정보"
        icon={<Ionicons name="partly-sunny" size={16} color="white" />}
        isActive={activeTab === 'weather'}
        onPress={() => onTabChange('weather')}
        variant="weather"
      />
      
      <DashboardTabButton
        label="교통 정보"
        icon={<Ionicons name="car" size={16} color="white" />}
        isActive={activeTab === 'traffic'}
        onPress={() => onTabChange('traffic')}
        variant="traffic"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    marginBottom: -15,
    marginHorizontal: theme.layout.contentPaddingHorizontal, // 47px - 다른 페이지와 동일
  },
});

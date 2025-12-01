import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../../atoms';
import { theme } from '../../../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';

export interface TabBarProps {
  activeTab: 'dashboard' | 'main' | 'settings';
  onTabPress: (tab: 'dashboard' | 'main' | 'settings') => void;
  style?: ViewStyle;
}

interface TabItemProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

const TabItem: React.FC<TabItemProps> = ({ label, iconName, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabItem, isActive && styles.activeTabItem]}
    onPress={onPress}
  >
    <View style={styles.iconContainer}>
      <MaterialIcons
        name={iconName}
        size={24}
        color={isActive ? theme.colors.white : theme.colors.manatee}
      />
    </View>
    <Text style={{
      ...styles.tabLabel,
      ...(isActive ? styles.activeTabLabel : {})
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabBarBackground}>
        <View style={styles.tabsContainer}>
          <TabItem
            label="대시보드"
            iconName="public"
            isActive={activeTab === 'dashboard'}
            onPress={() => onTabPress('dashboard')}
          />
          
          <TabItem
            label="메인"
            iconName="home"
            isActive={activeTab === 'main'}
            onPress={() => onTabPress('main')}
          />
          
          <TabItem
            label="설정"
            iconName="settings"
            isActive={activeTab === 'settings'}
            onPress={() => onTabPress('settings')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 하단 고정 위치
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34, // iPhone 안전 영역 고려 (useDeviceLayout과 동일한 고정값)
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  
  tabBarBackground: {
    // 피그마: Overlay+OverlayBlur 스타일
    marginHorizontal: 47, // 좌우 여백
    backgroundColor: theme.colors.white15, // rgba(255, 255, 255, 0.15)
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    

  },
  
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  tabItem: {
    // 피그마: 각 탭 아이템
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  
  activeTabItem: {
    // 피그마: 활성 탭 배경
    backgroundColor: theme.colors.white20, // rgba(255, 255, 255, 0.2)
  },
  
  iconContainer: {
    marginBottom: 4,
  },
  
  iconText: {
    fontSize: 24,
    textAlign: 'center',
  },
  
  tabLabel: {
    fontSize: theme.typography.fontSize.sm, // 12px
    fontWeight: '400', // React Native 호환 타입
    color: theme.colors.manatee, // #8E8E93 (비활성)
    textAlign: 'center',
  } as TextStyle,
  
  activeTabLabel: {
    color: theme.colors.white, // 활성 탭 텍스트
    fontWeight: '500', // React Native 호환 타입
  } as TextStyle,
});

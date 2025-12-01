import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { TabBar } from '../../molecules';
import MainScreen from '../../../screens/MainScreen';
import DashboardScreen from '../../../screens/DashboardScreen';
import SettingScreen from '../../../screens/SettingScreen';
import { theme } from '../../../styles/theme';

type TabType = 'dashboard' | 'main' | 'settings';

export const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('main');

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'main':
        return <MainScreen />;
      case 'settings':
        return <SettingScreen />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 메인 컨텐츠 영역 */}
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>

      {/* 하단 탭바 영역 - 고정된 높이와 배경색 */}
      <View style={styles.tabBarContainer}>
        <TabBar 
          activeTab={activeTab} 
          onTabPress={handleTabPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 60, // 탭바 높이만큼 패딩 추가
  },

  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: theme.spacing.xs,
    height: 60, // 고정된 탭바 높이
    
    // 항상 최상위에 표시되도록 설정
    zIndex: 1000,
    elevation: 5,
  },
});
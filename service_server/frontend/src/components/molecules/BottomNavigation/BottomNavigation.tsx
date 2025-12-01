import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomNavigationProps, NavigationItem } from '../../../types';

/**
 * 하단 네비게이션을 구성하는 분자 컴포넌트
 * 여러 네비게이션 아이템들을 포함
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  onItemPress
}) => {
  const renderNavItem = (item: NavigationItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.navItem, item.isActive ? styles.activeNavItem : null]}
      onPress={() => onItemPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.navIcon}>{item.icon}</Text>
      </View>
      <Text style={[styles.navLabel, item.isActive ? styles.activeNavLabel : styles.inactiveNavLabel]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navItems}>
        {items.map(renderNavItem)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
    backdropFilter: 'blur(10px)',
  },
  
  navItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  navItem: {
    alignItems: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    minWidth: 80,
  },
  
  activeNavItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  navIcon: {
    fontSize: 20,
    textAlign: 'center',
  },
  
  navLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  
  activeNavLabel: {
    color: 'white',
    fontWeight: '600',
  },
  
  inactiveNavLabel: {
    color: '#8E8E93',
    fontWeight: '400',
  },
});

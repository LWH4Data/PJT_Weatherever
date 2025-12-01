import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBarProps } from '../../../types';

/**
 * 모바일 기기의 상태바를 시뮬레이션하는 원자 컴포넌트
 */
export const StatusBar: React.FC<StatusBarProps> = ({ 
  time = '9:41', 
  batteryLevel = 80 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.signalText}>●●●●</Text>
        <Text style={styles.signalText}>📶</Text>
        <Text style={styles.signalText}>📶</Text>
        <View style={styles.battery}>
          <View style={[styles.batteryFill, { width: `${batteryLevel}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 44,
  },
  
  leftSection: {
    flex: 1,
  },
  
  timeText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  
  signalText: {
    fontSize: 16,
    color: 'white',
  },
  
  battery: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  
  batteryFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 1,
  },
});

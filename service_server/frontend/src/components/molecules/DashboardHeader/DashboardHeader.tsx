import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DashboardHeaderProps } from '../../../types';

/**
 * 대시보드 헤더를 구성하는 분자 컴포넌트
 * StatusBar와 제목, 뒤로가기 버튼을 포함
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'WEATHEREVER',
  onBackPress
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
            <Text style={styles.backButton}>← 홈</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  
  backButton: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '400',
  },
  
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
});

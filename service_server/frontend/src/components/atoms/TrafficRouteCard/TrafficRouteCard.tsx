import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { TrafficRouteDisplay, TrafficStatus } from '../../../types';

export interface TrafficRouteCardProps {
  data: TrafficRouteDisplay;
  onPress?: () => void;
}

/**
 * 교통 경로 정보를 표시하는 원자 컴포넌트
 */
export const TrafficRouteCard: React.FC<TrafficRouteCardProps> = ({
  data,
  onPress
}) => {
  const { roadName, direction, distance, estimatedTime, status, averageSpeed } = data;

  const getStatusStyle = (status: TrafficStatus) => {
    switch (status) {
      case 'smooth':
        return { backgroundColor: '#22C55E' };
      case 'moderate':
        return { backgroundColor: '#F59E0B' };
      case 'heavy':
      case 'blocked':
        return { backgroundColor: '#EF4444' };
      default:
        return { backgroundColor: '#64748b' };
    }
  };

  const getStatusText = (status: TrafficStatus) => {
    switch (status) {
      case 'smooth': return '원활';
      case 'moderate': return '보통';
      case 'heavy': return '정체';
      case 'blocked': return '심각';
      default: return '정보 없음';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.statusIndicator, getStatusStyle(status)]} />
      
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{roadName}</Text>
        <Text style={styles.routeDetail}>{direction} ({distance})</Text>
        
        <View style={styles.routeStats}>
          <View style={styles.routeStatItem}>
            <Text style={styles.routeStatIcon}>🚗</Text>
            <Text style={styles.routeStatText}>{getStatusText(status)}</Text>
          </View>
          
          <View style={styles.routeStatItem}>
            <Text style={styles.routeStatIcon}>⚡</Text>
            <Text style={styles.routeStatText}>평균 {averageSpeed}km/h</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.routeTime}>
        <Text style={styles.timeValue}>{estimatedTime}분</Text>
        <Text style={styles.timeLabel}>예상시간</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  routeInfo: {
    flex: 1,
  },
  
  routeName: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    marginBottom: 3,
  },
  
  routeDetail: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  
  routeStats: {
    flexDirection: 'row',
    gap: 10,
  },
  
  routeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  
  routeStatIcon: {
    fontSize: 10,
  },
  
  routeStatText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  routeTime: {
    alignItems: 'flex-end',
    gap: 1,
  },
  
  timeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  
  timeLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

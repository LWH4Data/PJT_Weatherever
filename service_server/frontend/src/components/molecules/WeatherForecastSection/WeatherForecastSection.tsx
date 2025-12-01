import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { WeatherHourCard, LoadingAnimation } from '../../atoms';
import { WeatherForecastSectionProps } from '../../../types';

/**
 * 날씨 예보 섹션을 구성하는 분자 컴포넌트
 * 시간별 날씨 카드들과 헤더를 포함
 */
export const WeatherForecastSection: React.FC<WeatherForecastSectionProps> = ({
  data = [],
  loading = false,
  onRefresh,
  lastUpdated
}) => {
  const [refreshing, setRefreshing] = useState(false);
  // activeCardIndex 제거 - 이펙트 없애기 위해

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[now.getDay()];
    
    return `${month}월 ${date}일 (${dayName})`;
  };

  const getLastUpdateTime = () => {
    if (!lastUpdated) {
      return '데이터 로딩 중...';
    }
    
    const now = new Date();
    const updateTime = new Date(lastUpdated);
    const diffInMs = now.getTime() - updateTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '방금 업데이트';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전 업데이트`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}시간 전 업데이트`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getCurrentDate()}</Text>
        <Text style={styles.updateTime}>{getLastUpdateTime()}</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="rgba(255, 255, 255, 0.7)"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>날씨 데이터 불러오는 중...</Text>
          </View>
        ) : data.length > 0 ? (
          data.map((hourData, index) => (
            <WeatherHourCard
              key={`weather-${index}-${hourData.datetime}`}
              data={hourData}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>날씨 정보를 불러올 수 없습니다</Text>
            <Text style={styles.emptySubText}>새로고침하여 다시 시도해주세요</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    padding: 20,
    margin: 0,
    zIndex: 10,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:20,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  
  updateTime: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  scrollContainer: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  emptyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  emptySubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
});

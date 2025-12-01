import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TrafficRouteCard } from '../../atoms';
import { useTrafficInfo } from '../../../hooks';

/**
 * 교통 정보 섹션을 구성하는 분자 컴포넌트
 * 실제 교통 API를 호출하여 실시간 교통 정보를 표시
 */
export const TrafficInfoSection: React.FC = () => {
  const { routes, updatedTime, loading, error } = useTrafficInfo();

  // 에러 상태 표시
  if (error && !loading && routes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>주요 경로</Text>
          <Text style={styles.updateTime}>연결 실패</Text>
        </View>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>🚧 연결 오류</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>주요 경로</Text>
        <Text style={styles.updateTime}>
          {updatedTime || (loading ? '업데이트 중...' : '데이터 없음')}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {loading && routes.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>교통 정보를 불러오는 중...</Text>
          </View>
        ) : routes.length > 0 ? (
          <View style={styles.routesContainer}>
            {routes.map((route) => (
              <TrafficRouteCard
                key={route.id}
                data={route}
                onPress={() => {}}
              />
            ))}
            
            {/* 마지막 업데이트 정보 */}
            {updatedTime && (
              <View style={styles.updateInfoContainer}>
                <Text style={styles.updateInfoText}>
                  마지막 업데이트: {updatedTime}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>📍 교통정보 없음</Text>
            <Text style={styles.emptyText}>
              현재 주변 교통 정보를 찾을 수 없습니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64748b',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    marginTop: 0,
    // marginBottom: 25,
    marginLeft: 0,
    marginRight: 0,
    zIndex: 10,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  
  updateTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  scrollContainer: {
    flex: 1,
    maxHeight: 580,
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
  
  routesContainer: {
    flex: 1,
  },
  
  updateInfoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  
  updateInfoText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  errorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});

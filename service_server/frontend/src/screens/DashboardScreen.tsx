import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Header, DashboardTabBar, WeatherForecastSection, TrafficInfoSection } from '../components/molecules';
import { useDeviceLayout } from '../hooks';
import { useLocation } from '../hooks';
import { weatherForecastService } from '../services';
import { theme } from '../styles/theme';
import { DashboardTab, HourlyWeatherData } from '../types/dashboard';

export default function DashboardScreen() {
  const { tabBarActualHeight } = useDeviceLayout();
  // 캐시된 위치 정보 가져오기 (권한은 MainScreen에서 이미 처리됨)
  const { location, hasValidLocation, fetchLocation } = useLocation({ autoFetch: true });
  const [activeTab, setActiveTab] = useState<DashboardTab>('weather');
  const [weatherData, setWeatherData] = useState<HourlyWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastWeatherUpdate, setLastWeatherUpdate] = useState<Date | null>(null); // 실제 업데이트 시간 추가
  
  // 샘플 데이터 생성 (API 실패 시 폴백용)
  const generateSampleWeatherData = (): HourlyWeatherData[] => {
    const now = new Date();
    const data: HourlyWeatherData[] = [];
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      const isCurrentHour = i === 0;
      
      let icon = '☀️';
      let description = '맑음';
      let precipitation = 0;
      
      if (hour >= 6 && hour < 12) {
        icon = '🌤️';
        description = '구름조금';
        precipitation = 10;
      } else if (hour >= 12 && hour < 18) {
        icon = '⛅';
        description = '구름많음';
        precipitation = 30;
      } else if (hour >= 18 && hour < 22) {
        icon = '🌧️';
        description = '소나기';
        precipitation = 80;
      }
      
      data.push({
        time: isCurrentHour ? '지금' : time.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        }),
        datetime: time.toISOString(),
        temperature: 22 + Math.floor(Math.random() * 8),
        icon,
        description,
        precipitationProbability: precipitation + Math.floor(Math.random() * 20),
        isCurrentHour,
        skyCondition: 'sunny',
        precipitationType: 'none'
      });
    }
    
    return data;
  };
  
  // 날씨 데이터 로드
  const loadWeatherData = async (lat?: number, lon?: number) => {
    if (!lat || !lon) {
      setError('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`🌍 Loading weather data for location: ${lat}, ${lon}`);
      const data = await weatherForecastService.getWeatherForecast(lat, lon);
      setWeatherData(data);
      setLastWeatherUpdate(new Date());
      console.log(`✅ Weather data loaded: ${data.length} items`);
    } catch (error) {
      console.error('❌ Weather data load failed:', error);
      const errorMessage = error instanceof Error ? error.message : '날씨 정보를 가져오는데 실패했습니다.';
      setError(errorMessage);
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 위치 정보가 사용 가능할 때 날씨 데이터 로드
  useEffect(() => {
    if (hasValidLocation && location) {
      console.log(`🌍 Using cached location: ${location.latitude}, ${location.longitude}`);
      loadWeatherData(location.latitude, location.longitude);
    } else if (!hasValidLocation) {
      console.log('📍 No valid cached location, using sample data');
      loadWeatherData();
    }
  }, [hasValidLocation, location]);
  
  // 컴포넌트 마운트 시 캐시된 위치 데이터 사용 또는 새로 가져오기
  useEffect(() => {
    // autoFetch: true로 설정했으므로 자동으로 실행됨
    // 필요시 수동 새로고침 가능
    if (!hasValidLocation) {
      console.log('🔄 No cached location found, trying to fetch...');
      fetchLocation();
    }
  }, []);
  
  const handleRefresh = async () => {
    if (hasValidLocation && location) {
      await loadWeatherData(location.latitude, location.longitude);
    } else {
      // 위치가 없으면 새로 가져오기 시도
      await fetchLocation();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="WEATHEREVER" />
      
      {/* Tab Bar */}
      <DashboardTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'weather' ? (
          <WeatherForecastSection
            data={weatherData}
            loading={loading}
            onRefresh={handleRefresh}
            lastUpdated={lastWeatherUpdate}
          />
        ) : (
          <TrafficInfoSection
            routes={[]}
            loading={false}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  content: {
    flex: 1,
    marginHorizontal: theme.layout.contentPaddingHorizontal, // 47px - 다른 페이지와 동일
    marginTop: 0,
    marginBottom: 60, // 탭바 높이만큼 패딩 추가
  },
});

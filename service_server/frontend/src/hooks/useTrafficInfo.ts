import { useState, useEffect, useCallback } from 'react';
import { trafficService } from '../services/trafficService';
import { TrafficRouteDisplay } from '../types';

export interface UseTrafficInfoReturn {
  routes: TrafficRouteDisplay[];
  updatedTime: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * 교통정보 데이터 관리를 위한 커스텀 훅 (단순 버전)
 */
export const useTrafficInfo = (): UseTrafficInfoReturn => {
  const [routes, setRoutes] = useState<TrafficRouteDisplay[]>([]);
  const [updatedTime, setUpdatedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 교통정보 데이터 가져오기
   */
  const fetchTrafficInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await trafficService.getTrafficDisplayData();
      setRoutes(data.routes);
      setUpdatedTime(data.updatedTime);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '교통정보를 불러올 수 없습니다';
      setError(errorMessage);
      console.error('교통정보 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 수동 새로고침
   */
  const refresh = useCallback(async () => {
    await fetchTrafficInfo();
  }, [fetchTrafficInfo]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchTrafficInfo();
  }, [fetchTrafficInfo]);

  return {
    routes,
    updatedTime,
    loading,
    error,
    refresh,
  };
};

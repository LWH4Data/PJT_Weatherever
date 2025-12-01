import { config } from '../utils/config';
import { TrafficInfoResponse, TrafficInfoItem, TrafficRouteDisplay, TrafficStatus } from '../types';

/**
 * 교통정보 API 서비스
 * 실시간 교통 데이터를 가져오고 UI에 맞게 변환하는 역할
 */
class TrafficService {
  private readonly baseUrl: string;
  private readonly endpoint = '/traffic-info';

  constructor() {
    this.baseUrl = config.api.baseUrl;
  }

  /**
   * 교통정보 데이터 가져오기
   */
  async getTrafficInfo(): Promise<TrafficInfoResponse> {
    const url = `${this.baseUrl}${this.endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`교통정보 API 오류: ${response.status} ${response.statusText}`);
      }

      const data: TrafficInfoResponse = await response.json();
      return data;
    } catch (error) {
      console.error('교통정보 가져오기 실패:', error);
      throw new Error(
        error instanceof Error 
          ? `교통정보 로드 실패: ${error.message}`
          : '교통정보를 불러올 수 없습니다'
      );
    }
  }

  /**
   * 속도를 기반으로 교통 상태 계산
   */
  private calculateTrafficStatus(speedKph: number): TrafficStatus {
    if (speedKph >= 40) return 'smooth';    // 40km/h 이상: 원활
    if (speedKph >= 25) return 'moderate';  // 25-40km/h: 보통
    if (speedKph >= 15) return 'heavy';     // 15-25km/h: 정체
    return 'blocked';                       // 15km/h 미만: 심각한 정체
  }

  /**
   * 거리를 km 단위로 포맷
   */
  private formatDistance(meters: number): string {
    const km = meters / 1000;
    return km >= 1 ? `${km.toFixed(1)}km` : `${meters.toFixed(0)}m`;
  }

  /**
   * 초를 분 단위로 변환
   */
  private secondsToMinutes(seconds: number): number {
    return Math.round(seconds / 60);
  }

  /**
   * API 응답을 UI 표시용 데이터로 변환
   */
  transformToDisplayData(response: TrafficInfoResponse): TrafficRouteDisplay[] {
    return response.nearbyTrafficInfos.map((item, index) => ({
      id: `traffic-${index}`,
      roadName: item.roadName,
      direction: item.direction,
      distance: this.formatDistance(item.distanceMeters),
      estimatedTime: this.secondsToMinutes(item.durationSeconds),
      status: this.calculateTrafficStatus(item.speedKph),
      averageSpeed: Math.round(item.speedKph),
      durationSeconds: item.durationSeconds,
    }));
  }

  /**
   * 교통정보를 가져와서 UI용 데이터로 변환하는 통합 메서드
   */
  async getTrafficDisplayData(): Promise<{
    routes: TrafficRouteDisplay[];
    updatedTime: string;
  }> {
    const response = await this.getTrafficInfo();
    const routes = this.transformToDisplayData(response);
    
    return {
      routes,
      updatedTime: response.updatedTime,
    };
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const trafficService = new TrafficService();
export default trafficService;

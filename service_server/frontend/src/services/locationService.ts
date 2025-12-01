import * as Location from 'expo-location';
import { NominatimGeocodingService } from './nominatimGeocodingService';
import { getPermissionErrorMessage } from '../utils';

// 성능 측정을 위한 간단한 타이머 클래스
class PerformanceTimer {
  private startTime: number | null = null;
  
  constructor(private label: string) {}
  
  start() {
    this.startTime = performance.now();
  }
  
  end() {
    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      console.log(`⏱️ [${this.label}] 완료: ${duration.toFixed(2)}ms`);
      this.startTime = null;
      return duration;
    }
    return 0;
  }
}

export interface LocationData {
  latitude: number;
  longitude: number;
  district?: string;    // 구/군 (예: 유성구)
  city?: string;        // 시 (예: 대전)
  country?: string;     // 국가 (예: 대한민국)
  fullAddress?: string; // 전체 주소
}

export interface LocationPermissionResult {
  granted: boolean;
  canAskAgain: boolean;
  message?: string;
}

export interface LocationService {
  checkPermission(): Promise<LocationPermissionResult>;
  requestPermission(): Promise<LocationPermissionResult>;
  getCurrentLocation(): Promise<LocationData>;
  isLocationServiceEnabled(): Promise<boolean>;
}

class LocationServiceImpl implements LocationService {
  private geocodingService: NominatimGeocodingService;

  constructor() {
    this.geocodingService = new NominatimGeocodingService();
  }

  /**
   * 현재 위치 권한 상태를 확인합니다.
   */
  async checkPermission(): Promise<LocationPermissionResult> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
        message: this.getPermissionMessage(status)
      };
    } catch (error) {
      console.error('Failed to check location permission:', error);
      return {
        granted: false,
        canAskAgain: false,
        message: '권한 확인 중 오류가 발생했습니다'
      };
    }
  }

  /**
   * 위치 권한을 요청합니다.
   */
  async requestPermission(): Promise<LocationPermissionResult> {
    try {
      // 먼저 현재 권한 상태 확인
      const currentPermission = await this.checkPermission();
      if (currentPermission.granted) {
        return currentPermission;
      }

      // 권한 요청
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
        message: this.getPermissionMessage(status)
      };
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return {
        granted: false,
        canAskAgain: false,
        message: '권한 요청 중 오류가 발생했습니다'
      };
    }
  }

  /**
   * 위치 서비스가 활성화되어 있는지 확인합니다.
   */
  async isLocationServiceEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('Failed to check location service:', error);
      return false;
    }
  }

  /**
   * 현재 위치를 가져옵니다.
   */
  async getCurrentLocation(): Promise<LocationData> {
    // 전체 프로세스 타이머
    const totalTimer = new PerformanceTimer('전체 위치 획득');
    const permissionTimer = new PerformanceTimer('권한 확인');
    const gpsTimer = new PerformanceTimer('GPS 좌표 획득');
    const geocodingTimer = new PerformanceTimer('지오코딩');
    
    totalTimer.start();
    
    try {
      // 1. 위치 서비스 활성화 확인
      const isServiceEnabled = await this.isLocationServiceEnabled();
      if (!isServiceEnabled) {
        throw new Error('위치 서비스가 비활성화되어 있습니다. 설정에서 위치 서비스를 활성화해주세요.');
      }

      // 2. 권한 확인 및 요청
      permissionTimer.start();
      const permissionResult = await this.requestPermission();
      if (!permissionResult.granted) {
        throw new Error(permissionResult.message || '위치 권한이 필요합니다');
      }
      permissionTimer.end();

      // 3. 위치 정보 가져오기
      gpsTimer.start();
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,    // 10초
        distanceInterval: 10,   // 10미터
        mayShowUserSettingsDialog: true, // 설정 다이얼로그 표시 허용
      });

      const { latitude, longitude } = locationResult.coords;
      gpsTimer.end();

      // 4. 주소 정보 가져오기 (Nominatim API 사용)
      geocodingTimer.start();
      let addressInfo: Partial<LocationData> = {};
      
      try {
        addressInfo = await this.geocodingService.reverseGeocode(latitude, longitude);
      } catch (geocodeError) {
        console.warn('Failed to get address from coordinates:', geocodeError);
        // 주소 변환 실패 시 좌표 기반 기본 정보 제공
        addressInfo = this.getFallbackLocationInfo(latitude, longitude);
      }
      geocodingTimer.end();

      const result = {
        latitude,
        longitude,
        ...addressInfo,
      };
      
      totalTimer.end();
      return result;
    } catch (error) {
      totalTimer.end();
      console.error('Failed to get current location:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('위치를 가져올 수 없습니다');
    }
  }

  /**
   * 주소 변환 실패 시 사용할 기본 위치 정보
   */
  private getFallbackLocationInfo(latitude: number, longitude: number): Partial<LocationData> {
    // 한국 영역 내에 있는지 확인
    if (
      latitude >= 33.0 && latitude <= 38.9 &&
      longitude >= 124.0 && longitude <= 132.0
    ) {
      // 대략적인 지역 구분
      let region = '대한민국';
      
      if (latitude >= 37.4 && latitude <= 37.7 && longitude >= 126.7 && longitude <= 127.3) {
        region = '서울특별시';
      } else if (latitude >= 36.2 && latitude <= 36.5 && longitude >= 127.2 && longitude <= 127.6) {
        region = '대전광역시';
      } else if (latitude >= 35.0 && latitude <= 35.4 && longitude >= 128.8 && longitude <= 129.4) {
        region = '부산광역시';
      } else if (latitude >= 35.7 && latitude <= 36.0 && longitude >= 128.4 && longitude <= 129.0) {
        region = '대구광역시';
      }
      
      return {
        city: region,
        country: '대한민국',
        fullAddress: `${region} (위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)})`
      };
    }

    // 한국 외 지역
    return {
      fullAddress: `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
    };
  }

  // getPermissionMessage is now replaced by getPermissionErrorMessage from utils

  /**
   * 권한 상태에 따른 메시지를 반환합니다.
   */
  private getPermissionMessage(status: Location.PermissionStatus): string {
    switch (status) {
      case Location.PermissionStatus.GRANTED:
        return '위치 권한이 허용되었습니다';
      case Location.PermissionStatus.DENIED:
        return '위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.';
      case Location.PermissionStatus.UNDETERMINED:
        return '위치 권한을 요청합니다';
      default:
        return '위치 권한 상태를 확인할 수 없습니다';
    }
  }
}

export const locationService = new LocationServiceImpl();

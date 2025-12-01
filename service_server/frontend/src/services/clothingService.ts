// src/services/clothingService.ts

import { config, API_ENDPOINTS } from '../utils/config';
import type { ClothingRecommendationResponse } from '../types';

/**
 * 의류 추천 API 서비스
 * API: /weather/cloth?id={user_id}&lat={latitude}&lon={longitude}
 * 응답: ClothingRecommendationResponse 객체
 */

export interface ClothingApiParams {
  userId: string;
  latitude: number;
  longitude: number;
}

export class ClothingService {
  private baseUrl: string;

  constructor() {
    // 새로운 config 구조에서 베이스 URL 사용
    this.baseUrl = config.api.baseUrl;
  }

  /**
   * 새로운 의류 추천 API 호출 (확장된 응답 포함)
   */
  async getClothingRecommendationWithAccessories({ userId, latitude, longitude }: ClothingApiParams): Promise<ClothingRecommendationResponse> {
    try {
      // API 엔드포인트 구성(목데이터)
      const lat = '36.3504';
      const lon = '127.3849';
      const url = `${this.baseUrl}${API_ENDPOINTS.CLOTHING}?id=${userId}&lat=${lat}&lon=${lon}`;
      
      // 실제 위치 기반 호출
      // const url = `${this.baseUrl}${API_ENDPOINTS.CLOTHING}?id=${userId}&lat=${latitude}&lon=${longitude}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(config.timeouts.api),
      });

      if (!response.ok) {
        throw new Error(`의류 추천 API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data: ClothingRecommendationResponse = await response.json();
      
      // 응답 데이터 검증
      if (!data.outfit || !['short', 'long', 'outter'].includes(data.outfit)) {
        throw new Error('올바르지 않은 의류 추천 데이터');
      }

      return data;

    } catch (error) {
      // 에러를 상위로 전파
      throw error;
    }
  }

  /**
   * 기존 의류 추천 API 호출 (역호환성을 위해 유지)
   */
  async getClothingRecommendation({ userId, latitude, longitude }: ClothingApiParams): Promise<string> {
    try {
      const data = await this.getClothingRecommendationWithAccessories({ userId, latitude, longitude });
      return data.outfit;
    } catch (error) {
      // 에러를 상위로 전파
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 (다른 서비스들과 동일한 패턴)
export const clothingService = new ClothingService();

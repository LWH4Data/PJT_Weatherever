import { LocationSearchRequest, LocationSearchResponse, LocationSearchResult } from '../types/locationSearch';

/**
 * 위치 검색 서비스
 * Nominatim API를 사용하여 주소/지역명으로 위치를 검색합니다.
 */
export class LocationSearchService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org';
  private readonly defaultParams = {
    format: 'json',
    addressdetails: '1',
    limit: '10',
    countrycodes: 'kr', // 한국으로 제한
    'accept-language': 'ko,en',
  };

  /**
   * 지역명으로 위치를 검색합니다.
   */
  async searchLocation(request: LocationSearchRequest): Promise<LocationSearchResponse> {
    const { query, limit = 10, language = 'ko', countryCode = 'KR' } = request;

    if (!query.trim()) {
      return {
        results: [],
        query,
        totalCount: 0,
      };
    }

    try {
      // URL 파라미터 구성
      const searchParams = new URLSearchParams({
        ...this.defaultParams,
        q: query,
        limit: limit.toString(),
        countrycodes: countryCode.toLowerCase(),
        'accept-language': language === 'ko' ? 'ko,en' : 'en',
      });

      const url = `${this.baseUrl}/search?${searchParams.toString()}`;
      console.log(`🔍 위치 검색 요청: ${query}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'WEATHEREVER/1.0 (Location Search)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Nominatim 응답을 우리 형식으로 변환
      const results = this.transformNominatimResponse(data, query);

      console.log(`✅ 위치 검색 완료: ${results.length}개 결과`);

      return {
        results,
        query,
        totalCount: results.length,
      };

    } catch (error) {
      console.error('위치 검색 실패:', error);
      throw new Error(
        error instanceof Error 
          ? `위치 검색 중 오류가 발생했습니다: ${error.message}` 
          : '위치 검색 중 알 수 없는 오류가 발생했습니다'
      );
    }
  }

  /**
   * Nominatim API 응답을 우리 앱의 LocationSearchResult 형식으로 변환
   */
  private transformNominatimResponse(data: any[], query: string): LocationSearchResult[] {
    return data
      .filter(item => {
        // 유효한 좌표값 확인
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        return !isNaN(lat) && !isNaN(lon);
      })
      .map(item => {
        const address = item.address || {};
        
        // 행정구역 정보 추출
        const district = this.extractDistrict(address);
        const city = this.extractCity(address);
        const country = address.country || '대한민국';

        // 표시명 생성 (가장 구체적인 지역명을 우선)
        const displayName = this.createDisplayName(address, item.display_name);
        
        // 전체 주소 생성
        const fullAddress = this.createFullAddress(address, item.display_name);

        return {
          id: item.place_id?.toString() || `${item.lat}_${item.lon}`,
          displayName,
          fullAddress,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          administrativeInfo: {
            district,
            city,
            country,
          },
        };
      })
      // 중복 제거: displayName과 fullAddress가 같은 결과 제거
      .filter((item, index, array) => {
        return array.findIndex(other => 
          other.displayName === item.displayName && 
          other.fullAddress === item.fullAddress
        ) === index;
      })
      .slice(0, 10); // 최대 10개로 제한
  }

  /**
   * 구/군 정보 추출
   */
  private extractDistrict(address: any): string | undefined {
    return address.borough ||        // 자치구 (예: 강남구)
           address.district ||       // 구 (예: 유성구)
           address.county ||         // 군 (예: 홍천군)
           address.city_district ||  // 시 내 구
           undefined;
  }

  /**
   * 시/도 정보 추출
   */
  private extractCity(address: any): string | undefined {
    return address.city ||           // 시 (예: 대전광역시)
           address.town ||           // 읍 (예: 홍천읍)
           address.municipality ||   // 시/구
           address.state ||          // 도 (예: 강원도)
           address.province ||       // 도
           undefined;
  }

  /**
   * 표시명 생성 (검색 결과에서 보여질 이름)
   */
  private createDisplayName(address: any, displayName: string): string {
    // 우선순위: 동/면/리 > 구/군 > 시/도
    const neighborhood = address.neighbourhood || address.suburb || address.village;
    const district = this.extractDistrict(address);
    const city = this.extractCity(address);

    // 동/면/리와 시/도를 조합하여 구체적인 주소 생성
    if (neighborhood && city) {
      return `${neighborhood}, ${city}`;
    }
    
    // 구/군과 시/도를 조합
    if (district && city) {
      return `${district}, ${city}`;
    }
    
    // 동/면/리만 있는 경우
    if (neighborhood) {
      return neighborhood;
    }
    
    // 구/군만 있는 경우
    if (district) {
      return district;
    }
    
    // 시/도만 있는 경우
    if (city) {
      return city;
    }

    // 마지막으로 display_name에서 첫 번째 부분 사용
    const parts = displayName.split(',');
    return parts[0]?.trim() || displayName;
  }

  /**
   * 전체 주소 생성
   */
  private createFullAddress(address: any, displayName: string): string {
    const parts: string[] = [];

    // 한국 주소 형식: 시/도 구/군 동/면/리 순서
    const city = this.extractCity(address);
    const district = this.extractDistrict(address);
    const neighborhood = address.neighbourhood || address.suburb || address.village;

    if (city) parts.push(city);
    if (district) parts.push(district);
    if (neighborhood) parts.push(neighborhood);

    if (parts.length === 0) {
      // address 정보가 부족한 경우 display_name 사용
      return this.cleanDisplayName(displayName);
    }

    return parts.join(' ');
  }

  /**
   * display_name 정리 (한국어 주소만 남기기)
   */
  private cleanDisplayName(displayName: string): string {
    // 쉼표로 분리된 부분 중 한국어가 포함된 부분만 선택
    const parts = displayName.split(',').map(part => part.trim());
    const koreanParts = parts.filter(part => /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(part));
    
    if (koreanParts.length > 0) {
      return koreanParts.slice(0, 3).join(' '); // 최대 3개 부분만 사용
    }
    
    return parts[0] || displayName;
  }
}

// 싱글톤 인스턴스 생성
export const locationSearchService = new LocationSearchService();

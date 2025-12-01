// Nominatim (OpenStreetMap) API를 사용한 무료 Geocoding 서비스
// API 키 불필요, 단 사용량 제한 있음

interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: string[];
}

export class NominatimGeocodingService {
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private userAgent = 'WeatherFriend/1.0'; // 필수: User-Agent 헤더

  async reverseGeocode(latitude: number, longitude: number): Promise<Partial<LocationData>> {
    try {
      // Nominatim API 호출
      const url = `${this.baseUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ko&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NominatimResponse = await response.json();

      if (!data || !data.address) {
        throw new Error('No address data found');
      }

      const address = data.address;

      // 한국식 주소 구성
      const district = address.city_district || address.suburb || address.neighbourhood;
      const city = address.city || address.county || address.state;
      const country = address.country;

      // 전체 주소 구성 (한국어 순서로)
      const addressParts = [];
      if (district) addressParts.push(district);
      if (city && city !== district) addressParts.push(city);
      if (country) addressParts.push(country);

      return {
        district: district || undefined,
        city: city || undefined,
        country: country || undefined,
        fullAddress: addressParts.length > 0 ? addressParts.join(', ') : data.display_name,
      };
    } catch (error) {
      console.error('Nominatim Geocoding API error:', error);
      throw error;
    }
  }

  /**
   * 사용량 제한을 고려한 지연 처리
   * Nominatim은 1초에 1회 요청 권장
   */
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 여러 좌표를 순차적으로 처리 (사용량 제한 준수)
   */
  async reverseGeocodeMultiple(coordinates: Array<{lat: number, lng: number}>): Promise<Array<Partial<LocationData>>> {
    const results: Array<Partial<LocationData>> = [];

    for (let i = 0; i < coordinates.length; i++) {
      try {
        const coord = coordinates[i];
        const result = await this.reverseGeocode(coord.lat, coord.lng);
        results.push(result);

        // 마지막 요청이 아니면 1초 대기
        if (i < coordinates.length - 1) {
          await this.delay(1000);
        }
      } catch (error) {
        console.error(`Failed to geocode coordinate ${i}:`, error);
        results.push({}); // 빈 결과 추가
      }
    }

    return results;
  }
}

// 사용 예시:
// const geocodingService = new NominatimGeocodingService();
// const addressInfo = await geocodingService.reverseGeocode(latitude, longitude);

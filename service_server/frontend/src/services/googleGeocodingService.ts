// Google Places API를 사용한 Geocoding 서비스
// 사용하려면 Google Cloud Console에서 Places API 활성화 및 API 키 발급 필요

interface GoogleGeocodingResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status: string;
}

export class GoogleGeocodingService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<Partial<LocationData>> {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}&language=ko`;
      
      const response = await fetch(url);
      const data: GoogleGeocodingResponse = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Geocoding API error: ${data.status}`);
      }

      const result = data.results[0];
      const components = result.address_components;

      // 주소 구성요소 파싱
      let district = '';
      let city = '';
      let country = '';

      for (const component of components) {
        const types = component.types;
        
        if (types.includes('sublocality_level_1') || types.includes('administrative_area_level_3')) {
          district = component.long_name;
        } else if (types.includes('administrative_area_level_1') || types.includes('locality')) {
          city = component.long_name;
        } else if (types.includes('country')) {
          country = component.long_name;
        }
      }

      return {
        district: district || undefined,
        city: city || undefined,
        country: country || undefined,
        fullAddress: result.formatted_address,
      };
    } catch (error) {
      console.error('Google Geocoding API error:', error);
      throw error;
    }
  }
}

// 사용 예시:
// const geocodingService = new GoogleGeocodingService('YOUR_API_KEY');
// const addressInfo = await geocodingService.reverseGeocode(latitude, longitude);

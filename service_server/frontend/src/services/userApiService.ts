import { UserApiData, UserApiResponse, PendingUserData } from '../types';
import { config, API_ENDPOINTS } from '../utils/config';

// 서버 응답 형식 정의 (UserResponseDto)
interface ServerUserResponse {
  id: string;
  temperatureSensitivity: string;
  workStartTime: string; // "09:00:00" 형식
  workEndTime: string;   // "18:00:00" 형식
}

export interface UserApiService {
  fetchUserData(userId: string): Promise<UserApiData | null>;
  createUser(userData: { id: string }): Promise<UserApiData>;  // 서버 API 명세에 맞게 변경
  updateUser(userId: string, userData: Partial<UserApiData>): Promise<UserApiData>;
  
  // 편의 메서드들
  updateHeatColdPreference(userId: string, preference: 'hot' | 'normal' | 'cold'): Promise<void>;
  updateWorkTime(userId: string, workTime: { startTime: string; endTime: string }): Promise<void>;
}

class UserApiServiceImpl implements UserApiService {
  private readonly baseUrl = config.api.baseUrl;
  private readonly endpoint = API_ENDPOINTS.USER;
  private readonly timeout = config.timeouts.api;

  /**
   * 서버 응답을 클라이언트 형식으로 변환
   */
  private convertServerResponseToUserApiData(serverData: ServerUserResponse): UserApiData {
    // 시간 형식 변환: "09:00:00" → "09:00"
    const formatTime = (timeString: string): string => {
      if (!timeString) return "09:00";
      return timeString.substring(0, 5); // HH:mm:ss → HH:mm
    };

    return {
      userId: serverData.id,
      heatColdPreference: serverData.temperatureSensitivity as 'hot' | 'normal' | 'cold',
      workTime: {
        startTime: formatTime(serverData.workStartTime),
        endTime: formatTime(serverData.workEndTime)
      },
      createdAt: new Date().toISOString(), // 서버에서 제공하지 않으므로 기본값
      updatedAt: new Date().toISOString()  // 서버에서 제공하지 않으므로 기본값
    };
  }

  /**
   * 사용자 데이터 조회 (GET /user/{user_id})
   * 204 응답 처리 포함
   */
  async fetchUserData(userId: string): Promise<UserApiData | null> {
    const url = `${this.baseUrl}${this.endpoint}/${userId}`;
    
    try {

      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // 204 응답 처리 (사용자 없음)
      if (response.status === 404) {

        return null;
      }
      
      // 다른 에러 응답 처리
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // 200 응답 처리 (사용자 있음)
      const serverResponse: ServerUserResponse = await response.json();
      const convertedData = this.convertServerResponseToUserApiData(serverResponse);
      
      return convertedData;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`요청 시간이 초과되었습니다. (서버 응답 시간: ${this.timeout}ms)`);
      }
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('네트워크 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw error;
    }
  }

  /**
   * 사용자 생성 (POST /user)
   * 서버는 빈 응답을 반환하므로 GET 요청으로 생성된 데이터 조회
   */
  async createUser(userData: { id: string }): Promise<UserApiData> {
    const url = `${this.baseUrl}${this.endpoint}`;
    
    try {

      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');

        throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${errorText}`);
      }
      
      const createdUserData = await this.fetchUserData(userData.id);
      
      if (createdUserData) {
        return createdUserData;
      } else {
        // GET 실패 시 기본값 생성

        return {
          userId: userData.id,
          heatColdPreference: 'normal',
          workTime: { startTime: '09:00', endTime: '18:00' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
    } catch (error) {
      console.error('Failed to create user:', error);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`요청 시간이 초과되었습니다. (서버 응답 시간: ${this.timeout}ms)`);
      }
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('네트워크 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw error;
    }
  }

  /**
   * 사용자 업데이트 (PUT /user/{user_id})
   * 서버는 빈 응답을 반환하므로 GET 요청으로 업데이트된 데이터 조회
   */
  async updateUser(userId: string, userData: Partial<UserApiData>): Promise<UserApiData> {
    const url = `${this.baseUrl}${this.endpoint}/${userId}`;
    
    try {
      const serverUpdateData = this.convertClientDataToServerFormat(userData);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(serverUpdateData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');

        throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${errorText}`);
      }
      
      const updatedUserData = await this.fetchUserData(userId);
      
      if (updatedUserData) {
        return updatedUserData;
      } else {
        throw new Error('업데이트 후 사용자 데이터를 찾을 수 없습니다.');
      }
      
    } catch (error) {
      console.error('Failed to update user:', error);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`요청 시간이 초과되었습니다. (서버 응답 시간: ${this.timeout}ms)`);
      }
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('네트워크 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw error;
    }
  }

  /**
   * 클라이언트 데이터를 서버 형식으로 변환
   */
  private convertClientDataToServerFormat(clientData: Partial<UserApiData>): any {
    const serverData: any = {};
    
    // 필드명 변환
    if (clientData.heatColdPreference !== undefined) {
      serverData.temperatureSensitivity = clientData.heatColdPreference;
    }
    
    // 시간 형식 변환 및 필드 매핑
    if (clientData.workTime) {
      if (clientData.workTime.startTime) {
        // "09:00" → "09:00:00"
        serverData.workStartTime = clientData.workTime.startTime + ':00';
      }
      if (clientData.workTime.endTime) {
        // "18:00" → "18:00:00" 
        serverData.workEndTime = clientData.workTime.endTime + ':00';
      }
    }
    

    return serverData;
  }

  /**
   * 더위/추위 선호도만 업데이트하는 편의 메서드
   */
  async updateHeatColdPreference(
    userId: string, 
    preference: 'hot' | 'normal' | 'cold'
  ): Promise<void> {
    await this.updateUser(userId, { heatColdPreference: preference });
  }

  /**
   * 근무시간만 업데이트하는 편의 메서드
   */
  async updateWorkTime(
    userId: string, 
    workTime: { startTime: string; endTime: string }
  ): Promise<void> {
    await this.updateUser(userId, { workTime });
  }
}

export const userApiService = new UserApiServiceImpl();

import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from './userService';
import { userApiService } from './userApiService';
import { UserApiData, PendingUserData } from '../types';

/**
 * 로컬 UUID 관리 + API 통신을 조합한 통합 사용자 서비스
 * 실패 시 재시도 전략(A 전략) 포함
 */
export interface UserServiceCombined {
  // UUID 관리 (기존 userService 기능)
  getUserId(): Promise<string>;
  generateNewUserId(): Promise<string>;
  clearUserId(): Promise<void>;
  
  // API 통신 (새로운 userApiService 기능)
  fetchUserData(userId: string): Promise<UserApiData | null>;
  createUser(userData: { id: string }): Promise<UserApiData>;  // 서버 API 명세에 맞게 변경
  updateUser(userId: string, userData: Partial<UserApiData>): Promise<UserApiData>;
  
  // 통합 기능 (재시도 전략 포함)
  initializeUserWithApi(): Promise<{ userId: string; userData: UserApiData }>;
  initializeUserSafely(): Promise<{ userId: string; userData: UserApiData }>;
  loadUserSettingsOnly(): Promise<{ userId: string; userData: UserApiData }>;
  savePendingData(userId: string, data: Partial<UserApiData>): Promise<void>;
  retryPendingOperations(): Promise<void>;
  clearPendingData(userId: string): Promise<void>;
}

class UserServiceCombinedImpl implements UserServiceCombined {
  private readonly PENDING_DATA_KEY = 'pendingUserData';

  // ========== UUID 관리 (기존 기능 위임) ==========
  
  /**
   * userId 조회/생성 with POST 요청
   * - 기존 userId 있으면 그대로 사용 (POST 안함)
   * - 없으면 새로 생성 + POST /user 요청
   */
  async getUserId(): Promise<string> {
    try {
      // 1. 기존 userId 확인
      const existingUserId = await AsyncStorage.getItem('userId');
      
      if (existingUserId) {
        // 2. 기존 userId 있으면 그대로 사용 (POST 요청 안함)

        return existingUserId;
      }
      
      // 3. 없으면 새로 생성

      const newUserId = await userService.generateNewUserId();
      
      // 4. POST /user 요청
      try {

        await this.createUser({ id: newUserId });

      } catch (createError) {
        // POST 실패 시 pending으로 저장하고 userId는 반환
        console.error('❌ POST /user 실패, pending 저장:', createError);
        await this.savePendingData(newUserId, {
          userId: newUserId,
          heatColdPreference: 'normal',
          workTime: { startTime: '09:00', endTime: '18:00' }
        });
      }
      
      return newUserId;
      
    } catch (error) {
      console.error('❌ WEATHEREVER - getUserId 전체 실패:', error);
      throw error;
    }
  }

  async generateNewUserId(): Promise<string> {
    return userService.generateNewUserId();
  }

  async clearUserId(): Promise<void> {
    return userService.clearUserId();
  }

  // ========== API 통신 (기존 기능 위임) ==========
  
  async fetchUserData(userId: string): Promise<UserApiData | null> {
    return userApiService.fetchUserData(userId);
  }

  async createUser(userData: { id: string }): Promise<UserApiData> {
    return userApiService.createUser(userData);
  }

  async updateUser(userId: string, userData: Partial<UserApiData>): Promise<UserApiData> {
    return userApiService.updateUser(userId, userData);
  }

  // ========== 통합 기능 (재시도 전략) ==========

  /**
   * 사용자 초기화: UUID 생성/조회 + API 연동
   * 실패 시 pending 데이터로 저장하여 나중에 재시도
   */
  async initializeUserWithApi(): Promise<{ userId: string; userData: UserApiData }> {
    try {
      // 1. UUID 가져오기
      const userId = await this.getUserId();
      
      // 2. 기존 pending 데이터 확인
      const pendingData = await this.getPendingData(userId);
      if (pendingData) {
        console.log('Pending data found, attempting retry...');
        try {
          await this.retryPendingOperations();
        } catch (retryError) {
          console.warn('Retry failed, will continue with pending data:', retryError);
        }
      }
      
      // 3. 서버에서 사용자 데이터 조회
      let userData = await this.fetchUserData(userId);
      
      if (!userData) {
        // 4. 사용자가 없으면 새로 생성
        const defaultUserData = {
          id: userId,  // 서버 API 명세에 맞게 userId 대신 id 사용
        };
        

        
        try {

          userData = await this.createUser(defaultUserData);

          // 성공 시 pending 데이터 클리어
          await this.clearPendingData(userId);
        } catch (createError) {
          console.error('Failed to create user, saving as pending:', createError);
          // 실패 시 pending으로 저장 (기본 설정값 사용)
          const pendingUserData = {
            userId,
            heatColdPreference: 'normal' as const,
            workTime: { startTime: '09:00', endTime: '18:00' },
          };
          await this.savePendingData(userId, pendingUserData);
          // 임시로 기본값 반환 (창자 타입 문제 해결)
          userData = { 
            ...pendingUserData, 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      }
      
      return { userId, userData };
    } catch (error) {
      console.error('User initialization failed:', error);
      throw error;
    }
  }

  /**
   * WEATHEREVER 설정 페이지용 안전한 사용자 데이터 로드
   * GET 요청만 사용하여 기존 사용자 설정 조회
   * POST 요청 없이 GET 실패 시 기본값 사용
   */
  async loadUserSettingsOnly(): Promise<{ userId: string; userData: UserApiData }> {
    try {

      
      // 1. UUID 가져오기
      const userId = await this.getUserId();

      
      // 2. Pending 데이터 재시도 (기존 미완료 작업)
      await this.handlePendingDataRetry(userId);
      
      // 3. GET 요청으로만 사용자 데이터 조회
      try {
        const userData = await this.fetchUserData(userId);
        
        if (userData) {

          return { userId, userData };
        } else {

          // POST 요청 없이 기본값 반환
          const fallbackData = this.createFallbackUserData(userId);
          return { userId, userData: fallbackData };
        }
        
      } catch (fetchError) {
        console.error('❌ GET 요청 실패 - 상세 분석 필요:', fetchError);
        console.log('🔧 GET 요청 실패 원인:');

        
        // GET 실패 시에도 POST 없이 기본값 사용
        const fallbackData = this.createFallbackUserData(userId);
        return { userId, userData: fallbackData };
      }
      
    } catch (error) {
      console.error('❌ WEATHEREVER 설정 로드 전체 실패:', error);
      throw error;
    }
  }

  /**
   * Pending 데이터 재시도 처리
   */
  private async handlePendingDataRetry(userId: string): Promise<void> {
    try {
      const hasPending = await this.hasPendingData(userId);
      
      if (hasPending) {
        console.log('🔄 Pending 데이터 발견, 재시도 중...');
        await this.retryPendingOperations();
      }
    } catch (retryError) {
      console.warn('⚠️ Pending 재시도 실패, 계속 진행:', retryError);
    }
  }

  /**
   * Fallback 사용자 데이터 생성
   */
  private createFallbackUserData(userId: string): UserApiData {
    const now = new Date().toISOString();
    
    return {
      userId,
      heatColdPreference: 'normal',
      workTime: { startTime: '09:00', endTime: '18:00' },
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * 중복 키 에러 감지
   */
  private isDuplicateKeyError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorString = error.toString?.()?.toLowerCase() || '';
    
    return errorMessage.includes('duplicate') ||
           errorMessage.includes('already exists') ||
           errorMessage.includes('primary key') ||
           errorString.includes('duplicate') ||
           (error.status === 500 && errorMessage.includes('constraint'));
  }

  /**
   * 404 에러 감지
   */
  private isNotFoundError(error: any): boolean {
    return error?.status === 404 || error?.message?.includes('404');
  }

  /**
   * Pending 데이터 존재 여부 확인
   */
  private async hasPendingData(userId: string): Promise<boolean> {
    try {
      const pendingData = await this.getPendingData(userId);
      return pendingData !== null;
    } catch (error) {
      console.error('Pending 데이터 확인 실패:', error);
      return false;
    }
  }

  /**
   * API 실패 시 임시 저장 (A 전략)
   */
  async savePendingData(userId: string, data: Partial<UserApiData>): Promise<void> {
    try {
      const pendingData: PendingUserData = {
        userId,
        heatColdPreference: data.heatColdPreference || 'normal',
        workTime: data.workTime || { startTime: '09:00', endTime: '18:00' },
        timestamp: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(
        `${this.PENDING_DATA_KEY}_${userId}`, 
        JSON.stringify(pendingData)
      );
      
      console.log('Pending data saved for user:', userId);
    } catch (error) {
      console.error('Failed to save pending data:', error);
    }
  }

  /**
   * pending 데이터 재시도 (앱 시작 시 또는 네트워크 복구 시)
   */
  async retryPendingOperations(): Promise<void> {
    try {
      const userId = await this.getUserId();
      const pendingData = await this.getPendingData(userId);
      
      if (!pendingData) {
        return; // pending 데이터 없음
      }
      
      console.log('Retrying pending operations for user:', userId);
      
      // 사용자가 이미 존재하는지 확인
      const existingUser = await this.fetchUserData(userId);
      
      if (existingUser) {
        // 기존 사용자가 있으면 업데이트
        await this.updateUser(userId, {
          heatColdPreference: pendingData.heatColdPreference,
          workTime: pendingData.workTime,
        });
      } else {
        // 사용자가 없으면 생성 (서버 API 명세에 맞게 id만 전송)
        await this.createUser({
          id: pendingData.userId,  // 서버 API는 id 필드만 기대
        });
        
        // 사용자 생성 후 설정값 업데이트
        await this.updateUser(pendingData.userId, {
          heatColdPreference: pendingData.heatColdPreference,
          workTime: pendingData.workTime,
        });
      }
      
      // 성공 시 pending 데이터 클리어
      await this.clearPendingData(userId);
      console.log('Pending operations completed successfully');
      
    } catch (error) {
      console.error('Failed to retry pending operations:', error);
      throw error;
    }
  }

  /**
   * pending 데이터 조회
   */
  private async getPendingData(userId: string): Promise<PendingUserData | null> {
    try {
      const data = await AsyncStorage.getItem(`${this.PENDING_DATA_KEY}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get pending data:', error);
      return null;
    }
  }

  /**
   * pending 데이터 클리어
   */
  async clearPendingData(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.PENDING_DATA_KEY}_${userId}`);
      console.log('Pending data cleared for user:', userId);
    } catch (error) {
      console.error('Failed to clear pending data:', error);
    }
  }

  // ========== 편의 메서드들 ==========

  /**
   * 더위/추위 선호도 업데이트 (재시도 전략 포함)
   */
  async updateHeatColdPreference(
    userId: string, 
    preference: 'hot' | 'normal' | 'cold'
  ): Promise<void> {
    try {
      await userApiService.updateHeatColdPreference(userId, preference);
    } catch (error) {
      console.error('Failed to update heat/cold preference, saving as pending:', error);
      await this.savePendingData(userId, { heatColdPreference: preference });
      throw error;
    }
  }

  /**
   * 근무시간 업데이트 (재시도 전략 포함)
   */
  async updateWorkTime(
    userId: string, 
    workTime: { startTime: string; endTime: string }
  ): Promise<void> {
    try {
      await userApiService.updateWorkTime(userId, workTime);
    } catch (error) {
      console.error('Failed to update work time, saving as pending:', error);
      await this.savePendingData(userId, { workTime });
      throw error;
    }
  }
}

export const userServiceCombined = new UserServiceCombinedImpl();

// 기존 코드와의 호환성을 위해 기본 export도 제공
export { userServiceCombined as userService };

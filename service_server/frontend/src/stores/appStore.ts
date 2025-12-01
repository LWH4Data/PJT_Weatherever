import { create } from 'zustand';
import { userServiceCombined as userService, weatherService, clothingService } from '../services';
import { AppState, LocationData, WeatherData, OutfitRecommendation, UserPreferences, ApiDataState, UserApiData, ClothingRecommendationResponse } from '../types';
import { withErrorHandling } from '../utils';

// 의류 타입 정의
export type ClothingType = 'short' | 'long' | 'outter';

interface AppActions {
  // 기존 액션들
  initializeUser: () => Promise<void>;
  fetchWeatherData: (location: LocationData) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setWeatherData: (data: WeatherData) => void;
  setOutfitData: (data: OutfitRecommendation) => void;
  clearError: () => void;
  
  // API 관련 새로운 액션들
  initializeUserWithApi: () => Promise<void>;
  updateApiUserData: (data: Partial<UserApiData>) => Promise<void>;
  syncApiUserData: () => Promise<void>;
  loadApiUserData: () => Promise<void>;
  savePendingChanges: (changes: Partial<UserApiData>) => void;
  clearApiError: () => void;
  
  // 의류 관련 새로운 액션들 (업데이트됨)
  fetchClothingData: (userId: string, location: LocationData) => Promise<void>;
  fetchClothingWithAccessories: (userId: string, location: LocationData) => Promise<void>;
  setClothingType: (clothingType: ClothingType) => void;
  setClothingRecommendation: (recommendation: ClothingRecommendationResponse) => void;
  clearClothingError: () => void;
}

// 기존 기본 설정 (로컬 전용)
const defaultPreferences: UserPreferences = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  locationService: true,
};

// API 데이터 기본값
const defaultApiUserData: ApiDataState = {
  data: null,
  loading: false,
  error: null,
  lastSynced: null,
  pendingChanges: null,
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // Initial state
  userId: null,
  location: null,  // 더 이상 사용하지 않지만 기존 인터페이스 호환성을 위해 유지
  locationError: null,  // 더 이상 사용하지 않지만 기존 인터페이스 호환성을 위해 유지
  weatherData: null,
  outfitData: null,
  userPreferences: defaultPreferences,
  apiUserData: defaultApiUserData,
  
  // 의류 관련 초기 상태
  clothingType: null,
  clothingRecommendation: null,
  clothingLoading: false,
  clothingError: null,
  clothingLastUpdated: null,
  
  loading: false,
  lastUpdated: null,

  // ========== 기존 액션들 (수정됨) ==========

  initializeUser: async () => {
    try {
      set({ loading: true });
      
      const { data, error } = await withErrorHandling(
        () => userService.getUserId(),
        {
          defaultMessage: '사용자 초기화에 실패했습니다',
          context: 'initializeUser'
        }
      );
      
      if (data) {
        set({ userId: data });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchWeatherData: async (location: LocationData) => {
    if (!location) {
      console.warn('Location is required for weather data');
      return;
    }

    try {
      set({ loading: true });
      
      const { data: weatherData, error } = await withErrorHandling(
        () => weatherService.getWeatherData(location),
        {
          defaultMessage: '날씨 정보를 가져오는 데 실패했습니다',
          context: 'fetchWeatherData'
        }
      );
      
      if (weatherData) {
        set({ weatherData, lastUpdated: new Date() });
      }
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateUserPreferences: (preferences: Partial<UserPreferences>) => {
    set((state) => ({
      userPreferences: { ...state.userPreferences, ...preferences }
    }));
    
    // TODO: AsyncStorage에 저장하는 로직 추가
  },

  setWeatherData: (data: WeatherData) => {
    set({ weatherData: data, lastUpdated: new Date() });
  },

  setOutfitData: (data: OutfitRecommendation) => {
    set({ outfitData: data });
  },

  clearError: () => {
    set({ locationError: null });
  },

  // ========== 새로운 API 관련 액션들 ==========

  /**
   * API 연동 사용자 초기화 (통합 서비스 활용)
   */
  initializeUserWithApi: async () => {
    try {
      set((state) => ({
        loading: true,
        apiUserData: { ...state.apiUserData, loading: true, error: null }
      }));
      
      const { userId, userData } = await userService.loadUserSettingsOnly();
      
      set({
        userId,
        apiUserData: {
          data: userData,
          loading: false,
          error: null,
          lastSynced: new Date(),
          pendingChanges: null,
        }
      });
      

    } catch (error) {
      console.error('Failed to initialize user with API:', error);
      
      set((state) => ({
        apiUserData: {
          ...state.apiUserData,
          loading: false,
          error: error instanceof Error ? error.message : '사용자 초기화에 실패했습니다',
        }
      }));
    } finally {
      set({ loading: false });
    }
  },

  /**
   * API 사용자 데이터 업데이트 (통합 서비스 활용)
   */
  updateApiUserData: async (data: Partial<UserApiData>) => {
    const { userId, apiUserData } = get();
    if (!userId || !apiUserData.data) return;

    try {
      set((state) => ({
        apiUserData: { ...state.apiUserData, loading: true }
      }));

      const updatedData = await userService.updateUser(userId, data);
      
      set((state) => ({
        apiUserData: {
          ...state.apiUserData,
          data: updatedData,
          loading: false,
          lastSynced: new Date(),
          pendingChanges: null,
          error: null,
        }
      }));
      

    } catch (error) {
      console.error('API 사용자 데이터 업데이트 실패:', error);
      
      // 실패 시 pending으로 저장 (내장된 재시도 전략)
      set((state) => ({
        apiUserData: {
          ...state.apiUserData,
          loading: false,
          error: 'API 업데이트 실패',
          pendingChanges: { ...state.apiUserData.data, ...data },
        }
      }));
      
      throw error;
    }
  },

  /**
   * 서버에서 최신 데이터 로드 (통합 서비스 활용)
   */
  loadApiUserData: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      set((state) => ({
        apiUserData: { ...state.apiUserData, loading: true, error: null }
      }));

      const userData = await userService.fetchUserData(userId);
      
      if (userData) {
        set((state) => ({
          apiUserData: {
            ...state.apiUserData,
            data: userData,
            loading: false,
            lastSynced: new Date(),
            error: null,
          }
        }));
      } else {
        throw new Error('사용자 데이터를 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('API 데이터 로드 실패:', error);
      set((state) => ({
        apiUserData: {
          ...state.apiUserData,
          loading: false,
          error: error instanceof Error ? error.message : 'API 데이터 로드 실패',
        }
      }));
      
      throw error;
    }
  },

  /**
   * pending 변경사항을 서버에 동기화 (통합 서비스 활용)
   */
  syncApiUserData: async () => {
    const { userId, apiUserData } = get();
    if (!userId || !apiUserData.pendingChanges) return;

    try {
      set((state) => ({
        apiUserData: { ...state.apiUserData, loading: true }
      }));

      const updatedData = await userService.updateUser(userId, apiUserData.pendingChanges);
      
      set((state) => ({
        apiUserData: {
          ...state.apiUserData,
          data: updatedData,
          loading: false,
          lastSynced: new Date(),
          pendingChanges: null,
          error: null,
        }
      }));
      

    } catch (error) {
      console.error('API 동기화 실패:', error);
      set((state) => ({
        apiUserData: {
          ...state.apiUserData,
          loading: false,
          error: error instanceof Error ? error.message : 'API 동기화 실패',
        }
      }));
      
      throw error;
    }
  },

  /**
   * pending 변경사항만 로컬에 저장 (저장 버튼을 누르기 전까지)
   */
  savePendingChanges: (changes: Partial<UserApiData>) => {
    set((state) => ({
      apiUserData: {
        ...state.apiUserData,
        pendingChanges: { ...state.apiUserData.pendingChanges, ...changes },
      }
    }));
  },

  /**
   * API 관련 에러 클리어
   */
  clearApiError: () => {
    set((state) => ({
      apiUserData: { ...state.apiUserData, error: null }
    }));
  },

  // ========== 의류 관련 새로운 액션들 ==========

  /**
   * 기존 의류 추천 데이터 가져오기 (역호환성)
   */
  fetchClothingData: async (userId: string, location: LocationData) => {
    if (!userId || !location) {
      console.warn('UserId 또는 location이 필요합니다');
      return;
    }

    try {
      set({ clothingLoading: true, clothingError: null });
      
      const clothingType = await clothingService.getClothingRecommendation({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      set({ 
        clothingType: clothingType as ClothingType,
        clothingLoading: false,
        clothingLastUpdated: new Date(),
        clothingError: null,
      });
      
    } catch (error) {
      set({ 
        clothingLoading: false,
        clothingError: error instanceof Error ? error.message : '의류 정보를 가져오는 데 실패했습니다',
      });
    }
  },

  /**
   * 새로운 의류+액세서리 추천 데이터 가져오기
   */
  fetchClothingWithAccessories: async (userId: string, location: LocationData) => {
    if (!userId || !location) {
      console.warn('UserId 또는 location이 필요합니다');
      return;
    }

    try {
      set({ clothingLoading: true, clothingError: null });
      
      const recommendation = await clothingService.getClothingRecommendationWithAccessories({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      set({ 
        clothingType: recommendation.outfit,
        clothingRecommendation: recommendation,
        clothingLoading: false,
        clothingLastUpdated: new Date(),
        clothingError: null,
      });
      
    } catch (error) {
      set({ 
        clothingLoading: false,
        clothingError: error instanceof Error ? error.message : '의류+액세서리 정보를 가져오는 데 실패했습니다',
      });
    }
  },

  /**
   * 의류 타입 직접 설정
   */
  setClothingType: (clothingType: ClothingType) => {
    set({ clothingType, clothingLastUpdated: new Date() });
  },

  /**
   * 의류 추천 데이터 직접 설정
   */
  setClothingRecommendation: (recommendation: ClothingRecommendationResponse) => {
    set({ 
      clothingType: recommendation.outfit,
      clothingRecommendation: recommendation,
      clothingLastUpdated: new Date()
    });
  },

  /**
   * 의류 관련 에러 클리어
   */
  clearClothingError: () => {
    set({ clothingError: null });
  },
}));

// ========== 커스텀 훅들 ==========

/**
 * 날씨 관련 기능만 분리한 커스텀 훅
 */
export const useWeatherStore = () => {
  const store = useAppStore();
  
  return {
    weatherData: store.weatherData,
    loading: store.loading,
    lastUpdated: store.lastUpdated,
    fetchWeatherData: store.fetchWeatherData,
    setWeatherData: store.setWeatherData,
  };
};

/**
 * 로컬 사용자 설정 관련 커스텀 훅
 */
export const useUserStore = () => {
  const store = useAppStore();
  
  return {
    userId: store.userId,
    userPreferences: store.userPreferences,
    initializeUser: store.initializeUser,
    updateUserPreferences: store.updateUserPreferences,
  };
};

/**
 * API 사용자 데이터 관련 커스텀 훅
 */
export const useApiUserStore = () => {
  const store = useAppStore();
  
  return {
    apiUserData: store.apiUserData,
    initializeUserWithApi: store.initializeUserWithApi,
    updateApiUserData: store.updateApiUserData,
    loadApiUserData: store.loadApiUserData,
    syncApiUserData: store.syncApiUserData,
    savePendingChanges: store.savePendingChanges,
    clearApiError: store.clearApiError,
  };
};

/**
 * 더위/추위 선호도 전용 커스텀 훅
 */
export const useHeatColdPreferenceStore = () => {
  const store = useAppStore();
  
  return {
    heatColdPreference: store.apiUserData.data?.heatColdPreference || 'normal',
    loading: store.apiUserData.loading,
    error: store.apiUserData.error,
    hasPendingChanges: !!store.apiUserData.pendingChanges,
    updateHeatColdPreference: (preference: 'hot' | 'normal' | 'cold') => {
      store.savePendingChanges({ heatColdPreference: preference });
    },
    saveChanges: store.syncApiUserData,
    loadFromServer: store.loadApiUserData,
  };
};

/**
 * 의류 추천 관련 커스텀 훅
 */
export const useClothingStore = () => {
  const store = useAppStore();
  
  return {
    clothingType: store.clothingType,
    clothingRecommendation: store.clothingRecommendation,
    clothingLoading: store.clothingLoading,
    clothingError: store.clothingError,
    clothingLastUpdated: store.clothingLastUpdated,
    fetchClothingData: store.fetchClothingData,
    fetchClothingWithAccessories: store.fetchClothingWithAccessories,
    setClothingType: store.setClothingType,
    setClothingRecommendation: store.setClothingRecommendation,
    clearClothingError: store.clearClothingError,
  };
};

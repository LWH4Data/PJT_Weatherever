import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OutfitInfo {
  gender: string;
  accessories: string;
  top: string;
  bottom: string;
  shoes: string;
}

interface CharacterState {
  currentOutfit: OutfitInfo | null;
  prepareItems: string[];
  isLoading: boolean;
  lastUpdated: Date | null;
  
  // Actions
  updateOutfit: (outfit: OutfitInfo) => void;
  updatePrepareItems: (items: string[]) => void;
  setLoading: (loading: boolean) => void;
  updateCharacterData: (outfit: OutfitInfo, items: string[]) => void;
  isStale: () => boolean;
  reset: () => void;
}

const initialState = {
  currentOutfit: null,
  prepareItems: [],
  isLoading: false,
  lastUpdated: null,
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      updateOutfit: (outfit: OutfitInfo) => {
        set({
          currentOutfit: outfit,
          lastUpdated: new Date(),
        });
      },
      
      updatePrepareItems: (items: string[]) => {
        set({
          prepareItems: items,
          lastUpdated: new Date(),
        });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      updateCharacterData: (outfit: OutfitInfo, items: string[]) => {
        set({
          currentOutfit: outfit,
          prepareItems: items,
          lastUpdated: new Date(),
          isLoading: false,
        });
      },
      
      isStale: (): boolean => {
        const { lastUpdated } = get();
        if (!lastUpdated) return true;
        
        const now = new Date();
        const thirtyMinutes = 30 * 60 * 1000; // 30분
        return now.getTime() - new Date(lastUpdated).getTime() > thirtyMinutes;
      },
      
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'character-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // lastUpdated는 Date 객체이므로 직렬화 처리
      partialize: (state) => ({
        currentOutfit: state.currentOutfit,
        prepareItems: state.prepareItems,
        lastUpdated: state.lastUpdated ? state.lastUpdated.toISOString() : null,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.lastUpdated && typeof state.lastUpdated === 'string') {
          state.lastUpdated = new Date(state.lastUpdated);
        }
      },
    }
  )
);

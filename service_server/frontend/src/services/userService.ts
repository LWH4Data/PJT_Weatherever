import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface UserService {
  getUserId(): Promise<string>;
  generateNewUserId(): Promise<string>;
  clearUserId(): Promise<void>;
}

class UserServiceImpl implements UserService {
  private readonly USER_ID_KEY = 'userId';

  async getUserId(): Promise<string> {
    try {
      let userId = await AsyncStorage.getItem(this.USER_ID_KEY);
      
      if (!userId) {
        userId = await this.generateNewUserId();
      }
      
      return userId;
    } catch (error) {
      console.error('Failed to get user ID:', error);
      throw new Error('사용자 ID를 가져올 수 없습니다');
    }
  }

  async generateNewUserId(): Promise<string> {
    try {
      const newUserId = uuidv4();
      await AsyncStorage.setItem(this.USER_ID_KEY, newUserId);
      return newUserId;
    } catch (error) {
      console.error('Failed to generate new user ID:', error);
      throw new Error('새 사용자 ID를 생성할 수 없습니다');
    }
  }

  async clearUserId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.USER_ID_KEY);
    } catch (error) {
      console.error('Failed to clear user ID:', error);
      throw new Error('사용자 ID를 삭제할 수 없습니다');
    }
  }
}

export const userService = new UserServiceImpl();

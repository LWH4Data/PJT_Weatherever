import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services';
import { handleError, withErrorHandling } from '../utils';

export interface UseUserIdReturn {
  userId: string | null;
  loading: boolean;
  error: string | null;
  regenerateUserId: () => Promise<void>;
}

export const useUserId = (): UseUserIdReturn => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserId = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await withErrorHandling(
        () => userService.getUserId(),
        {
          defaultMessage: '사용자 ID를 가져올 수 없습니다',
          context: 'loadUserId'
        }
      );
      
      if (data) {
        setUserId(data);
      } else if (error) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const regenerateUserId = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await withErrorHandling(
        () => userService.generateNewUserId(),
        {
          defaultMessage: '새 사용자 ID를 생성할 수 없습니다',
          context: 'regenerateUserId'
        }
      );
      
      if (data) {
        setUserId(data);
      } else if (error) {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserId();
  }, [loadUserId]);

  return {
    userId,
    loading,
    error,
    regenerateUserId,
  };
};

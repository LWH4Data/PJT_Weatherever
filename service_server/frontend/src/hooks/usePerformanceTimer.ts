import { useRef, useCallback } from 'react';

/**
 * Performance 측정을 위한 커스텀 훅
 * @param label - 측정할 작업의 라벨
 */
export const usePerformanceTimer = (label: string) => {
  const startTimeRef = useRef<number | null>(null);
  
  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    console.time(label);
  }, [label]);
  
  const end = useCallback(() => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current;
      console.timeEnd(label);
      console.log(`⏱️ [${label}] 완료: ${duration.toFixed(2)}ms (${(duration / 1000).toFixed(2)}초)`);
      startTimeRef.current = null;
      return duration;
    }
    return 0;
  }, [label]);
  
  const reset = useCallback(() => {
    startTimeRef.current = null;
  }, []);
  
  return { start, end, reset };
};

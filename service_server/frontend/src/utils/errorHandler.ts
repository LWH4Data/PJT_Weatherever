/**
 * 공통 에러 처리 유틸리티
 */

export interface ErrorHandlerOptions {
  defaultMessage?: string;
  logToConsole?: boolean;
  context?: string;
}

/**
 * 에러를 일관된 형태로 처리합니다.
 */
export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): string => {
  const {
    defaultMessage = '알 수 없는 오류가 발생했습니다',
    logToConsole = true,
    context = 'Unknown'
  } = options;

  let errorMessage: string;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = defaultMessage;
  }

  if (logToConsole) {
    console.error(`[${context}] Error:`, error);
  }

  return errorMessage;
};

/**
 * 비동기 작업을 위한 에러 처리 래퍼
 */
export const withErrorHandling = async <T>(
  asyncFunction: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const data = await asyncFunction();
    return { data, error: null };
  } catch (error) {
    const errorMessage = handleError(error, options);
    return { data: null, error: errorMessage };
  }
};

/**
 * 위치 관련 에러 메시지를 사용자 친화적으로 변환
 */
export const getLocationErrorMessage = (error: string): string => {
  if (error.includes('권한')) {
    return '📍 위치 권한을 허용해주세요';
  }
  if (error.includes('서비스')) {
    return '📍 위치 서비스를 활성화해주세요';
  }
  if (error.includes('타임아웃') || error.includes('timeout')) {
    return '📍 위치를 찾는 중입니다. 잠시만 기다려주세요';
  }
  return '📍 위치 정보를 가져올 수 없습니다';
};

/**
 * 권한 관련 에러 메시지 생성
 */
export const getPermissionErrorMessage = (status: string): string => {
  switch (status) {
    case 'granted':
      return '위치 권한이 허용되었습니다';
    case 'denied':
      return '위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.';
    case 'undetermined':
      return '위치 권한을 요청합니다';
    default:
      return '위치 권한 상태를 확인할 수 없습니다';
  }
};

/**
 * 에러 타입별 분류
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  LOCATION: 'LOCATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes];

/**
 * 에러 타입 분류 함수
 */
export const classifyError = (error: string): ErrorType => {
  if (error.includes('권한') || error.includes('permission')) {
    return ErrorTypes.PERMISSION;
  }
  if (error.includes('위치') || error.includes('location')) {
    return ErrorTypes.LOCATION;
  }
  if (error.includes('네트워크') || error.includes('network') || error.includes('fetch')) {
    return ErrorTypes.NETWORK;
  }
  return ErrorTypes.UNKNOWN;
};

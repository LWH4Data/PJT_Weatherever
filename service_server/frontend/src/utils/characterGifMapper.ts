// 의류 타입 정의 (타입 안전성 확보)
export type ClothingType = 'short' | 'long' | 'outter';

// GIF 파일 매핑 객체 (확장성과 유지보수성이 좋음)
const GIF_MAP: Record<ClothingType, any> = {
  short: require('../../assets/gifs/short.gif'),
  long: require('../../assets/gifs/long.gif'),
  outter: require('../../assets/gifs/outter.gif'),
};

/**
 * 의류 타입에 따른 캐릭터 GIF 반환
 * @param clothingType API에서 받은 의류 타입
 * @returns GIF 파일 또는 null (에러/미지원 타입 시)
 */
export const getCharacterGif = (clothingType?: string | null): any => {
  try {
    // 1. 입력값 검증
    if (!clothingType || typeof clothingType !== 'string') {
      console.warn('Invalid clothing type provided:', clothingType);
      return null;
    }

    // 2. 소문자 변환 (API 응답 정규화)
    const normalizedType = clothingType.toLowerCase().trim();

    // 3. 지원되는 타입인지 확인
    if (!isValidClothingType(normalizedType)) {
      console.warn('Unsupported clothing type:', clothingType);
      return null;
    }

    // 4. GIF 파일 반환
    return GIF_MAP[normalizedType as ClothingType];
    
  } catch (error) {
    console.error('Error loading character GIF:', error);
    return null;
  }
};

/**
 * 유효한 의류 타입인지 확인하는 헬퍼 함수
 */
const isValidClothingType = (type: string): type is ClothingType => {
  return ['short', 'long', 'outter'].includes(type);
};

/**
 * 지원되는 모든 의류 타입 반환 (디버깅/테스트용)
 */
export const getSupportedClothingTypes = (): ClothingType[] => {
  return ['short', 'long', 'outter'];
};

/**
 * 기존 테스트 함수 (하위 호환성 유지)
 * @deprecated getCharacterGif를 사용하세요
 */
export const getTestCharacterGif = (): any => {
  try {
    return require('../../assets/gifs/test_character.gif');
  } catch (error) {
    return null;
  }
};


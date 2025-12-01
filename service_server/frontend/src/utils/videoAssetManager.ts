// 테스트용 간단한 동영상 관리
export const TEST_VIDEO_PATH = 'assets/videos/test_character.mp4';

export const validateTestVideo = (): boolean => {
  try {
    require('../../../assets/videos/test_character.mp4');

    return true;
  } catch (error) {
    console.warn('❌ Test video not found: test_character.mp4');
    return false;
  }
};

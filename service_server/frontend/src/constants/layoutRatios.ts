/**
 * WeatherDisplay 레이아웃 비율 상수
 * 각 섹션의 비율을 중앙에서 관리
 */

// 전체 비율 객체 (내부 계산용)
const WEATHER_DISPLAY_RATIOS = {
  weatherInfo: 0.10,
  accessory: 0.10,
  character: 0.80,
};

// 개별 비율 export (각 컴포넌트에서 자신의 비율만 import)
export const WEATHER_INFO_RATIO = WEATHER_DISPLAY_RATIOS.weatherInfo;
export const ACCESSORY_RATIO = WEATHER_DISPLAY_RATIOS.accessory;
export const CHARACTER_RATIO = WEATHER_DISPLAY_RATIOS.character;

// 전체 비율 검증 (개발 시 확인용)
const totalRatio = Object.values(WEATHER_DISPLAY_RATIOS).reduce((sum, ratio) => sum + ratio, 0);
if (totalRatio !== 1.0) {
  console.warn(`WeatherDisplay 비율 합계가 1.0이 아닙니다: ${totalRatio}`);
}

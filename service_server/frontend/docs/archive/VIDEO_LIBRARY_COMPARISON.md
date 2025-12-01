# 🎬 react-native-video → expo-av 변경 가이드

## 🔄 주요 변경사항

### Import 변경
```typescript
// ❌ 기존 (react-native-video)
import Video from 'react-native-video';

// ✅ 변경 (expo-av)
import { Video, ResizeMode } from 'expo-av';
```

### Props 변경
```typescript
// ❌ 기존 (react-native-video)
<Video
  source={videoSource}
  resizeMode="contain"
  repeat={true}
  muted={true}
  playInBackground={false}
  playWhenInactive={false}
  ignoreSilentSwitch="ignore"
/>

// ✅ 변경 (expo-av)  
<Video
  source={videoSource}
  resizeMode={ResizeMode.CONTAIN}
  shouldPlay
  isLooping
  isMuted
/>
```

## 📊 expo-av vs react-native-video 비교

| 기능 | expo-av | react-native-video |
|------|---------|-------------------|
| Expo 호환성 | ✅ 완벽 | ⚠️ 별도 설정 필요 |
| 웹 지원 | ✅ 자동 | ❌ 별도 구현 |
| 설치 복잡도 | ✅ 간단 | ⚠️ 네이티브 링킹 |
| 업데이트 | ✅ Expo와 함께 | ⚠️ 별도 관리 |
| 문서/커뮤니티 | ✅ Expo 공식 | ✅ 활발함 |
| 성능 | ✅ 좋음 | ✅ 매우 좋음 |

## 🎯 우리 프로젝트에 expo-av가 더 적합한 이유

1. **Expo 생태계**: 이미 Expo를 사용 중
2. **간단한 요구사항**: 무한 반복 재생만 필요
3. **호환성**: 버전 충돌 없음  
4. **웹 지원**: 추가 설정 없이 웹에서도 동작
5. **유지보수**: Expo 업데이트와 함께 자동 관리

## ✅ 최종 결과

**사용법은 동일하지만 더 안정적:**
```typescript
<VideoCharacterDisplay 
  width={200} 
  height={300} 
  message="테스트!" 
/>
```

**장점:**
- ✅ 호환성 경고 없음
- ✅ 웹에서도 동작
- ✅ 더 간단한 유지보수
- ✅ Expo 생태계와 완벽 통합

향후 복잡한 비디오 기능이 필요하면 react-native-video로 다시 변경 가능합니다!

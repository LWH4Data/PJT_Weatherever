# 🎬 간단 테스트용 동영상 캐릭터

## ⚡ 빠른 테스트 방법

### 1. 동영상 없이 바로 확인
MainScreen.tsx에서:
```typescript
import { VideoCharacterDisplay } from '../components/organisms';

// characterPlaceholder 부분을 교체:
<VideoCharacterDisplay 
  width={200} 
  height={300} 
  message="테스트!" 
/>
```

### 2. 결과 확인
- **동영상 없음**: "테스트 동영상이 필요합니다" placeholder 표시
- **동영상 있음**: `test_character.mp4` 무한 반복 재생

## 📁 필요한 파일 (선택사항)
```
assets/videos/test_character.mp4
```

## 🎯 핵심 포인트
- ✅ **복잡한 설정 불필요** - 단순히 컴포넌트만 사용
- ✅ **동영상 없어도 동작** - placeholder로 레이아웃 확인 가능  
- ✅ **즉시 테스트 가능** - `npm start` 후 바로 확인
- ✅ **향후 확장 준비됨** - 나중에 복잡한 시스템으로 쉽게 확장

## 🚀 1분 테스트 가이드
1. MainScreen에서 `<VideoCharacterDisplay />` 추가
2. `npm start` 실행
3. placeholder 표시 확인 ✅
4. (선택) test_character.mp4 추가 후 동영상 재생 확인 ✅

**완료!** 🎉

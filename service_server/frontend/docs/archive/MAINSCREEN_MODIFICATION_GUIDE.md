# MainScreen 수정 가이드

## 1. Import 추가
MainScreen.tsx 파일 상단의 import 부분에 추가:

```typescript
// 기존 import들...
import { VideoCharacterDisplay } from '../components/organisms';
```

## 2. CharacterPlaceholder 교체
MainScreen.tsx에서 다음 부분을 찾아서:

```typescript
{/* Character placeholder - 피그마의 image-removebg-preview 1 영역 */}
<View style={[
  styles.characterPlaceholder,
  {
    width: Math.min(200, layout.screenWidth * 0.4),
    height: Math.min(300, weatherCardLayout.contentAreaHeight),
  }
]} />
```

이것을 다음으로 교체:

```typescript
{/* Video Character Display */}
<VideoCharacterDisplay
  width={Math.min(200, layout.screenWidth * 0.4)}
  height={Math.min(300, weatherCardLayout.contentAreaHeight)}
  message="테스트 캐릭터입니다!"
/>
```

## 3. 스타일 정리 (선택사항)
styles.characterPlaceholder는 더 이상 사용하지 않으므로 제거 가능:

```typescript
// 제거해도 됨
characterPlaceholder: {
  // ...
},
```

## 완료!
- `npm start` 실행
- "테스트 동영상이 필요합니다" placeholder 표시 확인
- (선택) `assets/videos/test_character.mp4` 추가 후 동영상 재생 확인

## 전체 수정 내용 요약
1. ✅ Import 1줄 추가
2. ✅ Component 교체 (5줄 → 5줄)
3. ✅ 불필요한 style 제거 (선택)

**3분이면 완료됩니다!** 🚀

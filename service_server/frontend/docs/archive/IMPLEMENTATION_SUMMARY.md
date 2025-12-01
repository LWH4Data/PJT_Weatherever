# 간단한 테스트용 동영상 캐릭터 시스템

## 📁 단순화된 구조

```
src/
├── components/
│   ├── atoms/
│   │   └── VideoCharacter/          # 순수 동영상 재생 컴포넌트
│   ├── molecules/
│   │   └── CharacterWithOutfit/     # 동영상 + 메시지 (단순화됨)
│   └── organisms/
│       └── VideoCharacterDisplay/   # 전체 시스템 (단순화됨)
├── utils/
│   ├── characterVideoMapper.ts      # 테스트 동영상 하나만 반환
│   └── videoAssetManager.ts         # 간단한 검증 기능
└── screens/
    └── USAGE_EXAMPLE.md

assets/
└── videos/
    ├── README.md
    └── test_character.mp4            # 이 파일만 필요!
```

## 🎬 동작 방식

### 1. 동영상이 있는 경우
- `test_character.mp4` 무한 반복 재생
- 메시지 표시 가능

### 2. 동영상이 없는 경우
- Placeholder 표시
- 필요한 파일 경로 안내

## 📱 사용 방법

### MainScreen에서 간단 사용
```typescript
import { VideoCharacterDisplay } from '../components/organisms';

<VideoCharacterDisplay
  width={200}
  height={300}
  message="테스트 중입니다!"
/>
```

### 복잡한 설정 불필요
- 의상 조합 없음
- 상태 관리 불필요
- 단순히 동영상 하나만 재생

## 📋 체크리스트

### 동영상 준비
- [ ] `assets/videos/test_character.mp4` 파일 준비
- [ ] MP4 포맷, 3-5초 길이
- [ ] 무한 반복 가능한 모션

### 코드 통합
- [ ] MainScreen에서 VideoCharacterDisplay 사용
- [ ] 기존 characterPlaceholder 교체

### 테스트
- [ ] `npm start` 실행
- [ ] 동영상 재생 확인
- [ ] placeholder 표시 확인 (동영상 없을 때)

## 🚀 빠른 시작

1. **동영상 없이 바로 테스트**
   ```typescript
   // MainScreen.tsx에 추가
   <VideoCharacterDisplay />
   ```
   → Placeholder가 표시됨

2. **동영상 추가 후 재테스트**
   - `assets/videos/test_character.mp4` 추가
   - 앱 재시작
   → 동영상 재생됨

## 🔧 향후 확장 준비

현재 단순한 구조이지만, 나중에 필요시:
- 복잡한 의상 매핑 시스템 재구현 가능
- Live2D 전환 준비됨
- 상태 관리 시스템 확장 가능

**현재는 단순히 "동영상이 재생되는가?"만 확인하는 용도로 완벽합니다!** ✨

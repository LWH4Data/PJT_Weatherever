# ⚡ 빠른 해결 방법

## 1️⃣ 패키지 재설치 (필수)
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

## 2️⃣ 앱 실행
```bash
npx expo start --clear
```

## 3️⃣ 확인사항
- ✅ 호환성 경고 사라짐
- ✅ VideoCharacterDisplay 정상 동작
- ✅ "테스트 동영상이 필요합니다" placeholder 표시

## 🎯 MainScreen 사용법 (변경 없음)
```typescript
import { VideoCharacterDisplay } from '../components/organisms';

<VideoCharacterDisplay
  width={Math.min(200, layout.screenWidth * 0.4)}
  height={Math.min(300, weatherCardLayout.contentAreaHeight)}
  message="테스트 캐릭터입니다!"
/>
```

**5분이면 완료됩니다!** 🚀

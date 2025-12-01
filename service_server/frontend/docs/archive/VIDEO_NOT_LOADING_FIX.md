# 🎬 동영상 파일이 있는데 placeholder가 표시되는 문제

## 🔍 문제 원인
React Native에서 `require()`는 **번들 타임에 정적으로 처리**되므로:
- 파일 경로가 정확하지 않거나
- Metro bundler가 파일을 인식하지 못할 수 있음

## 🛠️ 해결 방법

### 1️⃣ 동영상 파일을 src 내부로 이동 (추천)

```bash
# 현재: assets/videos/test_character.mp4
# 이동: src/assets/videos/test_character.mp4

mkdir -p src/assets/videos
cp assets/videos/test_character.mp4 src/assets/videos/
```

### 2️⃣ 앱 재시작 및 캐시 클리어

```bash
# Metro bundler 완전 재시작
npx expo start --clear

# 또는
npx expo start -c
```

### 3️⃣ 개발자 도구에서 로그 확인

앱 실행 후 콘솔에서 다음과 같은 로그를 확인:
```
🎬 Loading character video...
📁 Trying path 1: ./assets/videos/test_character.mp4
📁 Trying path 2: ../assets/videos/test_character.mp4
📁 Trying path 3: ../../assets/videos/test_character.mp4
📁 Trying path 4: ../../../assets/videos/test_character.mp4
✅ Success! Video loaded from path X
```

## 🎯 우선 시도할 것

### Step 1: 파일 복사
```bash
# src/assets/videos/ 폴더에 동영상 복사
cp assets/videos/test_character.mp4 src/assets/videos/
```

### Step 2: 캐시 클리어 재시작
```bash
npx expo start --clear
```

### Step 3: 로그 확인
- 개발자 도구 열기
- Console 탭에서 "Loading character video" 로그 확인
- 어떤 경로에서 성공하는지 확인

## 🔧 추가 문제 해결

### Metro 설정 확인
`metro.config.js` 파일에서 asset extensions 확인:
```javascript
module.exports = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'mp4', 'mov', 'avi'],
  },
};
```

### 파일 이름 확인
- 파일명: `test_character.mp4` (정확히 일치해야 함)
- 확장자: `.mp4` (대소문자 구분)
- 특수문자나 공백 없음

## 🚨 긴급 해결법

만약 계속 안 된다면 컴포넌트에서 직접 require:

```typescript
// CharacterWithOutfit.tsx에서 직접 require
const videoSource = require('../../../assets/videos/test_character.mp4');
```

**90% 확률로 Step 1-2만 해도 해결됩니다!** 🎉

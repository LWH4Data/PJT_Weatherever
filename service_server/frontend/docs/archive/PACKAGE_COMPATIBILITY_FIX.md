# 📦 패키지 호환성 문제 해결

## 🔧 수정 내용

### 1. Package.json 수정
- `expo-av`: `16.0.6` → `~15.1.7` (권장 버전)
- `react-native`: `0.79.6` → `0.79.5` (권장 버전)  
- `react-native-video` 제거 (expo-av 사용)

### 2. VideoCharacter 컴포넌트 수정
- `react-native-video` → `expo-av` 변경
- Expo 생태계와 더 나은 호환성

## 🚀 설치 및 실행 명령어

```bash
# 1. 기존 node_modules 삭제
rm -rf node_modules

# 2. 패키지 캐시 정리
npm cache clean --force

# 3. 패키지 재설치
npm install

# 4. Expo 캐시 정리
npx expo start --clear

# 또는 모든 캐시 정리
npx expo start -c
```

## 🎯 Windows에서 실행 (MinGW)

```bash
# 1. node_modules 폴더 삭제
rm -rf node_modules

# 2. 캐시 정리 및 재설치
npm cache clean --force
npm install

# 3. Expo 시작 (캐시 클리어)
npx expo start --clear
```

## ✅ 변경된 VideoCharacter 사용법

expo-av를 사용하도록 변경되었지만 **사용법은 동일**합니다:

```typescript
<VideoCharacterDisplay
  width={200}
  height={300}
  message="테스트 캐릭터입니다!"
/>
```

## 🎬 expo-av 장점

- ✅ Expo 생태계와 완벽 호환
- ✅ 웹에서도 동작
- ✅ 더 안정적인 비디오 재생
- ✅ 호환성 경고 없음

## 📱 테스트 순서

1. **패키지 재설치** 후 호환성 경고 사라짐 확인
2. **앱 실행** 후 VideoCharacterDisplay 동작 확인  
3. **Placeholder 표시** 정상 동작 확인
4. (선택) **test_character.mp4 추가** 후 재생 확인

이제 모든 패키지가 Expo SDK 53과 완벽하게 호환됩니다! ✨

# 🎬 동영상 캐릭터 시스템 설치 및 활성화 가이드

## 📋 현재 구현 상태

✅ **완료된 작업:**
- VideoCharacter (atoms) 컴포넌트 구현
- VideoCharacterDisplay (organisms) 컴포넌트 구현  
- MainScreen에 통합 완료
- characterVideoMapper 단순화
- 테스트용 placeholder UI 구현

⏳ **남은 작업:**
- react-native-video 라이브러리 설치
- 테스트용 동영상 파일 추가
- Video 컴포넌트 활성화

## 🛠 설치 및 활성화 단계

### 1단계: 라이브러리 설치

```bash
# npm 사용 시
npm install react-native-video

# yarn 사용 시  
yarn add react-native-video

# iOS 설정 (iOS 개발 시만 필요)
cd ios && pod install
```

### 2단계: Video 컴포넌트 활성화

`src/components/atoms/VideoCharacter/VideoCharacter.tsx` 파일에서:

```typescript
// 1. import 주석 해제
import Video from 'react-native-video';

// 2. hasVideoLibrary를 true로 변경
const hasVideoLibrary = true; // false에서 true로 변경

// 3. Video 컴포넌트 주석 해제
<Video
  source={videoSource}
  style={styles.video}
  resizeMode={resizeMode}
  repeat={true} // 무한 반복
  muted={true}
  playInBackground={false}
  playWhenInactive={false}
  ignoreSilentSwitch="ignore"
/>
```

### 3단계: 테스트 동영상 추가

`assets/videos/test_character.mp4` 파일을 추가하세요.

**동영상 요구사항:**
- 형식: MP4 (H.264 코덱)
- 해상도: 720p 이하
- 길이: 2-5초 (루프 애니메이션)
- 세로형 비율 권장 (2:3 또는 3:4)

### 4단계: 테스트 실행

1. Metro 서버 재시작: `npx react-native start --reset-cache`
2. 앱 재빌드: `npx react-native run-android` 또는 `npx react-native run-ios`
3. 메인 화면에서 캐릭터 영역 확인

## 🎯 예상 결과

### 현재 상태 (라이브러리 설치 전)
```
🎬
캐릭터 영역
동영상 준비됨
```

### 활성화 후 상태
- 실제 동영상 재생
- 무한 반복 모션
- 음소거 상태로 재생

## 🐛 문제 해결

### 동영상이 재생되지 않는 경우

1. **파일 경로 확인**: `assets/videos/test_character.mp4` 위치 확인
2. **파일 형식 확인**: MP4, H.264 코덱 사용 여부
3. **Metro 캐시 클리어**: `npx react-native start --reset-cache`
4. **앱 재빌드**: 완전히 새로 빌드

### Android에서 동영상 재생 문제

`android/app/src/main/AndroidManifest.xml`에 권한 추가:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### iOS에서 동영상 재생 문제

`ios/Podfile`에서 권한 설정:
```ruby
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-MediaLibrary', :path => "#{permissions_path}/MediaLibrary"
```

## 🔄 추후 Live2D 전환 준비

현재 구조는 Live2D 전환을 고려하여 설계되었습니다:

- **동일한 인터페이스**: Live2D 컴포넌트도 같은 props 구조 사용
- **모듈화 구조**: VideoCharacterDisplay만 교체하면 됨
- **확장성**: characterVideoMapper에서 Live2D 매핑으로 쉽게 전환

## 📞 지원

구현 중 문제가 발생하면:
1. 에러 로그 확인 (`npx react-native log-android` 또는 Xcode 콘솔)
2. 파일 경로 및 권한 확인
3. 라이브러리 버전 호환성 확인

---

**현재 시스템은 완전히 모듈화되어 있어 Live2D 개발과 병렬로 진행 가능합니다!** 🚀

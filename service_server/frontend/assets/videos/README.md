# 📹 동영상 캐릭터 에셋 가이드

## 🎬 필요한 파일

현재 단순 테스트를 위해 다음 파일이 필요합니다:

```
assets/videos/
└── test_character.mp4  # 테스트용 캐릭터 동영상
```

## 📋 동영상 요구사항

### 파일 형식
- **확장자**: `.mp4`
- **코덱**: H.264 (권장)
- **해상도**: 720p 이하 (성능 고려)
- **길이**: 2-5초 (무한 반복 재생)
- **프레임레이트**: 24fps 또는 30fps

### 내용 요구사항
- **캐릭터 모션**: 자연스러운 루프 애니메이션
- **배경**: 투명 또는 단색 배경 권장
- **크기**: 세로형 비율 (2:3 또는 3:4)

## 🛠 설치 필요한 패키지

동영상 재생을 위해 다음 패키지를 설치해야 합니다:

```bash
# React Native Video 설치
npm install react-native-video

# iOS 설정 (iOS만 해당)
cd ios && pod install
```

## 🔧 현재 구현 상태

- ✅ **컴포넌트 구조**: VideoCharacter, VideoCharacterDisplay 완성
- ✅ **메인 화면 통합**: MainScreen에 연동 완료
- ⏳ **라이브러리 설치**: react-native-video 설치 필요
- ⏳ **동영상 파일**: test_character.mp4 파일 추가 필요

## 📱 테스트 방법

1. `test_character.mp4` 파일을 `assets/videos/` 폴더에 추가
2. `react-native-video` 패키지 설치
3. `VideoCharacter.tsx`에서 주석 처리된 Video 컴포넌트 활성화
4. 앱 재실행 후 메인 화면에서 동영상 재생 확인

## 🚀 추후 확장 계획

- [ ] Live2D 연동을 위한 인터페이스 표준화
- [ ] 다양한 의상 조합별 동영상 매핑
- [ ] 동영상 캐싱 및 성능 최적화
- [ ] 백엔드 API 연동 후 동적 캐릭터 변경

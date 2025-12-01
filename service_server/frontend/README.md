# 🌦️ 날씨 앱 프로토타입

React Native/Expo 기반의 위치 기반 날씨 앱으로, 애니메이션 캐릭터가 날씨 정보를 시각적으로 표현합니다.

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start
```

## 📖 주요 기능

- 🎭 **애니메이션 캐릭터**: GIF 기반 캐릭터 시스템
- 📍 **위치 서비스**: 자동 위치 감지 및 주소 변환
- 🌤️ **날씨 정보**: 현재 위치 기반 날씨 표시
- 📱 **반응형 UI**: 다양한 화면 크기 지원

## 🏗️ 아키텍처

```
src/
├── components/           # 모듈화된 컴포넌트
│   ├── atoms/           # 기본 단위 컴포넌트
│   ├── molecules/       # 조합 컴포넌트
│   └── organisms/       # 완성된 UI 블록
├── services/            # 비즈니스 로직
├── hooks/               # 커스텀 훅
└── stores/              # 상태 관리
```

## 📚 개발 가이드

### 통합 개발 가이드
- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - 완전한 개발 가이드 문서

### 주요 섹션
- **아키텍처 및 구조**: 모듈화된 컴포넌트 설계
- **캐릭터 시스템**: GIF 기반 애니메이션 구현
- **위치 서비스**: Expo SDK 49 호환성 문제 해결
- **패키지 관리**: 의존성 최적화 및 호환성 관리
- **문제 해결**: 체계적인 디버깅 가이드
- **빠른 시작**: 5분 완전 설정 가이드

## 🛠️ 기술 스택

- **프레임워크**: React Native + Expo
- **언어**: TypeScript
- **상태 관리**: Zustand
- **위치 서비스**: expo-location + Nominatim API
- **애니메이션**: GIF 이미지 (최적화된 호환성)

## 📋 요구사항

- Node.js 18+
- Expo CLI
- iOS Simulator / Android Emulator (선택)

## 🧪 테스트

```bash
# 앱 실행 후 확인사항
# ✅ 캐릭터 영역에 애니메이션 또는 placeholder 표시
# ✅ 위치 정보 "구, 시, 국가" 형태로 표시
# ✅ 콘솔에 에러 없음
```

## 📁 프로젝트 구조

```
front/
├── PROJECT_GUIDE.md        # 📖 통합 개발 가이드
├── src/                    # 소스 코드
├── assets/                 # 이미지, GIF 등
├── docs/
│   └── archive/           # 🗃️ 이전 가이드 문서들
└── ...
```

## 🐛 문제 해결

문제가 발생하면 다음 순서로 해결하세요:

1. **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md#troubleshooting)** 문제 해결 섹션 참조
2. **캐시 정리**: `npx expo start --clear`
3. **패키지 재설치**: `rm -rf node_modules && npm install`
4. **단계별 진단**: 통합 가이드의 진단 도구 활용

## 📞 지원

- **개발 가이드**: [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)
- **이전 문서들**: [docs/archive/](./docs/archive/)

---

**🎉 완전히 작동하는 날씨 앱 캐릭터 시스템을 경험해보세요!**

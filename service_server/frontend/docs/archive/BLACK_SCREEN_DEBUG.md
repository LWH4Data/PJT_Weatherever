# 🖥️ 검은 화면 문제 해결

## 🔍 가능한 원인들
1. **앱 크래시**: 컴포넌트 에러로 인한 앱 중단
2. **expo-av 문제**: 비디오 라이브러리 충돌
3. **Import 에러**: 모듈 로딩 실패
4. **렌더링 문제**: React 컴포넌트 오류

## 🛠️ 1단계: 기본 렌더링 테스트

**임시로 비디오 기능을 비활성화하고 초록색 테스트 박스로 교체했습니다.**

### 확인할 것:
1. **앱 재시작**: `npx expo start --clear`
2. **초록색 박스 확인**: "캐릭터 컴포넌트 테스트 중..." 표시되는지
3. **콘솔 로그 확인**: "CharacterWithOutfit rendering - SIMPLE VERSION"

## 🎯 결과에 따른 다음 단계

### ✅ 초록색 박스가 보이면
→ **컴포넌트는 정상, 비디오 부분만 문제**
→ expo-av 설정 문제

### ❌ 여전히 검은 화면이면
→ **더 근본적인 문제**
→ MainScreen 전체 문제 또는 앱 크래시

## 🚀 빠른 테스트

```bash
# 1. 캐시 클리어 재시작
npx expo start --clear

# 2. 브라우저 개발자 도구 열기 (F12)
# 3. Console 탭에서 에러 메시지 확인
# 4. 초록색 박스 "캐릭터 컴포넌트 테스트 중..." 확인
```

## 📱 MainScreen 사용법 (변경 없음)
```typescript
<VideoCharacterDisplay
  width={Math.min(200, layout.screenWidth * 0.4)}
  height={Math.min(300, weatherCardLayout.contentAreaHeight)}
  message="테스트 캐릭터입니다!"
/>
```

**결과를 알려주시면 다음 단계로 진행하겠습니다!** 🔧

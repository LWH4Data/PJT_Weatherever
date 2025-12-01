# ⚡ 빠른 해결 방법

## 🎯 1단계: 파일 복사
```bash
# src 안에 assets 폴더 생성 및 파일 복사
mkdir -p src/assets/videos
cp assets/videos/test_character.mp4 src/assets/videos/
```

## 🎯 2단계: 캐시 클리어 재시작
```bash
npx expo start --clear
```

## 🎯 3단계: 로그 확인
개발자 도구(F12) → Console에서 다음 로그 확인:
- `🎬 Loading character video...`
- `✅ Success! Video loaded from path X`

## 🔍 문제가 계속되면
콘솔에서 어떤 경로에서 실패하는지 확인 후:

1. **파일명 정확히 확인**: `test_character.mp4`
2. **파일 크기 확인**: 0KB가 아닌지 확인
3. **확장자 확인**: `.mp4` 맞는지 확인

## 📱 결과 확인
- ✅ **성공**: 동영상 재생
- ❌ **실패**: "src/assets/videos/test_character.mp4" placeholder 표시

**2분이면 해결됩니다!** 🚀

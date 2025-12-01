// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppLayout } from './src/components/templates';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppLayout />
    </SafeAreaProvider>
  );
}

// 이제 AppLayout이 전체 앱의 탭 네비게이션을 관리합니다:
// - TabBar는 하단에 고정되어 있음
// - 각 탭 클릭 시 해당 스크린으로 전환
// - 모든 스크린에서 TabBar 중복 제거됨
// - 피그마 스펙에 맞는 정확한 레이아웃

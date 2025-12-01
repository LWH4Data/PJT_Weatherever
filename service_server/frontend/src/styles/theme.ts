// src/styles/theme.ts
export const theme = {
  colors: {
    background: '#2D2D2D', // Mine Shaft
    white: '#FFFFFF',
    white80: 'rgba(255, 255, 255, 0.8)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white15: 'rgba(255, 255, 255, 0.15)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white5: 'rgba(255, 255, 255, 0.05)',
    manatee: '#8E8E93',
    dropdown: '#1C1C1E',
    azureRadiance: '#007AFF',
    black30: 'rgba(0, 0, 0, 0.3)',
    
    // Card colors (하드코딩 제거)
    primary: '#4A90E2',        // Card primary 색상 (gradient start)
    primaryDark: '#1E3A8A',    // Card secondary/dashboard 색상
    primaryBlue: '#3B82F6',    // Dashboard gradient end
    
    // Status colors
    success: '#28a745',        // 성공 색상
    error: '#dc3545',          // 에러 색상
    warning: '#ffc107',        // 경고 색상
    info: '#17a2b8',           // 정보 색상
    
    // Extended color palette
    blue: '#007AFF',           // azureRadiance alias
    lightBlue: '#87CEEB',      // gradient end color
    purple: '#667EEA',         // settings gradient start
    purpleDark: '#764BA2',     // settings gradient end
  },
  
  gradients: {
    main: 'linear-gradient(141.96deg, #4A90E2 0%, #87CEEB 100%)',
    dashboard: 'linear-gradient(123.14deg, #1E3A8A 0%, #3B82F6 100%)',
    settings: 'linear-gradient(123.47deg, #667EEA 0%, #764BA2 100%)',
  },
  
  typography: {
    fontFamily: 'Roboto',
    fontSize: {
      xs: 11,           // 상태바용
      sm: 12,           // 일반 텍스트
      base: 13,         // 메시지 배너
      md: 14,           // 일반
      lg: 16,           // 온도
      xl: 17,           // 링크
      '2xl': 22,        // 헤더 타이틀
      '3xl': 26,        // 큰 헤더
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      xs: 10,
      sm: 13,
      base: 14,
      md: 15,
      lg: 19,
      xl: 20,
      '2xl': 26,
    },
  },
  
  spacing: {
    xs: 5,
    sm: 10,
    base: 15,
    md: 16,
    lg: 20,
    xl: 25,
    '2xl': 30,
    '3xl': 35,
    '4xl': 40,
  },
  
  borderRadius: {
    xs: 2,
    sm: 12,
    base: 15,
    md: 20,
    lg: 40,
  },
  
  // 상태바 제외한 레이아웃 (전체적으로 위로 이동)
  layout: {
    // 전체 화면
    screenWidth: 440,
    screenHeight: 957,
    screenBorderRadius: 40,
    
    // 메인 레이아웃 (상태바 제외)
    contentPaddingHorizontal: 47,
    headerTop: 60,        // 60px
    headerHeight: 71,
    
    // 메시지 배너 (상태바 제외 후 재계산)
    messageBannerTop: 111,  // headerTop(20) + headerHeight(71) + gap(20) = 111
    messageBannerHeight: 49,
    messageBannerSide: 47,
    
    // 날씨 카드 (상태바 제외 후 재계산)
    weatherCardTop: 179,    // headerTop(20) + headerHeight(71) + messageBannerHeight(49) + gaps(39) = 179
    weatherCardHeight: 587,
    weatherCardSide: 47,
    
    // 탭바 (하단은 그대로)
    tabBarHeight: 96,
    tabBarBottom: 47,
    tabBarSide: 47,
    
    // 개발 정보
    devInfoBottom: 100,
  },
  
  shadows: {
    main: '0px 20px 40px rgba(0, 0, 0, 0.5)',
  },
};

export type Theme = typeof theme;

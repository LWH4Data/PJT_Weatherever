import React from 'react';
import { View, StyleSheet, ViewStyle, Keyboard } from 'react-native';
import { LocationSearchBar, LocationSearchDropdown } from '../../atoms';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { theme } from '../../../styles/theme';
import type { LocationData } from '../../../types';

export interface LocationSearchInputProps {
  /** 위치 선택 시 콜백 */
  onLocationSelect?: (location: LocationData) => void;
  /** 커스텀 스타일 */
  style?: ViewStyle;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 최대 검색 결과 수 */
  maxResults?: number;
  /** 자동 검색 여부 */
  autoSearch?: boolean;
  /** 검색 디바운스 시간 (ms) */
  debounceMs?: number;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  onLocationSelect,
  style,
  placeholder,
  maxResults = 8,
  autoSearch = true,
  debounceMs = 300,
}) => {
  // 위치 검색 훅
  const {
    state,
    setQuery,
    search,
    selectLocation,
    setFocused,
    clearSearch,
    clearError,
  } = useLocationSearch({
    maxResults,
    autoSearch,
    debounceMs,
    onLocationSelect,
  });

  // 검색어 변경 처리
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (state.error) {
      clearError();
    }
  };

  // 수동 검색 실행
  const handleSearch = () => {
    if (state.query.trim()) {
      search();
    }
  };

  // 검색어 지우기
  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  // 포커스 상태 변경
  const handleFocusChange = (focused: boolean) => {
    setFocused(focused);
  };

  // 위치 선택 처리
  const handleLocationSelect = (result: any) => {
    const label = result.displayName ?? result.fullAddress ?? '';

    // 1) 입력창에 즉시 반영
    setQuery(label);

    // 2) 좌표 변환 + 저장 (훅 내부에서 onLocationSelect 호출)
    selectLocation(result);

    // 3) 훅이 query를 리셋하는 경우 대비: 마지막에 다시 한 번 덮어쓰기
    requestAnimationFrame(() => setQuery(label));

    // 4) 드롭다운 닫기 + 키보드 내리기
    setFocused(false);
    Keyboard.dismiss();
  };


  // 드롭다운 표시 조건
  const shouldShowDropdown = state.isFocused && 
    (state.isSearching || state.results.length > 0 || state.error);

  return (
    <View style={[styles.container, style]}>
      {/* 검색 입력창 */}
      <LocationSearchBar
        value={state.query}
        onChangeText={handleQueryChange}
        onSearch={handleSearch}
        onClear={handleClear}
        isFocused={state.isFocused}
        onFocusChange={handleFocusChange}
        isLoading={state.isSearching}
        placeholder={placeholder}
      />

      {/* 검색 결과 드롭다운 */}
      <LocationSearchDropdown
        visible={shouldShowDropdown}
        results={state.results}
        onSelectResult={handleLocationSelect}
        isLoading={state.isSearching}
        error={state.error}
        maxHeight={280} // 모바일에 적절한 높이
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 상대 위치로 설정하여 드롭다운이 다른 요소를 덮지 않도록
    position: 'relative',
    zIndex: 1001, // 다른 요소 위에 표시
  },
});

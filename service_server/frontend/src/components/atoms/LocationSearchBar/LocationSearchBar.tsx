import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Icon } from '../Icon';
import { theme } from '../../../styles/theme';

export interface LocationSearchBarProps extends Omit<TextInputProps, 'style'> {
  /** 검색어 값 */
  value: string;
  /** 검색어 변경 콜백 */
  onChangeText: (text: string) => void;
  /** 검색 실행 콜백 */
  onSearch?: () => void;
  /** 검색어 지우기 콜백 */
  onClear?: () => void;
  /** 포커스 상태 */
  isFocused?: boolean;
  /** 포커스 변경 콜백 */
  onFocusChange?: (focused: boolean) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 커스텀 스타일 */
  style?: ViewStyle;
  /** placeholder 텍스트 */
  placeholder?: string;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  onClear,
  isFocused = false,
  onFocusChange,
  isLoading = false,
  style,
  placeholder = "지역을 검색하세요 (예: 학하동)",
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, isFocused && styles.containerFocused, style]}>
      {/* 검색 아이콘 */}
      <TouchableOpacity
        style={styles.searchIcon}
        onPress={onSearch}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <Icon
          name={isLoading ? "🔄" : "🔍"}
          size="medium"
        />
      </TouchableOpacity>

      {/* 검색 입력창 */}
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="search"
        onSubmitEditing={onSearch}
        autoCorrect={false}
        autoCapitalize="none"
        {...textInputProps}
      />

      {/* 지우기 버튼 */}
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearIcon}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <Icon
            name="❌"
            size="medium"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 더 진한 배경색
    borderRadius: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.white20,
    minHeight: 48, // 터치 친화적인 최소 높이
  },

  containerFocused: {
    borderColor: theme.colors.azureRadiance,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 선택된 상태에서 더 진한 배경색
  },

  searchIcon: {
    marginRight: theme.spacing.sm,
    padding: theme.spacing.xs, // 터치 영역 확대
  },

  textInput: {
    flex: 1,
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily,
    paddingVertical: 0, // Android에서 기본 패딩 제거
  },

  clearIcon: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs, // 터치 영역 확대
  },
});

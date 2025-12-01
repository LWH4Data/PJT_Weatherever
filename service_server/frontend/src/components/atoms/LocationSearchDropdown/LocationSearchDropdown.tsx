import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { theme } from '../../../styles/theme';
import type { LocationSearchResult } from '../../../types';

export interface LocationSearchDropdownProps {
  /** 검색 결과 목록 */
  results: LocationSearchResult[];
  /** 결과 선택 콜백 */
  onSelectResult: (result: LocationSearchResult) => void;
  /** 표시 여부 */
  visible?: boolean;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 에러 메시지 */
  error?: string | null;
  /** 최대 높이 */
  maxHeight?: number;
  /** 커스텀 스타일 */
  style?: ViewStyle;
}

export const LocationSearchDropdown: React.FC<LocationSearchDropdownProps> = ({
  results,
  onSelectResult,
  visible = true,
  isLoading = false,
  error = null,
  maxHeight = 250,
  style,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, { maxHeight }, style]}>
      {/* 로딩 상태 */}
      {isLoading && (
        <View style={styles.statusContainer}>
          <Icon name="loader" size={16} color={theme.colors.white60} />
          <Text variant="body" color="white60" style={styles.statusText}>
            위치를 검색하는 중...
          </Text>
        </View>
      )}

      {/* 에러 상태 */}
      {error && !isLoading && (
        <View style={styles.statusContainer}>
          <Icon name="alert-circle" size={16} color={theme.colors.error} />
          <Text variant="body" color="error" style={styles.statusText}>
            {error}
          </Text>
        </View>
      )}

      {/* 검색 결과가 없는 경우 */}
      {!isLoading && !error && results.length === 0 && (
        <View style={styles.statusContainer}>
          <Icon name="map-pin" size={16} color={theme.colors.white40} />
          <Text variant="body" color="white40" style={styles.statusText}>
            검색 결과가 없습니다
          </Text>
        </View>
      )}

      {/* 검색 결과 목록 */}
      {!isLoading && !error && results.length > 0 && (
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {results.map((result, index) => (
            <LocationResultItem
              key={result.id}
              result={result}
              onPress={() => onSelectResult(result)}
              isLast={index === results.length - 1}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

interface LocationResultItemProps {
  result: LocationSearchResult;
  onPress: () => void;
  isLast: boolean;
}

const LocationResultItem: React.FC<LocationResultItemProps> = ({
  result,
  onPress,
  isLast,
}) => {
  return (
    <TouchableOpacity
      style={[styles.resultItem, !isLast && styles.resultItemWithBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.resultContent}>
        <Icon name="map-pin" size={16} color={theme.colors.azureRadiance} />
        <View style={styles.resultTextContainer}>
          <Text variant="body" color="white" style={styles.displayName}>
            {result.displayName}
          </Text>
          <Text variant="caption" color="white60" style={styles.fullAddress}>
            {result.fullAddress}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%', // 검색창 바로 아래에 위치
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // 거의 불투명한 검정색
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.white20,
    marginTop: theme.spacing.xs,
    overflow: 'hidden',
    zIndex: 1003, // 검색바보다 높은 zIndex

  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    justifyContent: 'center',
  },

  statusText: {
    marginLeft: theme.spacing.sm,
  },

  scrollView: {
    flex: 1,
  },

  resultItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 56, // 터치 친화적인 최소 높이
  },

  resultItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.white10,
  },

  resultContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },

  resultTextContainer: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },

  displayName: {
    fontWeight: '500',
  },

  fullAddress: {
    marginTop: theme.spacing.xs / 2,
  },
});

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { Text } from '../Text';
import { Button } from '../Button';
import { theme } from '../../../styles/theme';

export interface LocationPermissionModalProps {
  visible: boolean;
  onRequestPermission: () => void;
  onClose: () => void;
  onOpenSettings?: () => void;
  canAskAgain?: boolean;
  style?: ViewStyle;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  visible,
  onRequestPermission,
  onClose,
  onOpenSettings,
  canAskAgain = true,
  style,
}) => {
  const handleBackdropPress = () => {
    onClose();
  };

  const handlePermissionPress = () => {
    if (canAskAgain) {
      onRequestPermission();
    } else {
      // 재요청 불가능한 경우 시스템 설정으로 이동
      if (onOpenSettings) {
        onOpenSettings();
      }
    }
    // 모달 닫기 (버튼 클릭 후 자동)
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, style]}>
              {/* Header */}
              <View style={styles.header}>
                <Text variant="h3" color="white" style={styles.title}>
                  📍 위치 권한 필요
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text variant="body" color="white60">
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text variant="body" color="white80" style={styles.description}>
                  정확한 날씨 정보와 개인화된 의류 추천을 위해 위치 정보가 필요합니다.
                </Text>
                
                <View style={styles.featureList}>
                  <View style={styles.featureItem}>
                    <Text variant="body" color="white60">
                      🌤️ 현재 위치 기반 날씨 정보
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text variant="body" color="white60">
                      👕 개인화된 의류 추천
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text variant="body" color="white60">
                      ⏰ 시간대별 날씨 알림
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Button
                  title="나중에"
                  variant="secondary"
                  onPress={onClose}
                  style={styles.cancelButton}
                />
                
                <Button
                  title={canAskAgain ? '권한 허용' : '설정 열기'}
                  variant="primary"
                  onPress={handlePermissionPress}
                  style={styles.confirmButton}
                />
              </View>

              {!canAskAgain && (
                <Text variant="label" color="warning" style={styles.settingsHint}>
                  설정 {'>'} 개인정보 보호 {'>'} 위치 서비스에서 권한을 허용해주세요
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    zIndex: 9999,
  },
  
  modalContainer: {
    backgroundColor: theme.colors.background, // 앱과 동일한 배경색 (#2D2D2D)
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
    zIndex: 10000,
    
    // 테두리 효과 (더 명확하게)
    borderWidth: 1,
    borderColor: theme.colors.white20,
    
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  title: {
    flex: 1,
  },
  
  closeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  
  content: {
    marginBottom: theme.spacing.lg,
  },
  
  description: {
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  
  featureList: {
    gap: theme.spacing.xs,
  },
  
  featureItem: {
    paddingVertical: theme.spacing.xs,
  },
  
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  
  cancelButton: {
    flex: 1,
  },
  
  confirmButton: {
    flex: 2,
  },
  
  settingsHint: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
});

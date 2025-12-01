import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { theme } from '../../../styles/theme';

export interface InfoModalProps {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  title,
  description,
  onClose,
}) => {
  const screenHeight = Dimensions.get('window').height;
  const maxModalHeight = screenHeight * 0.8;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[styles.modalContainer, { maxHeight: maxModalHeight }]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text variant="h3" color="white" weight="bold">
              {title}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="✕" size="medium" style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text variant="body" color="white80" style={styles.description}>
              {description}
            </Text>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.base,
  },
  
  closeButton: {
    padding: theme.spacing.xs,
  },
  
  closeIcon: {
    color: theme.colors.white60,
  },
  
  contentContainer: {
    maxHeight: 300,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.lg,
  },
  
  description: {
    lineHeight: 24,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Card, Text, Icon, InfoModal } from '../../atoms';
import { SettingItem, SettingItemProps } from '../../molecules';
import { theme } from '../../../styles/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface SettingsSectionProps {
  title: string;
  infoText?: string; // 섹션 제목 옆 정보 아이콘 클릭 시 표시할 설명
  items: Omit<SettingItemProps, 'style'>[];
  style?: ViewStyle;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  infoText,
  items,
  style,
}) => {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  return (
    <View style={[styles.section, style]}>
      <View style={styles.titleContainer}>
        <Text variant="h3" style={styles.sectionTitle}>
          {title}
        </Text>
        {infoText && (
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setIsInfoModalVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="information-circle-outline" size={24} color="white" />

          </TouchableOpacity>
        )}
      </View>
      
      <Card variant="glass" padding="xs">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <SettingItem {...item} />
            {index < items.length - 1 && (
              <View style={styles.separator} />
            )}
          </React.Fragment>
        ))}
      </Card>
      
      {/* Info Modal */}
      {infoText && (
        <InfoModal
          visible={isInfoModalVisible}
          title={title}
          description={infoText}
          onClose={() => setIsInfoModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.white,
  },
  
  infoButton: {
    padding: 4,
  },
  
  infoIcon: {
    color: theme.colors.azureRadiance,
  },
  
  separator: {
    height: 1,
    backgroundColor: theme.colors.white10,
    marginHorizontal: theme.spacing.base,
  },
});

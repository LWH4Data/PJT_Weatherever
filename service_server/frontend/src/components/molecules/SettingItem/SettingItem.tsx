import React from 'react';
import { View, TouchableOpacity, Switch, StyleSheet, ViewStyle } from 'react-native';
import { Text, Icon, Dropdown, DropdownOption } from '../../atoms';
import { theme } from '../../../styles/theme';

export interface SettingItemProps {
  icon: string;
  title: string;
  description?: string;
  type: 'switch' | 'navigation' | 'custom' | 'dropdown';
  value?: any;
  onPress?: () => void;
  onValueChange?: (value: any) => void;
  rightContent?: React.ReactNode;
  
  // dropdown 전용 속성들
  options?: DropdownOption[];
  dropdownWidth?: number | string;
  
  style?: ViewStyle;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  type,
  value,
  onPress,
  onValueChange,
  rightContent,
  options = [],
  dropdownWidth = 120,
  style,
}) => {
  const renderRightContent = () => {
    if (rightContent) return rightContent;
    
    switch (type) {
      case 'switch':
        return (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#767577', true: theme.colors.azureRadiance }}
            thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
          />
        );
        
      case 'navigation':
        return (
          <Text variant="body" color="azureRadiance" weight="medium">
            {value} →
          </Text>
        );
        
      case 'dropdown':
        return (
          <Dropdown
            options={options}
            selectedValue={value}
            onValueChange={onValueChange || (() => {})}
            width={dropdownWidth}
          />
        );
        
      default:
        return null;
    }
  };

  const Container = (type === 'switch' || type === 'dropdown') ? View : TouchableOpacity;

  return (
    <Container
      style={[styles.container, style]}
      onPress={(type !== 'switch' && type !== 'dropdown') ? onPress : undefined}
    >
      <View style={styles.leftContent}>
        <Icon name={icon} size="medium" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text variant="body" weight="medium">
            {title}
          </Text>
          {description && (
            <Text variant="caption" color="white80" style={styles.description}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {renderRightContent()}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    marginTop: 2,
  },
});

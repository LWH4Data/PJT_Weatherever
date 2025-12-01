import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../../../styles/theme';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: number | string;
  dropdownStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  selectedStyle?: ViewStyle;
  maxHeight?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select option',
  disabled = false,
  width = 120,
  dropdownStyle,
  optionStyle,
  selectedStyle,
  maxHeight = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const openDropdown = () => {
    if (disabled) return;
    
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPosition({
        top: y + height + 5,
        left: x,
        width: width,
      });
      setIsVisible(true);
      
      // 애니메이션 시작
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const selectOption = (value: string) => {
    onValueChange(value);
    closeDropdown();
  };

  const screenHeight = Dimensions.get('window').height;
  const adjustedTop = dropdownPosition.top + maxHeight > screenHeight 
    ? dropdownPosition.top - maxHeight - 50 // 위쪽으로 표시
    : dropdownPosition.top;

  return (
    <>
      {/* 드롭다운 버튼 */}
      <TouchableOpacity
        ref={buttonRef}
        style={[
          styles.dropdownButton,
          { width },
          disabled && styles.disabled,
          dropdownStyle,
        ]}
        onPress={openDropdown}
        disabled={disabled}
      >
        <Text 
          style={[
            styles.buttonText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Ionicons
          name={isVisible ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={disabled ? theme.colors.white40 : theme.colors.white80}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* 드롭다운 모달 */}
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <Animated.View
            style={[
              styles.dropdownContainer,
              {
                top: adjustedTop,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <ScrollView
              style={styles.optionsContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {options.map((option, index) => {
                const isSelected = option.value === selectedValue;
                
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && styles.selectedOption,
                      isSelected && selectedStyle,
                      index === 0 && styles.firstOption,
                      index === options.length - 1 && styles.lastOption,
                      optionStyle,
                    ]}
                    onPress={() => selectOption(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.colors.azureRadiance}
                        style={styles.checkmark}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.white10,
    borderWidth: 1,
    borderColor: theme.colors.white20,
    borderRadius: 8,
    minHeight: 36,
  },
  
  buttonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily,
  },
  
  chevron: {
    marginLeft: 8,
  },
  
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.white05,
  },
  
  disabledText: {
    color: theme.colors.white40,
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: theme.colors.dropdown,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.white20,
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.3)',
    elevation: 8,
    overflow: 'hidden',
  },
  
  optionsContainer: {
    maxHeight: 200,
  },
  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  
  firstOption: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  
  lastOption: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  
  selectedOption: {
    backgroundColor: theme.colors.azureRadiance + '20', // 20% opacity
  },
  
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily,
  },
  
  selectedOptionText: {
    fontWeight: '600',
    color: theme.colors.azureRadiance,
  },
  
  checkmark: {
    marginLeft: 8,
  },
});
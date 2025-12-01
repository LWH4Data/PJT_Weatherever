import React, { useState } from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { Text } from '../Text';
import { theme } from '../../../styles/theme';

export interface TimePickerProps {
  value: string; // "HH:mm" 형식
  onTimeChange: (time: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onTimeChange,
  placeholder = "시간 선택",
  style,
  disabled = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    value ? parseInt(value.split(':')[0]) : 9
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? parseInt(value.split(':')[1]) : 0
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ..., 55

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    const timeString = formatTime(selectedHour, selectedMinute);
    onTimeChange(timeString);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    // 원래 값으로 되돌리기
    if (value) {
      setSelectedHour(parseInt(value.split(':')[0]));
      setSelectedMinute(parseInt(value.split(':')[1]));
    }
    setIsModalVisible(false);
  };

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
      >
        <Text
          variant="body"
          color={isPlaceholder ? "white60" : "white"}
          weight="medium"
        >
          {displayValue}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text variant="h3" color="white" weight="bold">
                시간 선택
              </Text>
            </View>

            <View style={styles.pickerContainer}>
              {/* 시간 선택 */}
              <View style={styles.pickerColumn}>
                <Text variant="body" color="white80" style={styles.columnLabel}>
                  시
                </Text>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && styles.selectedItem,
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text
                        variant="body"
                        color={selectedHour === hour ? "azureRadiance" : "white"}
                        weight={selectedHour === hour ? "bold" : "medium"}
                      >
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 분 선택 */}
              <View style={styles.pickerColumn}>
                <Text variant="body" color="white80" style={styles.columnLabel}>
                  분
                </Text>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && styles.selectedItem,
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text
                        variant="body"
                        color={selectedMinute === minute ? "azureRadiance" : "white"}
                        weight={selectedMinute === minute ? "bold" : "medium"}
                      >
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* 버튼 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text variant="body" color="white60" weight="medium">
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text variant="body" color="white" weight="bold">
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.white10,
    borderRadius: theme.borderRadius.base,
    minHeight: 44,
    justifyContent: 'center',
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '85%',
    maxWidth: 320,
    paddingVertical: theme.spacing.lg,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  pickerColumn: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
  },
  
  columnLabel: {
    marginBottom: theme.spacing.sm,
  },
  
  scrollView: {
    height: 150,
    width: 60,
  },
  
  scrollContent: {
    paddingVertical: theme.spacing.sm,
  },
  
  pickerItem: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    marginVertical: 2,
  },
  
  selectedItem: {
    backgroundColor: theme.colors.white10,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
  },
  
  button: {
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.base,
    minWidth: 80,
    alignItems: 'center',
  },
  
  cancelButton: {
    backgroundColor: theme.colors.white10,
  },
  
  confirmButton: {
    backgroundColor: theme.colors.azureRadiance,
  },
});

import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Header } from '../components/molecules';
import { SettingsSection } from '../components/organisms';
import { TimePicker, DropdownOption, LocationPermissionModal, Button } from '../components/atoms';
import { useAppStore } from '../stores/appStore';
import { userServiceCombined } from '../services/userServiceCombined';
import { useDeviceLayout, useLocationPermission } from '../hooks';
import { theme } from '../styles/theme';

// 드롭다운 옵션 데이터 정의
const heatColdOptions: DropdownOption[] = [
  { label: '더움', value: 'hot' },
  { label: '보통', value: 'normal' },
  { label: '추움', value: 'cold' },
];

export default function SettingScreen() {
  const { tabBarActualHeight } = useDeviceLayout();
  const {
    hasPermission,
    canAskAgain,
    shouldShowModal,
    requestPermission,
    openAppSettings,
    hidePermissionModal,
  } = useLocationPermission({ autoShow: false });

  // API 설정 관리
  const {
    userId,           // 추가: 스토어에서 userId도 가져오기
    apiUserData,
    updateApiUserData,
    initializeUserWithApi,
    syncApiUserData,
    loadApiUserData,
  } = useAppStore();

  // 컴포넌트 마운트 시 설정 데이터 로드
  useEffect(() => {
    const loadUserSettings = async () => {
      try {

        
        // GET 요청만 사용하여 사용자 설정 로드 (POST 없음)
        await initializeUserWithApi();
        
        console.log('✅ WEATHEREVER 설정 데이터 로드 완료');
      } catch (error) {
        console.error('❌ WEATHEREVER 설정 데이터 로드 실패:', error);
        console.log('⚠️ 기본값으로 동작합니다');
        // 실패해도 기본값으로 동작
      }
    };

    loadUserSettings();
  }, [initializeUserWithApi]);

  // API 데이터에서 실제 값들 추출 (pending 변경사항 우선 적용)
  const apiData = {
    heatColdPreference: 'normal' as const,
    workTime: { startTime: '09:00', endTime: '18:00' },
    ...apiUserData.data, // 서버 데이터
    ...apiUserData.pendingChanges, // 로컬 변경사항 (우선순위)
  };

  // ========== 핸들러 함수들 (async 처리 개선) ==========

  const handleStartTimeChange = async (time: string) => {
    try {
      // 1. 즉시 로컬 상태 업데이트
      const { savePendingChanges } = useAppStore.getState();
      savePendingChanges({
        workTime: {
          ...apiData.workTime,
          startTime: time,
        },
      });

      // 2. 즉시 서버에 저장
      await updateApiUserData({
        workTime: {
          ...apiData.workTime,
          startTime: time,
        },
      });

      console.log('출근 시간 저장 완료:', time);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      Alert.alert('네트워크 오류', '설정을 저장하지 못했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.');
    }
  };

  const handleEndTimeChange = async (time: string) => {
    try {
      // 1. 즉시 로컬 상태 업데이트
      const { savePendingChanges } = useAppStore.getState();
      savePendingChanges({
        workTime: {
          ...apiData.workTime,
          endTime: time,
        },
      });

      // 2. 즉시 서버에 저장
      await updateApiUserData({
        workTime: {
          ...apiData.workTime,
          endTime: time,
        },
      });

      console.log('퇴근 시간 저장 완료:', time);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      Alert.alert('네트워크 오류', '설정을 저장하지 못했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.');
    }
  };

  const handleHeatColdPreferenceChange = async (value: string) => {
    try {
      const { savePendingChanges } = useAppStore.getState();
      savePendingChanges({
        heatColdPreference: value as 'hot' | 'normal' | 'cold',
      });

      await updateApiUserData({
        heatColdPreference: value as 'hot' | 'normal' | 'cold',
      });
      console.log('🔥 6. updateApiUserData 완료');
    } catch (error) {
      console.error('🔥 7. 에러 발생:', error);
    }
  };

  // ========== 동기화 핸들러 ==========

  const handleLoadFromServer = async () => {
    try {
      await loadApiUserData();
      Alert.alert('성공', '서버에서 설정을 동기화했습니다.');
    } catch (error) {
      console.error('서버 동기화 실패:', error);
      Alert.alert('네트워크 오류', '서버 동기화에 실패했습니다.');
    }
  };

  // ========== 설정 섹션들 데이터 구성 ==========

  const workTimeSection = {
    title: '근무시간 설정',
    infoText: '일반적인 출근 및 퇴근 시간을 설정합니다. 이 설정에 따라 출근 전과 퇴근 전 날씨 알림 및 의류 추천 시간이 개인화됩니다.',
    items: [
      {
        icon: '🕘',
        title: '출근 시각',
        description: '출근 시각을 설정하세요',
        type: 'custom' as const,
        rightContent: (
          <TimePicker
            value={apiData.workTime.startTime}
            onTimeChange={handleStartTimeChange}
            placeholder="출근 시각"
          />
        ),
      },
      {
        icon: '🕕',
        title: '퇴근 시각',
        description: '퇴근 시각을 설정하세요',
        type: 'custom' as const,
        rightContent: (
          <TimePicker
            value={apiData.workTime.endTime}
            onTimeChange={handleEndTimeChange}
            placeholder="퇴근 시각"
          />
        ),
      },
    ],
  };



  const personalPreferencesSection = {
    title: '개인 취향',
    infoText: '당신의 개인적인 체감 선호도를 설정합니다. 이 설정에 따라 의류 추천이 개인화됩니다.',
    items: [
      {
        icon: '🌡️',
        title: '더위/추위 선호도',
        type: 'dropdown' as const,
        options: heatColdOptions,
        value: apiData.heatColdPreference,
        onValueChange: handleHeatColdPreferenceChange,
        dropdownWidth: 100,
      },
    ],
  };

  // API 동기화 섹션 (단순화됨)
  const apiSyncSection = {
    title: 'API 동기화',
    infoText: '설정 변경 시 자동으로 서버에 저장됩니다.',
    items: [
      {
        icon: '🔄',
        title: '서버에서 동기화',
        description: `마지막 동기화: ${apiUserData.lastSynced?.toLocaleString() || '없음'}`,
        type: 'custom' as const,
        rightContent: (
          <Button
            title="동기화"
            onPress={handleLoadFromServer}
            disabled={apiUserData.loading}
            style={[
              styles.syncButton,
              { opacity: apiUserData.loading ? 0.5 : 1 }
            ]}
          />
        ),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="WEATHEREVER" />

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Work Time Section (API 관리) */}
        <SettingsSection {...workTimeSection} />

        {/* Personal Preferences Section (API 관리) */}
        <SettingsSection {...personalPreferencesSection} />

        {/* API 동기화 섹션 (복구됨!) */}
        <SettingsSection {...apiSyncSection} />
      </ScrollView>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        visible={shouldShowModal}
        canAskAgain={canAskAgain}
        onRequestPermission={requestPermission}
        onOpenSettings={openAppSettings}
        onClose={hidePermissionModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContent: {
    flex: 1,
    marginHorizontal: theme.layout.contentPaddingHorizontal,
    marginTop: theme.spacing.md,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // 탭바 높이(60) + 여유 공간(20)
  },

  // 새로운 스타일
  syncButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.azureRadiance,
    borderRadius: 6,
    minWidth: 80,
  },
});

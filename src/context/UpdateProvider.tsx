import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
// @ts-ignore
import VersionCheck from 'react-native-version-check';

import * as Updates from 'expo-updates';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface IUpdateProviderProps {
  children: React.ReactNode;
}

export default function UpdateProvider({ children }: IUpdateProviderProps) {
  const { theme } = useTheme();
  const appState = useRef(AppState.currentState);
  const [showOTAModal, setShowOTAModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');

  // 스토어 업데이트 확인 (앱스토어 배포 후 활성화)
  const checkStoreUpdate = useCallback(async () => {
    if (__DEV__) return;

    // TODO: 앱스토어 배포 후 활성화
    // try {
    //   const need = await VersionCheck.needUpdate();
    //   if (need && need.isNeeded) {
    //     showStoreUpdateModal(need.storeUrl);
    //   }
    // } catch (error) {
    //   console.error('스토어 업데이트 확인 실패:', error);
    // }

    console.log('스토어 업데이트 확인: 앱스토어 배포 후 활성화 예정');
  }, []);

  // OTA 업데이트 확인
  const checkOTAUpdate = useCallback(async () => {
    if (__DEV__) return;

    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        showOTAUpdateModal(); // 모달 먼저 표시

        // 모달이 표시될 시간을 주고 업데이트 진행
        setTimeout(async () => {
          try {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          } catch (error) {
            console.error('OTA 업데이트 설치 실패:', error);
            setShowOTAModal(false); // 모달 숨기기
          }
        }, 2000); // 2초 후 업데이트 진행
      }
    } catch (error) {
      console.error('OTA 업데이트 확인 실패:', error);
    }
  }, []);

  // 스토어 업데이트 모달 표시
  const showStoreUpdateModal = (url: string) => {
    setStoreUrl(url);
    setShowStoreModal(true);
  };

  // OTA 업데이트 모달 표시
  const showOTAUpdateModal = () => {
    setShowOTAModal(true);
  };

  // 앱 시작 시 업데이트 확인
  useEffect(() => {
    checkStoreUpdate();
    checkOTAUpdate();
  }, [checkStoreUpdate, checkOTAUpdate]);

  // 앱 상태 변경 시 업데이트 확인
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkStoreUpdate();
        checkOTAUpdate();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [checkStoreUpdate, checkOTAUpdate]);

  return (
    <>
      {children}

      {/* OTA 업데이트 모달 */}
      <Modal
        visible={showOTAModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOTAModal(false)}
      >
        <View style={styles.modalOverlay}>
          <OTAUpdateModal />
        </View>
      </Modal>

      {/* 스토어 업데이트 모달 */}
      <Modal
        visible={showStoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStoreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <StoreUpdateModal
            storeUrl={storeUrl}
            onClose={() => setShowStoreModal(false)}
          />
        </View>
      </Modal>
    </>
  );
}

// OTA 업데이트 모달 컴포넌트
const OTAUpdateModal = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.modalContainer, { backgroundColor: theme.surface }]}>
      <ActivityIndicator color={theme.primary} size="large" />
      <View style={styles.textContainer}>
        <TextBox variant="title3" color={theme.text} style={styles.title}>
          업데이트를 진행중입니다
        </TextBox>
        <TextBox
          variant="body3"
          color={theme.textSecondary}
          style={styles.subtitle}
        >
          잠시만 기다려 주세요
        </TextBox>
      </View>
    </View>
  );
};

// 스토어 업데이트 모달 컴포넌트
const StoreUpdateModal = ({
  storeUrl,
  onClose,
}: {
  storeUrl: string;
  onClose: () => void;
}) => {
  const { theme } = useTheme();

  const handleStoreUpdate = () => {
    Linking.openURL(storeUrl);
    onClose();
  };

  return (
    <View style={[styles.modalContainer, { backgroundColor: theme.surface }]}>
      <View style={styles.textContainer}>
        <TextBox variant="title3" color={theme.text} style={styles.title}>
          새로운 버전이 출시되었습니다
        </TextBox>
        <TextBox
          variant="body3"
          color={theme.textSecondary}
          style={styles.subtitle}
        >
          확인 버튼을 누르면 스토어로 이동합니다
        </TextBox>
      </View>
      <CustomButton
        title="확인"
        onPress={handleStoreUpdate}
        variant="primary"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 20,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
  },
});

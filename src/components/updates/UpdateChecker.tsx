import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import * as Updates from 'expo-updates';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

// TODO : react-native-version-check 스토어 업데이트 확인 구현
// 현재 : expo-updates 업데이트 확인 구현

export const UpdateChecker: React.FC = () => {
  const { theme } = useTheme();
  const [isChecking, setIsChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<string>('');

  useEffect(() => {
    if (__DEV__) {
      setUpdateInfo('개발 모드에서는 업데이트가 비활성화됩니다.');
      setIsChecking(false);
      return;
    }
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);

      // 현재 업데이트 정보 확인
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateInfo('새로운 업데이트가 있습니다!');
        showUpdateAlert();
      } else {
        setUpdateInfo('최신 버전입니다.');
      }
    } catch (error) {
      console.log('업데이트 확인 실패:', error);
      setUpdateInfo('업데이트 확인 실패');
    } finally {
      setIsChecking(false);
    }
  };

  const showUpdateAlert = () => {
    Alert.alert(
      '업데이트 알림',
      '새로운 버전이 있습니다. 지금 업데이트하시겠습니까?',
      [
        {
          text: '나중에',
          style: 'cancel',
        },
        {
          text: '업데이트',
          onPress: downloadAndInstallUpdate,
        },
      ]
    );
  };

  const downloadAndInstallUpdate = async () => {
    try {
      setIsChecking(true);

      // 업데이트 다운로드
      await Updates.fetchUpdateAsync();

      // 앱 재시작
      await Updates.reloadAsync();
    } catch (error) {
      console.error('업데이트 설치 실패:', error);
      Alert.alert('오류', '업데이트 설치에 실패했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  const getUpdateInfo = () => {
    if (__DEV__) {
      return '개발 모드에서는 업데이트가 비활성화됩니다.';
    }

    return `현재 버전: ${Updates.updateId || '알 수 없음'}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TextBox variant="title3" color={theme.text} style={styles.title}>
        🔄 OTA 업데이트 테스트
      </TextBox>

      <TextBox variant="body3" color={theme.textSecondary} style={styles.info}>
        {getUpdateInfo()}
      </TextBox>

      <TextBox
        variant="body3"
        color={theme.textSecondary}
        style={styles.status}
      >
        상태: {updateInfo}
      </TextBox>

      <CustomButton
        title={isChecking ? '확인 중...' : '업데이트 확인'}
        onPress={checkForUpdates}
        disabled={isChecking}
        variant="primary"
        style={styles.button}
      />

      <TextBox
        variant="caption2"
        color={theme.textSecondary}
        style={styles.note}
      >
        💡 Release 빌드에서만 OTA 업데이트가 작동합니다.
      </TextBox>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  info: {
    marginBottom: 8,
    textAlign: 'center',
  },
  status: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 12,
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import {
  BasicSheet,
  LargeSheet,
  MediumSheet,
  UserInfoSheet,
} from '@/components/bottomSheet';
import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import { BasicModal, BottomModal } from '@/components/modal';

import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useAlert, useConfirm, useModal } from '@/hooks/useModal';

const ModalTabScreen: React.FC = () => {
  const { theme } = useTheme();
  const { openModal } = useModal();
  const { alert } = useAlert();
  const { confirm } = useConfirm();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const handleCenterModal = () => {
    openModal({
      title: '디자인 시스템 모달',
      children: <BasicModal />,
      buttons: [
        {
          text: '둘러보기',
          variant: 'outline',
          onPress: () => {},
        },
        {
          text: '확인',
          onPress: () => {},
        },
      ],
      size: 'medium',
      hasBackground: true,
    });
  };

  const handleBottomModal = () => {
    openModal({
      title: '하단 모달',
      position: 'bottom',
      size: 'large',
      closeButton: false,
      children: <BottomModal />,
      buttons: [
        {
          text: '닫기',
          variant: 'ghost',
          onPress: () => {},
        },
      ],
    });
  };

  const handleBasicSheet = () => {
    openBottomSheet({
      content: <BasicSheet onClose={closeBottomSheet} />,
      snapPoints: ['40%'],
    });
  };

  const handleMediumSheet = () => {
    openBottomSheet({
      content: <MediumSheet onClose={closeBottomSheet} />,
      snapPoints: ['45%', '65%'],
    });
  };

  const handleLargeSheet = () => {
    openBottomSheet({
      content: <LargeSheet onClose={closeBottomSheet} />,
      snapPoints: ['60%', '90%'],
    });
  };

  const handleUserSheet = () => {
    openBottomSheet({
      content: (
        <UserInfoSheet
          onClose={closeBottomSheet}
          userName="이선호"
          userEmail="seonho@example.com"
          userPhone="010-9876-5432"
        />
      ),
      snapPoints: ['55%'],
    });
  };

  const handleAlert = () => {
    alert('한 줄 메시지를 즉시 보여주는 알림 모달입니다.');
  };

  const handleConfirm = () => {
    confirm(
      '데이터를 리셋하시겠습니까?',
      '확인',
      () => {},
      () => {}
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      bounces={false}
    >
      <TextBox variant="title3" style={styles.title}>
        모달 & 바텀시트
      </TextBox>
      <TextBox
        variant="body3"
        color={theme.textSecondary}
        style={styles.subtitle}
      >
        디자인 시스템에 포함된 모달과 바텀시트를 체험해보세요.
      </TextBox>

      <View style={styles.section}>
        <TextBox variant="title5" style={styles.sectionTitle}>
          Modal
        </TextBox>
        <CustomButton
          title="기본 모달 열기"
          onPress={handleCenterModal}
          fullWidth
        />
        <CustomButton
          title="하단 모달 열기"
          onPress={handleBottomModal}
          variant="outline"
          fullWidth
        />
        <CustomButton
          title="Alert 모달"
          onPress={handleAlert}
          variant="secondary"
          fullWidth
        />
        <CustomButton
          title="Confirm 모달"
          onPress={handleConfirm}
          variant="ghost"
          fullWidth
        />
      </View>

      <View style={styles.section}>
        <TextBox variant="title5" style={styles.sectionTitle}>
          Bottom Sheet
        </TextBox>
        <CustomButton title="기본 시트" onPress={handleBasicSheet} fullWidth />
        <CustomButton
          title="중간 시트"
          onPress={handleMediumSheet}
          variant="outline"
          fullWidth
        />
        <CustomButton
          title="큰 시트"
          onPress={handleLargeSheet}
          variant="ghost"
          fullWidth
        />
        <CustomButton
          title="사용자 정보 시트"
          onPress={handleUserSheet}
          variant="secondary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 24,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 12,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
});

export default ModalTabScreen;

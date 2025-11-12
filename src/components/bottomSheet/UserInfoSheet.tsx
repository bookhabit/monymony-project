import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface UserInfoSheetProps {
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export const UserInfoSheet: React.FC<UserInfoSheetProps> = ({
  onClose,
  userName = '홍길동',
  userEmail = 'hong@example.com',
  userPhone = '010-1234-5678',
}) => {
  const { theme } = useTheme();

  return (
    <View>
      <TextBox variant="title5" style={styles.title}>
        사용자 정보
      </TextBox>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <TextBox variant="body4" color={theme.textSecondary}>
            이름
          </TextBox>
          <TextBox variant="body3">{userName}</TextBox>
        </View>

        <View style={styles.infoRow}>
          <TextBox variant="body4" color={theme.textSecondary}>
            이메일
          </TextBox>
          <TextBox variant="body3">{userEmail}</TextBox>
        </View>

        <View style={styles.infoRow}>
          <TextBox variant="body4" color={theme.textSecondary}>
            전화번호
          </TextBox>
          <TextBox variant="body3">{userPhone}</TextBox>
        </View>
      </View>

      <CustomButton title="확인" onPress={onClose} style={styles.closeButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  infoContainer: {
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeButton: {
    marginTop: 20,
  },
});

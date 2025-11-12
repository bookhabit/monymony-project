import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface MediumSheetProps {
  onClose: () => void;
}

export const MediumSheet: React.FC<MediumSheetProps> = ({ onClose }) => {
  const { theme } = useTheme();

  return (
    <View>
      <TextBox variant="title5" style={styles.title}>
        중간 Bottom Sheet
      </TextBox>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TextBox variant="body3">📱 모바일 최적화</TextBox>
        <TextBox variant="caption1" color={theme.textSecondary}>
          스와이프로 쉽게 닫을 수 있습니다
        </TextBox>
      </View>
      <CustomButton
        title="닫기"
        onPress={onClose}
        variant="outline"
        style={styles.closeButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 20,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

const BottomModal: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.modalContent}>
      <TextBox variant="body2">
        `position="bottom"`과 `size="large"` 옵션으로 시트처럼 사용할 수
        있습니다.
      </TextBox>
      <View
        style={[
          styles.tipCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TextBox variant="caption1" color={theme.textSecondary}>
          활용 팁
        </TextBox>
        <TextBox variant="body3">
          하단 모달은 스와이프 제스처와 함께 사용하면 자연스럽게 닫히는 경험을
          제공합니다.
        </TextBox>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    gap: 12,
  },
  tipCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
});

export default BottomModal;
export { BottomModal };

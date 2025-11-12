import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

const BasicModal: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.modalContent}>
      <TextBox variant="body2">
        ImprovedModal 컴포넌트를 활용해 텍스트, 버튼, 레이아웃을 자유롭게 구성할
        수 있습니다.
      </TextBox>

      <View
        style={[
          styles.metricCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TextBox variant="caption1" color={theme.textSecondary}>
          가이드
        </TextBox>
        <TextBox variant="body3">
          버튼 배열은 `buttons` 옵션으로 제어하고, 닫기 동작은 자동으로
          처리됩니다.
        </TextBox>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    gap: 12,
  },
  metricCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
});

export default BasicModal;
export { BasicModal };

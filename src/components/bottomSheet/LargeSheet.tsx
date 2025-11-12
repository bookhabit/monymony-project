import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface LargeSheetProps {
  onClose: () => void;
}

export const LargeSheet: React.FC<LargeSheetProps> = ({ onClose }) => {
  const { theme } = useTheme();

  return (
    <ScrollView>
      <TextBox variant="title5" style={styles.title}>
        큰 Bottom Sheet
      </TextBox>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TextBox variant="body3">🎨 테마 지원</TextBox>
        <TextBox variant="caption1" color={theme.textSecondary}>
          다크모드를 자동으로 지원합니다
        </TextBox>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TextBox variant="body3">⚡ 성능 최적화</TextBox>
        <TextBox variant="caption1" color={theme.textSecondary}>
          Reanimated 2로 부드러운 애니메이션
        </TextBox>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <TextBox variant="body3">🔥 제스처 지원</TextBox>
        <TextBox variant="caption1" color={theme.textSecondary}>
          드래그로 크기 조절 가능
        </TextBox>
      </View>

      <CustomButton
        title="닫기"
        onPress={onClose}
        variant="outline"
        style={styles.closeButton}
      />
    </ScrollView>
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

import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

export default function EncodingScreen() {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[{ paddingBottom: bottom + 20 }]}
    >
      <CustomHeader title="TextEncoder / TextDecoder" showBackButton />
      <View style={styles.content}>
        <TextBox variant="title2" color={theme.text} style={styles.heading}>
          Encoding APIs
        </TextBox>
        <TextBox
          variant="body3"
          color={theme.textSecondary}
          style={styles.subtitle}
        >
          TextEncoder / TextDecoder 테스트
        </TextBox>
        {/* 내용은 사용자가 작성할 예정 */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heading: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
});

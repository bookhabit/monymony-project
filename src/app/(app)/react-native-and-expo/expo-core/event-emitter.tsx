import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

export default function EventEmitterScreen() {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[{ paddingBottom: bottom + 20 }]}
    >
      <CustomHeader title="EventEmitterType" showBackButton />
      <View style={styles.content}>
        <TextBox variant="title2" color={theme.text} style={styles.heading}>
          EventEmitterType
        </TextBox>
        <TextBox
          variant="body3"
          color={theme.textSecondary}
          style={styles.subtitle}
        >
          C++ 기반 이벤트 시스템 테스트
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

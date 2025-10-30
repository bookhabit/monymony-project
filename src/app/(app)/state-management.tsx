import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * State Management Study Screen
 */
export default function StateManagementScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="상태 관리" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              상태 관리 학습
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              상태 관리 학습 콘텐츠를 여기에 작성하세요.
            </TextBox>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  heading: {
    marginBottom: 8,
  },
});

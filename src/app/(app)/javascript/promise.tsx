import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Promise Study Screen
 */
export default function PromiseScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="Promise" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              Promise
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              비동기 작업의 결과를 나타내는 객체
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              상태
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • pending: 대기 중
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • fulfilled: 성공
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • rejected: 실패
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
  listItem: {
    marginBottom: 8,
  },
});

import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * async/await Study Screen
 */
export default function AsyncAwaitScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="async/await" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              async/await
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              Promise를 더 쉽게 다루는 비동기 패턴
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              주요 특징
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • async 함수는 항상 Promise를 반환
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • await는 Promise가 완료될 때까지 기다림
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 동기 코드처럼 보이지만 비동기로 작동
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 에러 처리는 try-catch로 가능
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

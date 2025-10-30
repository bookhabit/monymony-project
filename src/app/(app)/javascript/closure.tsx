import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Closure Study Screen
 */
export default function ClosureScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="클로저" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              클로저 (Closure)
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              내부 함수가 외부 함수의 변수에 접근할 수 있는 메커니즘
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              활용
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 데이터 은닉화
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 커링 함수
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 모듈 패턴
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

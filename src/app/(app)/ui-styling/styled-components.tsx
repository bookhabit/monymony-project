import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Styled Components Study Screen
 */
export default function StyledComponentsScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="스타일드 컴포넌트" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              스타일드 컴포넌트
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              CSS-in-JS 라이브러리
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              장점
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 컴포넌트와 스타일 결합
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • props 기반 동적 스타일
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 중첩 규칙 지원
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

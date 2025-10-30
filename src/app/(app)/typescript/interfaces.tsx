import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Interfaces Study Screen
 */
export default function InterfacesScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="인터페이스" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              인터페이스 (Interfaces)
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              객체의 구조를 정의하는 타입
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              활용
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 객체의 타입 정의
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 함수의 타입 시그니처
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 확장 가능
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

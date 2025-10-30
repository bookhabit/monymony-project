import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Generics Study Screen
 */
export default function GenericsScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="제네릭" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              제네릭 (Generics)
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              타입을 변수처럼 사용하는 기능
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              특징
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 재사용 가능한 타입 정의
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 타입 안정성 제공
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 다양한 타입에 대응
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

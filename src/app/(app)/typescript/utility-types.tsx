import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Utility Types Study Screen
 */
export default function UtilityTypesScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="유틸리티 타입" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              유틸리티 타입 (Utility Types)
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              기존 타입을 변환하는 유틸리티
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              주요 타입
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • Partial&lt;T&gt;
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • Required&lt;T&gt;
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • Pick&lt;T, K&gt;
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • Omit&lt;T, K&gt;
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

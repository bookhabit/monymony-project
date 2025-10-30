import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Flexbox Study Screen
 */
export default function FlexboxScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="Flexbox" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              Flexbox
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              레이아웃을 위한 1차원 배치 방식
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              주요 속성
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • flexDirection: 주축 방향
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • justifyContent: 주축 정렬
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • alignItems: 교차축 정렬
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

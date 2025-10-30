import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Tree Study Screen
 * 공부한 내용 정리
 */
export default function TreeScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="트리" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              트리 (Tree)
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              계층적인 자료구조로 노드와 엣지로 구성
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              주요 개념
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 루트(Root): 최상위 노드
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 리프(Leaf): 자식이 없는 노드
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 높이(Height): 최대 깊이
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 이진 트리: 각 노드가 최대 2개의 자식
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              활용 예시
            </TextBox>
            <TextBox variant="body2" color={theme.text}>
              파일 시스템, DOM 트리, 조직도 등에 사용됩니다.
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

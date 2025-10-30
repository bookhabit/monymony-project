import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Stack Study Screen
 * 공부한 내용 정리
 */
export default function StackScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="스택" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              스택 (Stack)
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              후입선출(LIFO: Last In First Out) 자료구조
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              주요 연산
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • push(): 스택에 요소 추가
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • pop(): 스택에서 요소 제거
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • peek(): 최상위 요소 확인
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • isEmpty(): 스택이 비어있는지 확인
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              활용 예시
            </TextBox>
            <TextBox variant="body2" color={theme.text}>
              함수 호출, 뒤로가기, 괄호 매칭 등에 사용됩니다.
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

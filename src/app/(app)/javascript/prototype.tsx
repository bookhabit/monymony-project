import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Prototype Study Screen
 */
export default function PrototypeScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="프로토타입" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              프로토타입 (Prototype)
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              JavaScript의 상속 메커니즘
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              주요 개념
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • 프로토타입 체인
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • constructor 프로퍼티
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.listItem}>
              • __proto__ vs prototype
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

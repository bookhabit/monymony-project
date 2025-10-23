import { Pressable, StyleSheet, View } from 'react-native';

import { Link } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <TextBox variant="title1" style={styles.title} color={theme.text}>
          🎯 Monymony
        </TextBox>

        <TextBox
          variant="body3"
          style={styles.subtitle}
          color={theme.textSecondary}
        >
          화면을 선택해주세요
        </TextBox>

        <View style={styles.buttonContainer}>
          <Link href="/design-system" asChild>
            <Pressable
              style={[styles.button, { backgroundColor: theme.primary }]}
            >
              <TextBox variant="button1" color={theme.text}>
                📝 디자인 시스템
              </TextBox>
            </Pressable>
          </Link>

          <Link href="/test1" asChild>
            <Pressable
              style={[styles.button, { backgroundColor: theme.secondary }]}
            >
              <TextBox variant="button1" color={theme.text}>
                🧪 이미지 컴포넌트
              </TextBox>
            </Pressable>
          </Link>

          <Link href="/test2" asChild>
            <Pressable
              style={[styles.button, { backgroundColor: theme.success }]}
            >
              <TextBox variant="button1" color={theme.text}>
                🧪 테스트 스크린 2
              </TextBox>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

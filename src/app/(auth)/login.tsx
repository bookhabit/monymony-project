import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function LoginScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    // TODO: 실제 로그인 로직 구현
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <TextBox variant="title1" color={theme.text} style={styles.title}>
            🔐 로그인
          </TextBox>

          <TextBox
            variant="body4"
            color={theme.textSecondary}
            style={styles.subtitle}
          >
            테스트 로그인 화면입니다
          </TextBox>

          <View style={[styles.form, { backgroundColor: theme.surface }]}>
            <View style={styles.inputGroup}>
              <TextBox variant="body3" color={theme.text} style={styles.label}>
                이메일
              </TextBox>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="이메일을 입력하세요"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <TextBox variant="body3" color={theme.text} style={styles.label}>
                비밀번호
              </TextBox>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <Pressable
              style={[styles.loginButton, { backgroundColor: theme.primary }]}
              onPress={handleLogin}
            >
              <TextBox variant="button2" color="#fff">
                로그인
              </TextBox>
            </Pressable>

            <Pressable style={styles.forgotPassword}>
              <TextBox variant="caption2" color={theme.primary}>
                비밀번호를 잊으셨나요?
              </TextBox>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <TextBox variant="caption2" color={theme.textSecondary}>
              계정이 없으신가요?{' '}
            </TextBox>
            <Pressable>
              <TextBox variant="caption2" color={theme.primary}>
                회원가입
              </TextBox>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});

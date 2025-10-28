import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import Input from '@/components/common/Input';
import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Detail Screen (Test)
 *
 * - CustomHeader 사용 예시
 * - headerShown: false
 * - SafeArea top 자동 적용
 */
export default function DetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header */}
      <CustomHeader title="상세 페이지" showBackButton />
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <TextBox variant="title1" color={theme.text}>
          Study
        </TextBox>
      </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    paddingVertical: 4,
  },
  buttonGroup: {
    gap: 12,
  },
});

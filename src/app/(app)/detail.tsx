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

  const handleSave = () => {
    console.log('저장:', { name, email });
    alert('저장되었습니다!');
  };

  const handleShare = () => {
    console.log('공유하기');
    alert('공유 기능');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header */}
      <CustomHeader
        title="상세 페이지"
        showBackButton
        rightIcon="share"
        onRightPress={handleShare}
      />

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              CustomHeader 테스트
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              SafeArea top을 활용한 커스텀 헤더입니다.
            </TextBox>
          </View>

          {/* Form Section */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.sectionTitle}
            >
              📝 폼 예시
            </TextBox>

            <View style={styles.form}>
              <Input
                label="이름"
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
                leftIcon="person"
              />
              <Input
                label="이메일"
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                leftIcon="email"
                keyboardType="email-address"
              />
              <CustomButton
                title="저장하기"
                variant="primary"
                fullWidth
                onPress={handleSave}
              />
            </View>
          </View>

          {/* Features Section */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.sectionTitle}
            >
              ✨ CustomHeader 기능
            </TextBox>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <TextBox variant="body3" color={theme.text}>
                  ✓ SafeArea top 자동 적용
                </TextBox>
              </View>
              <View style={styles.featureItem}>
                <TextBox variant="body3" color={theme.text}>
                  ✓ 뒤로가기 버튼 (왼쪽)
                </TextBox>
              </View>
              <View style={styles.featureItem}>
                <TextBox variant="body3" color={theme.text}>
                  ✓ 제목 (가운데 정렬)
                </TextBox>
              </View>
              <View style={styles.featureItem}>
                <TextBox variant="body3" color={theme.text}>
                  ✓ 오른쪽 아이콘 버튼
                </TextBox>
              </View>
              <View style={styles.featureItem}>
                <TextBox variant="body3" color={theme.text}>
                  ✓ 오른쪽 텍스트 버튼
                </TextBox>
              </View>
              <View style={styles.featureItem}>
                <TextBox variant="body3" color={theme.text}>
                  ✓ 테마 자동 적용
                </TextBox>
              </View>
            </View>
          </View>

          {/* Navigation Test */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.sectionTitle}
            >
              🧭 네비게이션 테스트
            </TextBox>

            <View style={styles.buttonGroup}>
              <CustomButton
                title="디자인 탭으로 이동"
                variant="outline"
                onPress={() => router.push('/(app)/(tabs)/design')}
              />
              <CustomButton
                title="이미지 탭으로 이동"
                variant="outline"
                onPress={() => router.push('/(app)/(tabs)/image')}
              />
              <CustomButton
                title="아이콘 탭으로 이동"
                variant="outline"
                onPress={() => router.push('/(app)/(tabs)/icon')}
              />
            </View>
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

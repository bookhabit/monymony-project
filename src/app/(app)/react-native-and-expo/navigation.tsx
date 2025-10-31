import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Link, useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

export default function NavigationScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // useRouter로 파라미터 전달 예시
  const handleUseRouterNavigation = () => {
    router.push({
      pathname: '/(app)/react-native-and-expo/product/[productId]',
      params: { productId: '123' },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="네비게이션" showBackButton />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Link 방식 */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              1. Link 방식
            </TextBox>
            <TextBox
              variant="body3"
              color={theme.textSecondary}
              style={styles.description}
            >
              파라미터 전달
            </TextBox>

            <View style={styles.buttonContainer}>
              <Link
                href={{
                  pathname: '/(app)/react-native-and-expo/product/[productId]',
                  params: { productId: '456' },
                }}
                asChild
              >
                <CustomButton title="Link: productId=456" onPress={() => {}} />
              </Link>
            </View>
          </View>

          {/* useRouter 방식 */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              2. useRouter 방식
            </TextBox>
            <TextBox
              variant="body3"
              color={theme.textSecondary}
              style={styles.description}
            >
              파라미터 전달
            </TextBox>

            <View style={styles.buttonContainer}>
              <CustomButton
                title="useRouter: productId=123"
                onPress={handleUseRouterNavigation}
              />
            </View>
          </View>

          {/* 동적 라우팅 */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              3. 동적 라우팅
            </TextBox>
            <TextBox
              variant="body3"
              color={theme.textSecondary}
              style={styles.description}
            >
              /product/[productId]
            </TextBox>

            <View style={styles.buttonContainer}>
              <Link href="/(app)/react-native-and-expo/product/999" asChild>
                <CustomButton title="Product ID: 999" onPress={() => {}} />
              </Link>
            </View>
          </View>

          {/* 중첩 동적 라우팅 */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              4. 중첩 동적 라우팅
            </TextBox>
            <TextBox
              variant="body3"
              color={theme.textSecondary}
              style={styles.description}
            >
              /products/[category]/[productId]
            </TextBox>

            <View style={styles.buttonContainer}>
              <Link
                href="/(app)/react-native-and-expo/products/electronics/iphone-15"
                asChild
              >
                <CustomButton
                  title="Category: electronics, Product: iphone-15"
                  onPress={() => {}}
                />
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20, gap: 16 },
  section: { padding: 20, borderRadius: 15, marginBottom: 0 },
  heading: { marginBottom: 8 },
  description: { marginBottom: 16 },
  buttonContainer: { width: '100%' },
});

import { ScrollView, StyleSheet, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

export default function NestedProductDetailScreen() {
  const { theme } = useTheme();
  const { category, productId } = useLocalSearchParams<{
    category: string;
    productId: string;
  }>();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="중첩 상품 상세" showBackButton />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              중첩 동적 라우팅
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.info}>
              Path: /products/[category]/[productId]
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              받은 파라미터
            </TextBox>
            <TextBox variant="body2" color={theme.text}>
              카테고리: {category}
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.marginTop}>
              상품 ID: {productId}
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              상품 정보
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              카테고리별 상품 상세 페이지입니다.
            </TextBox>
            <TextBox variant="body4" color={theme.textSecondary} style={styles.marginTop}>
              이 페이지는 중첩 동적 라우팅 예시로, 두 개의 동적 세그먼트를 사용합니다.
            </TextBox>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  section: { padding: 20, borderRadius: 15, marginBottom: 20 },
  heading: { marginBottom: 12 },
  info: { marginBottom: 8 },
  marginTop: { marginTop: 8 },
});


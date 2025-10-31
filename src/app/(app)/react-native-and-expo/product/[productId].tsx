import { ScrollView, StyleSheet, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

export default function ProductDetailScreen() {
  const { theme } = useTheme();
  const { productId } = useLocalSearchParams<{ productId: string }>();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="상품 상세" showBackButton />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              동적 라우팅
            </TextBox>
            <TextBox variant="body2" color={theme.text} style={styles.info}>
              Path: /product/[productId]
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary} style={styles.result}>
              받은 파라미터: {productId}
            </TextBox>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              상품 정보
            </TextBox>
            <TextBox variant="body2" color={theme.text}>
              상품 ID: {productId}
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary} style={styles.marginTop}>
              이 페이지는 동적 라우팅 예시입니다.
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
  result: { marginTop: 8 },
  marginTop: { marginTop: 8 },
});


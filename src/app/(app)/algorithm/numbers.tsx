import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

export default function NumbersScreen() {
  const { theme } = useTheme();

  useEffect(() => {
    console.group('숫자 함수 예제');
    console.log('정수 표현 확인:', Number.isInteger(3.5), Number.isInteger(3));
    console.log('Math.floor(1.9):', Math.floor(1.9));
    console.log('Math.round(1.4):', Math.round(1.4));
    console.log('Math.round(1.6):', Math.round(1.6));
    console.log('Math.ceil(1.1):', Math.ceil(1.1));
    console.log('Math.abs(-12):', Math.abs(-12));
    console.log('Number.EPSILON:', Number.EPSILON);
    console.log('Number.MAX_SAFE_INTEGER:', Number.MAX_SAFE_INTEGER);
    console.log('Number.MAX_VALUE:', Number.MAX_VALUE);
    console.log('Number.MIN_SAFE_INTEGER:', Number.MIN_SAFE_INTEGER);
    console.log('Number.MIN_VALUE:', Number.MIN_VALUE);
    console.groupEnd();
  }, []);

  const summaries = [
    '자바스크립트의 모든 숫자는 64비트 부동소수점(IEEE 754)으로 표현된다.',
    'Math.floor(x): x보다 크지 않은 가장 가까운 정수',
    'Math.round(x): x와 가장 가까운 정수',
    'Math.ceil(x): x보다 작지 않은 가장 가까운 정수',
    'Math.abs(x): x의 절댓값',
    'Number.EPSILON: 표현 가능한 두 숫자 사이의 최소 간격',
    'Number.MAX_SAFE_INTEGER: 안전하게 표현 가능한 최대 정수',
    'Number.MAX_VALUE: 표현 가능한 최대 양수',
    'Number.MIN_SAFE_INTEGER: 안전하게 표현 가능한 최소 정수',
    'Number.MIN_VALUE: 0보다 큰 가장 작은 양수',
  ];

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{ backgroundColor: theme.background }}
    >
      <CustomHeader title="숫자" showBackButton />

      <View style={styles.content}>
        <TextBox variant="title2" color={theme.text}>
          자바스크립트 숫자 객체
        </TextBox>
        {summaries.map((line) => (
          <TextBox key={line} variant="body1" color={theme.text}>
            {line}
          </TextBox>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
});

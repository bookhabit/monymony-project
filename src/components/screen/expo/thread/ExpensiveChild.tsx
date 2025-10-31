import React from 'react';
import { View, Text } from 'react-native';

import TextBox from '@/components/common/TextBox';

import { darkTheme, lightTheme } from '@/constants/colors';

interface ExpensiveChildProps {
  count: number;
  theme: typeof lightTheme | typeof darkTheme;
}

const ExpensiveChild = ({ count, theme }: ExpensiveChildProps) => {
  console.log('ExpensiveChild re-render');
  let now = performance.now();
  while (performance.now() - now < 2000) {
    // 무거운 계산 시뮬레이션
  }

  return (
    <TextBox variant="body2" color={theme.text}>{`Count: ${count}`}</TextBox>
  );
};

export default ExpensiveChild;

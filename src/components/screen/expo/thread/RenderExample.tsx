import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

import ExpensiveChild from './ExpensiveChild';

const RenderExample = () => {
  const { theme } = useTheme();

  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  console.log('Parent re-render');

  return (
    <View style={{ gap: 10 }}>
      <CustomButton title="Increment" onPress={() => setCount(count + 1)} />
      <CustomButton
        title="Change Text"
        onPress={() => setText(Math.random().toString(36).slice(2, 5))}
      />
      <TextBox variant="body2" color={theme.text}>
        {'Text: '}
        {text}
      </TextBox>
      <ExpensiveChild count={count} theme={theme} />
    </View>
  );
};

export default RenderExample;

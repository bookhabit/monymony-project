import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { createWorkletRuntime, runOnRuntime } from 'react-native-worklets';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

const FibonacciWorkerExample = () => {
  const [count, setCount] = useState(0);

  // create a separate worklet runtime for heavy computation
  const workerRuntime = useMemo(
    () =>
      createWorkletRuntime({
        name: 'worker-runtime',
        initializer: () => {
          'worklet';
          console.log('heavy computation worklet initialized');
        },
      }),
    []
  );

  // a heavy compoutation worklet
  const heavyComputation = () => {
    'worklet';
    const start = Date.now();
    while (Date.now() - start < 3000) {
      // 무거운 계산 시뮬레이션
      Math.sqrt(Math.random() * 1e9);
    }
    console.log('heavy task done on UI/worker thread');
  };

  const runHeavyTask = () => {
    runOnRuntime(workerRuntime, heavyComputation)();
  };

  return (
    <View style={{ gap: 10 }}>
      <TextBox variant="body2">
        {'Count: '}
        {count}
      </TextBox>
      <CustomButton title="Increment" onPress={() => setCount(count + 1)} />
      <CustomButton title="Run Heavy Task" onPress={runHeavyTask} />
    </View>
  );
};

export default FibonacciWorkerExample;

import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

/**
 * Algorithm Sub-route Layout
 * 알고리즘 하위 주제들 (스택, 큐, 트리 등)
 */
export default function AlgorithmLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="stack"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="queue"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="tree"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

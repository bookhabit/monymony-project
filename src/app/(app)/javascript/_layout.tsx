import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

/**
 * JavaScript Sub-route Layout
 */
export default function JavaScriptLayout() {
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
        name="async-await"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="promise"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="closure"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="prototype"
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

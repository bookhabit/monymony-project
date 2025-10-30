import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

export default function ReactLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="hooks" options={{ headerShown: false }} />
      <Stack.Screen name="context" options={{ headerShown: false }} />
      <Stack.Screen name="lifecycle" options={{ headerShown: false }} />
      <Stack.Screen name="performance" options={{ headerShown: false }} />
    </Stack>
  );
}

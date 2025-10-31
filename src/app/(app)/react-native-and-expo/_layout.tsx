import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

export default function ReactNativeLayout() {
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
      <Stack.Screen name="navigation" options={{ headerShown: false }} />
      <Stack.Screen name="expo-modules" options={{ headerShown: false }} />
      <Stack.Screen name="build-deploy" options={{ headerShown: false }} />
      <Stack.Screen name="platform-specific" options={{ headerShown: false }} />
      <Stack.Screen name="thread" options={{ headerShown: false }} />
    </Stack>
  );
}

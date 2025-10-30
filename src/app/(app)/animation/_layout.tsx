import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

export default function AnimationLayout() {
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
      <Stack.Screen name="reanimated" options={{ headerShown: false }} />
      <Stack.Screen name="gesture" options={{ headerShown: false }} />
      <Stack.Screen name="motify" options={{ headerShown: false }} />
      <Stack.Screen name="lottie" options={{ headerShown: false }} />
    </Stack>
  );
}

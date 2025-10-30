import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

export default function NativeModulesLayout() {
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
      <Stack.Screen name="bridge" options={{ headerShown: false }} />
      <Stack.Screen name="ios" options={{ headerShown: false }} />
      <Stack.Screen name="android" options={{ headerShown: false }} />
      <Stack.Screen name="turbo" options={{ headerShown: false }} />
    </Stack>
  );
}

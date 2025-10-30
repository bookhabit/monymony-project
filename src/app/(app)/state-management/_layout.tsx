import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

export default function StateManagementLayout() {
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
      <Stack.Screen name="redux" options={{ headerShown: false }} />
      <Stack.Screen name="zustand" options={{ headerShown: false }} />
      <Stack.Screen name="recoil" options={{ headerShown: false }} />
      <Stack.Screen name="jotai" options={{ headerShown: false }} />
    </Stack>
  );
}

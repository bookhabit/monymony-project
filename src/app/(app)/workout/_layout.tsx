import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

export default function WorkoutLayout() {
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
      <Stack.Screen name="today" options={{ headerShown: false }} />
      <Stack.Screen name="this-week" options={{ headerShown: false }} />
      <Stack.Screen name="this-month" options={{ headerShown: false }} />
      <Stack.Screen name="exercises" options={{ headerShown: false }} />
    </Stack>
  );
}

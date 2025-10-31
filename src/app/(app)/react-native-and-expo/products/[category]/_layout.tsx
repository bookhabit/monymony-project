import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

export default function CategoryLayout() {
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
      <Stack.Screen name="[productId]" options={{ headerShown: false }} />
    </Stack>
  );
}

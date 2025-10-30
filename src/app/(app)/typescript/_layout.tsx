import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

/**
 * TypeScript Sub-route Layout
 */
export default function TypeScriptLayout() {
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
        name="types"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="generics"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="interfaces"
        options={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="utility-types"
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

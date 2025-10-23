import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '홈' }} />
      <Stack.Screen name="test1" options={{ title: '테스트 스크린 1' }} />
      <Stack.Screen name="test2" options={{ title: '테스트 스크린 2' }} />
    </Stack>
  );
}

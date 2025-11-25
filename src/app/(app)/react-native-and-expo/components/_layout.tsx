import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import CustomHeader from '@/components/layout/CustomHeader';

const screenTitles: Record<string, string> = {
  view: 'View',
  text: 'Text',
  image: 'Image',
  'image-background': 'ImageBackground',
  'text-input': 'TextInput',
  pressable: 'Pressable',
  'scroll-view': 'ScrollView',
  switch: 'Switch',
  flatlist: 'FlatList',
  sectionlist: 'SectionList',
  'virtualized-list': 'VirtualizedList',
  'scroll-flat-section': 'ScrollView & FlatList & SectionList',
  alert: 'Alert',
  animated: 'Animated',
  dimensions: 'Dimensions',
  'keyboard-avoiding-view': 'KeyboardAvoidingView',
  linking: 'Linking',
  modal: 'Modal',
  'pixel-ratio': 'PixelRatio',
  'refresh-control': 'RefreshControl',
  'status-bar': 'StatusBar',
};

export default function ComponentsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        animation: 'slide_from_right',
        presentation: 'card',
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      {Object.entries(screenTitles).map(([name, title]) => (
        <Stack.Screen
          key={name}
          name={name}
          options={{
            header: () => <CustomHeader title={title} showBackButton />,
          }}
        />
      ))}
    </Stack>
  );
}

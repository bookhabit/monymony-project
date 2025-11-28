import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function NativeTabsDemoLayout() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.surface}
      iconColor={{ default: theme.textSecondary, selected: theme.primary }}
      indicatorColor={theme.primary}
      blurEffect="systemMaterial"
      labelVisibilityMode="auto"
    >
      <NativeTabs.Trigger name="tab1">
        <MaterialIcons name="home" size={24} color={theme.text} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab2">
        <MaterialIcons name="search" size={24} color={theme.text} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab3">
        <MaterialIcons name="notifications" size={24} color={theme.text} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab4">
        <MaterialIcons name="person" size={24} color={theme.text} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

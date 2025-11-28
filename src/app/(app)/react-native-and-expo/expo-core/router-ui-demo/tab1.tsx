import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function UITab1Screen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextBox variant="title2" color={theme.text}>
        홈 탭
      </TextBox>
      <TextBox
        variant="body3"
        color={theme.textSecondary}
        style={styles.marginTop}
      >
        Custom Tabs (UI) 데모 - 첫 번째 탭
      </TextBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  marginTop: {
    marginTop: 16,
  },
});

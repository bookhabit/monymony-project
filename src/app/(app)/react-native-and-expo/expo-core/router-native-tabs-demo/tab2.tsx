import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function Tab2Screen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextBox variant="title2" color={theme.text}>
        검색 탭
      </TextBox>
      <TextBox
        variant="body3"
        color={theme.textSecondary}
        style={styles.marginTop}
      >
        Native Tabs 데모 - 두 번째 탭
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

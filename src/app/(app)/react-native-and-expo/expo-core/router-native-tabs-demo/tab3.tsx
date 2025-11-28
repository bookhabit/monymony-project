import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function Tab3Screen() {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextBox variant="title2" color={theme.text}>
        알림 탭
      </TextBox>
      <TextBox
        variant="body3"
        color={theme.textSecondary}
        style={styles.marginTop}
      >
        Native Tabs 데모 - 세 번째 탭 (배지 있음)
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

import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function GraphScreen() {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingBottom: bottom },
      ]}
    >
      <View style={styles.content}>
        <TextBox variant="body2" color={theme.textSecondary}>
          이 화면은 그래프(Graph) 알고리즘을 정리할 수 있는 자리입니다.
        </TextBox>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
});

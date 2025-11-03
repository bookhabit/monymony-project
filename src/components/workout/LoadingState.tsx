import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = '로딩 중...',
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={theme.primary} />
        {message && (
          <TextBox
            variant="body2"
            color={theme.textSecondary}
            style={styles.message}
          >
            {message}
          </TextBox>
        )}
      </View>
    </View>
  );
};

export default LoadingState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
  },
});

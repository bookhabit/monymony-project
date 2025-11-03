import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

const RestDayMessage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.restCard, { backgroundColor: theme.surface }]}>
      <TextBox variant="title3" color={theme.text}>
        🛌 휴식일입니다!
      </TextBox>
      <TextBox
        variant="body3"
        color={theme.textSecondary}
        style={styles.restDesc}
      >
        오늘은 쉬는 날이에요. 내일 새로운 도전을 위해 푹 쉬세요.
      </TextBox>
    </View>
  );
};

export default RestDayMessage;

const styles = StyleSheet.create({
  restCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  restDesc: {
    marginTop: 8,
    textAlign: 'center',
  },
});

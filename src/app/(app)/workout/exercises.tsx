import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

const ExercisesScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="종목별 보기" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              종목별 보기
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              기능 개발 예정...
            </TextBox>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ExercisesScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  section: { padding: 20, borderRadius: 15, marginBottom: 20 },
  heading: { marginBottom: 8 },
});

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from 'react-native';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

import { useAllExercises } from '@/hooks/workout/useAllExercises';

const WorkoutMainScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { exercises, loading, error } = useAllExercises();

  const navigationButtons: {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    route: string;
  }[] = [
    {
      title: '월별 기록 ',
      icon: 'calendar-view-month',
      route: 'workout/this-month',
    },
    {
      title: '주별 기록 ',
      icon: 'calendar-view-week',
      route: 'workout/this-week',
    },
    {
      title: '오늘의 운동',
      icon: 'today',
      route: 'workout/today',
    },
    {
      title: '종목별 보기',
      icon: 'fitness-center',
      route: 'workout/exercises',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="5 x 5 스트렝스 훈련" showBackButton={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.content}>
          <TextBox variant="title3" color={theme.text} style={styles.heading}>
            메인 운동
          </TextBox>
          {/* 전체 운동종목 무게 표시 */}
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <TextBox
                  variant="body2"
                  color={theme.textSecondary}
                  style={styles.loadingText}
                >
                  운동 데이터 로딩 중...
                </TextBox>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={48}
                  color={theme.error}
                />
                <TextBox
                  variant="body2"
                  color={theme.error}
                  style={styles.errorText}
                >
                  {error}
                </TextBox>
              </View>
            ) : exercises.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="inbox"
                  size={48}
                  color={theme.textSecondary}
                />
                <TextBox
                  variant="body2"
                  color={theme.textSecondary}
                  style={styles.emptyText}
                >
                  등록된 운동이 없습니다
                </TextBox>
              </View>
            ) : (
              <View style={styles.exercisesList}>
                {exercises.map((exercise) => (
                  <View
                    key={exercise.id}
                    style={[
                      styles.exerciseRow,
                      {
                        borderBottomColor: theme.border,
                      },
                    ]}
                  >
                    <TextBox
                      variant="body2"
                      color={theme.text}
                      style={styles.exerciseName}
                    >
                      {exercise.name}
                    </TextBox>
                    <TextBox
                      variant="body2"
                      color={theme.primary}
                      style={styles.maxValue}
                    >
                      {exercise.slug === 'pullup'
                        ? exercise.maxReps
                          ? `${exercise.maxReps}개`
                          : '-'
                        : exercise.maxWeight
                          ? `${exercise.maxWeight}kg`
                          : '-'}
                    </TextBox>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 네비게이션 버튼 */}
          <View style={styles.navigationSection}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              운동 기록 보기
            </TextBox>
            <View style={styles.navigationGrid}>
              {navigationButtons.map((button, index) => (
                <Pressable
                  key={index}
                  onPress={() => router.push(`/(app)/${button.route}` as any)}
                  style={({ pressed }) => [
                    styles.navButton,
                    {
                      width: (Dimensions.get('window').width - 60) / 2,
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons
                    name={button.icon}
                    size={32}
                    color={theme.primary}
                  />
                  <TextBox
                    variant="body2"
                    color={theme.text}
                    style={styles.navButtonText}
                  >
                    {button.title}
                  </TextBox>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkoutMainScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  section: { padding: 20, borderRadius: 15, marginBottom: 20 },
  heading: { marginBottom: 16 },
  loadingContainer: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 12 },
  errorContainer: { alignItems: 'center', paddingVertical: 40 },
  errorText: { marginTop: 12, textAlign: 'center' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 12 },
  exercisesList: {
    gap: 0,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  exerciseName: {
    flex: 1,
  },
  maxValue: {
    fontWeight: 'bold',
  },
  navigationSection: {
    paddingBottom: 20,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navButton: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    marginTop: 12,
    textAlign: 'center',
  },
});

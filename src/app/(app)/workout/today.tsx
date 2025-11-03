import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import CustomHeader from '@/components/layout/CustomHeader';
import ErrorState from '@/components/workout/ErrorState';
import ExerciseCard from '@/components/workout/ExerciseCard';
import LoadingState from '@/components/workout/LoadingState';
import RestDayMessage from '@/components/workout/RestDayMessage';
import RoutineHeader from '@/components/workout/RoutineHeader';
import type { SetData } from '@/components/workout/SetInputTable';

import { workoutPalette } from '@/constants/colors';

import { useSaveWorkout } from '@/hooks/workout/useSaveWorkout';
import { useTodayRoutine } from '@/hooks/workout/useTodayRoutine';

import { formatDate, type RoutineCode } from '@/utils/routine';

const TodayScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const params = useLocalSearchParams<{ date?: string }>();
  // 날짜 파라미터가 있으면 해당 날짜, 없으면 오늘
  const today = params.date ? new Date(params.date) : new Date();
  const { routineCode, exercises, loading, error, refetch } =
    useTodayRoutine(today);
  const { saveWorkoutSession } = useSaveWorkout();

  const isToday = !params.date || formatDate(today) === formatDate(new Date());

  // 루틴별 색상 가져오기
  const getRoutineColor = (code: RoutineCode): string => {
    if (code === 'REST') {
      return isDarkMode ? workoutPalette.rest.dark : workoutPalette.rest.light;
    }
    if (code === 'A') {
      return isDarkMode
        ? workoutPalette.routineA.dark
        : workoutPalette.routineA.light;
    }
    if (code === 'B') {
      return isDarkMode
        ? workoutPalette.routineB.dark
        : workoutPalette.routineB.light;
    }
    return isDarkMode
      ? workoutPalette.routineC.dark
      : workoutPalette.routineC.light;
  };

  const routineColor = getRoutineColor(routineCode);
  const workoutBg = isDarkMode
    ? workoutPalette.workoutBg.dark
    : workoutPalette.workoutBg.light;

  // 저장 핸들러
  const handleSave = async (
    exerciseId: number,
    sets: SetData[],
    isUpdate: boolean
  ): Promise<boolean> => {
    return await saveWorkoutSession(routineCode, exerciseId, sets, today);
  };

  if (loading) {
    return <LoadingState message="운동 데이터 로딩 중..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: workoutBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <CustomHeader
        title={isToday ? '오늘의 운동' : formatDate(today)}
        showBackButton
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 날짜 및 루틴 헤더 */}
        <RoutineHeader date={today} routineCode={routineCode} />

        {/* 휴식일 메시지 */}
        {routineCode === 'REST' && <RestDayMessage />}

        {/* 운동 리스트 */}
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            routineColor={routineColor}
            routineCode={routineCode}
            onSave={handleSave}
            refetch={refetch}
          />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TodayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
});

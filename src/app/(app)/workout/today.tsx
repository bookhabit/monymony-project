import React, { useMemo } from 'react';
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
import RestTimer from '@/components/workout/RestTimer';
import RoutineHeader from '@/components/workout/RoutineHeader';
import type { SetData } from '@/components/workout/SetInputTable';

import { useSaveWorkout } from '@/hooks/workout/useSaveWorkout';
import { useTodayRoutine } from '@/hooks/workout/useTodayRoutine';

import { formatDate, type RoutineCode } from '@/utils/routine';

const TodayScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ date?: string; mode?: string }>();
  // 날짜 파라미터가 있으면 해당 날짜, 없으면 오늘 (useMemo로 최적화)
  const today = useMemo(
    () => (params.date ? new Date(params.date) : new Date()),
    [params.date]
  );
  const {
    routineCode: baseRoutineCode,
    exercises,
    loading,
    error,
    refetch,
  } = useTodayRoutine(today);
  const { saveWorkoutSession, deleteWorkoutEntry } = useSaveWorkout();
  const forceRest = params.mode === 'rest';
  const effectiveRoutineCode: RoutineCode =
    forceRest || baseRoutineCode === 'WEEKEND' ? 'REST' : baseRoutineCode;

  const isToday = useMemo(
    () => !params.date || formatDate(today) === formatDate(new Date()),
    [params.date, today]
  );

  // 루틴별 색상 가져오기 (useMemo로 최적화)
  const routineColor = useMemo(() => {
    if (effectiveRoutineCode === 'REST') {
      return theme.rest;
    }
    if (effectiveRoutineCode === 'A') {
      return theme.routineA;
    }
    if (effectiveRoutineCode === 'B') {
      return theme.routineB;
    }
    return theme.routineC;
  }, [effectiveRoutineCode, theme]);

  // 저장 핸들러
  const handleSave = async (
    exerciseId: number,
    sets: SetData[],
    isUpdate: boolean
  ): Promise<boolean> => {
    const success = await saveWorkoutSession(
      effectiveRoutineCode,
      exerciseId,
      sets,
      today
    );
    if (success) {
      // 저장 성공 후 데이터 리패칭
      refetch();
    }
    return success;
  };

  // 삭제 핸들러
  const handleDelete = async (
    exerciseId: number,
    resetRepsOnly: boolean
  ): Promise<boolean> => {
    const success = await deleteWorkoutEntry(
      effectiveRoutineCode,
      exerciseId,
      today,
      resetRepsOnly
    );
    if (success) {
      // 삭제 성공 후 데이터 리패칭
      refetch();
    }
    return success;
  };

  if (loading) {
    return <LoadingState message="운동 데이터 로딩 중..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <CustomHeader
        title={isToday ? '오늘의 운동' : formatDate(today)}
        showBackButton
      />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.workoutBg }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 날짜 및 루틴 헤더 */}
        <RoutineHeader date={today} routineCode={effectiveRoutineCode} />
        {/* 운동 리스트 */}
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            routineColor={routineColor}
            routineCode={effectiveRoutineCode as RoutineCode}
            onSave={handleSave}
            onDelete={handleDelete}
            refetch={refetch}
          />
        ))}

        {/* 휴식일 메시지 */}
        {effectiveRoutineCode === 'REST' && <RestDayMessage />}

        {/* 휴식 타이머 */}
        {effectiveRoutineCode !== 'REST' && <RestTimer defaultSeconds={90} />}
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

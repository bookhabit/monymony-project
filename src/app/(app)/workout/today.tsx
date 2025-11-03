import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

import { workoutPalette } from '@/constants/colors';

import { useSaveWorkout } from '@/hooks/workout/useSaveWorkout';
import { useTodayRoutine } from '@/hooks/workout/useTodayRoutine';

import {
  getRoutineName,
  getDayName,
  formatDate,
  type RoutineCode,
} from '@/utils/routine';

interface SetInput {
  weight: string;
  reps: string;
}

const TodayScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const params = useLocalSearchParams<{ date?: string }>();
  // 날짜 파라미터가 있으면 해당 날짜, 없으면 오늘
  const today = params.date ? new Date(params.date) : new Date();
  const { routineCode, exercises, loading, error, refetch } =
    useTodayRoutine(today);
  const { saveWorkoutSession } = useSaveWorkout();
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [setInputs, setSetInputs] = useState<{
    [exerciseId: number]: SetInput[];
  }>({});
  const [saving, setSaving] = useState(false);

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

  // 운동 드롭다운 토글
  const toggleExercise = (exerciseId: number) => {
    if (expandedExercise === exerciseId) {
      setExpandedExercise(null);
    } else {
      setExpandedExercise(exerciseId);
      // 세트 입력 초기화 (도전 무게로)
      const exercise = exercises.find((e) => e.id === exerciseId);
      if (exercise && !setInputs[exerciseId]) {
        setSetInputs({
          ...setInputs,
          [exerciseId]: Array.from({ length: 5 }, () => ({
            weight: exercise.challengeWeight?.toString() || '',
            reps: '',
          })),
        });
      }
    }
  };

  // 세트 입력 값 변경
  const handleSetInputChange = (
    exerciseId: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const currentInputs = setInputs[exerciseId] || [];
    const newInputs = [...currentInputs];
    newInputs[setIndex] = { ...newInputs[setIndex], [field]: value };

    // 무게는 1세트에 입력하면 나머지 세트도 모두 동일하게 설정
    if (field === 'weight' && setIndex === 0) {
      for (let i = 1; i < newInputs.length; i++) {
        newInputs[i] = { ...newInputs[i], weight: value };
      }
    }

    setSetInputs({
      ...setInputs,
      [exerciseId]: newInputs,
    });
  };

  // 저장
  const handleSave = async (exerciseId: number) => {
    const inputs = setInputs[exerciseId] || [];
    const exercise = exercises.find((e) => e.id === exerciseId);
    const isPullup = exercise?.slug === 'pullup';

    // pullup은 무게 체크 제외, 일반 운동은 무게와 횟수 모두 체크
    const isValid = inputs.every((input) => {
      const repsValid = parseInt(input.reps, 10) > 0;
      if (isPullup) {
        return repsValid;
      }
      return parseFloat(input.weight) > 0 && repsValid;
    });

    if (!isValid) {
      Alert.alert(
        '입력 오류',
        isPullup
          ? '모든 세트에 횟수를 입력해주세요.'
          : '모든 세트에 무게와 횟수를 입력해주세요.'
      );
      return;
    }

    setSaving(true);
    const sets = inputs.map((input, index) => ({
      set: index + 1,
      weight: isPullup ? 0 : parseFloat(input.weight), // pullup은 무게 0으로 저장
      reps: parseInt(input.reps, 10),
    }));

    const success = await saveWorkoutSession(routineCode, exerciseId, sets);

    if (success) {
      Alert.alert('저장 완료', '운동 기록이 저장되었습니다!');
      // 입력값은 유지 (계속 수정 가능)
      refetch?.();
    } else {
      Alert.alert('저장 실패', '운동 기록 저장에 실패했습니다.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <TextBox variant="body2" color={theme.error}>
            {error}
          </TextBox>
        </View>
      </View>
    );
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
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.surface,
              borderLeftWidth: 4,
              borderLeftColor: routineColor,
            },
          ]}
        >
          <TextBox variant="title1" color={theme.text} style={styles.dateText}>
            {formatDate(today)}
          </TextBox>
          <TextBox variant="body2" color={theme.textSecondary}>
            {getDayName(today)}
          </TextBox>
          <View
            style={[
              styles.routineBadge,
              {
                backgroundColor: routineColor + '20',
                padding: 12,
                borderRadius: 12,
              },
            ]}
          >
            <TextBox variant="title2" color={routineColor}>
              {routineCode} 루틴
            </TextBox>
            <TextBox variant="body3" color={theme.textSecondary}>
              {getRoutineName(routineCode)}
            </TextBox>
          </View>
        </View>

        {/* 휴식일 메시지 */}
        {routineCode === 'REST' && (
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
        )}

        {/* 운동 리스트 (드롭다운) */}
        {exercises.map((exercise) => (
          <View
            key={exercise.id}
            style={[
              styles.exerciseCard,
              {
                backgroundColor: theme.surface,
                borderLeftWidth: 3,
                borderLeftColor: routineColor,
              },
            ]}
          >
            {/* 운동 헤더 (클릭 가능) */}
            <Pressable onPress={() => toggleExercise(exercise.id)}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseInfo}>
                  <View style={styles.exerciseTitleRow}>
                    <TextBox
                      variant="title4"
                      color={theme.text}
                      style={styles.exerciseName}
                    >
                      {exercise.name}
                    </TextBox>
                    {/* 5세트 완료 체크 */}
                    {(() => {
                      const inputs = setInputs[exercise.id] || [];
                      const isComplete =
                        inputs.length === 5 &&
                        inputs.every(
                          (input) =>
                            parseFloat(input.weight) > 0 &&
                            parseInt(input.reps, 10) > 0
                        );
                      const completedColor = isDarkMode
                        ? workoutPalette.workoutCompleted.dark
                        : workoutPalette.workoutCompleted.light;
                      return isComplete ? (
                        <MaterialIcons
                          name="check-circle"
                          size={24}
                          color={completedColor}
                        />
                      ) : null;
                    })()}
                  </View>
                  <View style={styles.exerciseStatsRow}>
                    {exercise.slug === 'pullup' ? (
                      <TextBox variant="caption2" color={theme.textSecondary}>
                        최고개수:{' '}
                        {exercise.maxReps ? `${exercise.maxReps}개` : '-'}
                      </TextBox>
                    ) : (
                      <>
                        <TextBox variant="caption2" color={theme.textSecondary}>
                          최근:{' '}
                          {exercise.lastWeight
                            ? `${exercise.lastWeight}kg`
                            : '-'}
                        </TextBox>
                        <TextBox variant="caption2" color={theme.textSecondary}>
                          | 세트/횟수:{' '}
                          {exercise.lastSuccess ? '5set,5reps' : '-'}
                        </TextBox>
                      </>
                    )}
                  </View>
                </View>

                <MaterialIcons
                  name={
                    expandedExercise === exercise.id
                      ? 'expand-less'
                      : 'expand-more'
                  }
                  size={24}
                  color={theme.text}
                />
              </View>
            </Pressable>

            {/* 세트 입력 (드롭다운 콘텐츠) */}
            {expandedExercise === exercise.id && (
              <View style={styles.setsContainer}>
                {/* 헤더 */}
                <View
                  style={[
                    styles.setsHeader,
                    { borderBottomColor: theme.border },
                  ]}
                >
                  <TextBox
                    variant="caption1"
                    color={theme.textSecondary}
                    style={styles.setIndexCol}
                  >
                    세트
                  </TextBox>
                  {exercise.slug !== 'pullup' && (
                    <TextBox
                      variant="caption1"
                      color={theme.textSecondary}
                      style={styles.inputCol}
                    >
                      무게 (kg)
                    </TextBox>
                  )}
                  <TextBox
                    variant="caption1"
                    color={theme.textSecondary}
                    style={styles.inputCol}
                  >
                    횟수
                  </TextBox>
                </View>

                {/* 5세트 입력 */}
                {Array.from({ length: 5 }).map((_, index) => {
                  const inputs = setInputs[exercise.id] || [];
                  const input = inputs[index] || {
                    weight: exercise.challengeWeight?.toString() || '',
                    reps: '',
                  };

                  const isPullup = exercise.slug === 'pullup';

                  return (
                    <View
                      key={index}
                      style={[
                        styles.setRow,
                        { borderBottomColor: theme.border },
                      ]}
                    >
                      <TextBox
                        variant="body2"
                        color={theme.text}
                        style={styles.setIndexCol}
                      >
                        {index + 1}
                      </TextBox>

                      {!isPullup && (
                        <TextInput
                          style={[
                            styles.input,
                            styles.inputCol,
                            {
                              backgroundColor: theme.background,
                              color: theme.text,
                              borderColor: theme.border,
                            },
                          ]}
                          value={input.weight}
                          onChangeText={(value) =>
                            handleSetInputChange(
                              exercise.id,
                              index,
                              'weight',
                              value
                            )
                          }
                          placeholder={
                            exercise.challengeWeight?.toString() || '0'
                          }
                          keyboardType="decimal-pad"
                        />
                      )}

                      <TextInput
                        style={[
                          styles.input,
                          styles.inputCol,
                          {
                            backgroundColor: theme.background,
                            color: theme.text,
                            borderColor: theme.border,
                          },
                        ]}
                        value={input.reps}
                        onChangeText={(value) =>
                          handleSetInputChange(
                            exercise.id,
                            index,
                            'reps',
                            value
                          )
                        }
                        placeholder="5"
                        keyboardType="number-pad"
                      />
                    </View>
                  );
                })}

                {/* 저장 버튼 */}
                <View style={styles.saveButtonContainer}>
                  <CustomButton
                    title={saving ? '저장 중...' : '저장'}
                    onPress={() => handleSave(exercise.id)}
                    disabled={saving}
                    style={{
                      ...styles.saveButton,
                      backgroundColor: routineColor,
                      borderColor: routineColor,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  dateText: {
    marginBottom: 4,
  },
  routineBadge: {
    marginTop: 16,
    alignItems: 'center',
  },
  restCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  restDesc: {
    marginTop: 8,
    textAlign: 'center',
  },
  exerciseCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseName: {
    marginBottom: 4,
  },
  exerciseStatsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  setsContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  setsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingBottom: 8,
    marginBottom: 8,
  },
  setRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  setIndexCol: {
    width: 50,
    textAlign: 'center',
  },
  inputCol: {
    flex: 1,
    marginHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    fontSize: 16,
  },
  saveButtonContainer: {
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
  },
});

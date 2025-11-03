import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import type { SetData } from '@/components/workout/SetInputTable';

import { workoutPalette } from '@/constants/colors';

import type { RoutineExercise } from '@/hooks/workout/useTodayRoutine';

interface SetInput {
  weight: string;
  reps: string;
}

interface ExerciseCardProps {
  exercise: RoutineExercise;
  routineColor: string;
  routineCode: string;
  onSave: (
    exerciseId: number,
    sets: SetData[],
    isUpdate: boolean
  ) => Promise<boolean>;
  refetch?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  routineColor,
  routineCode,
  onSave,
  refetch,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [setInputs, setSetInputs] = useState<SetInput[]>([]);
  const [saving, setSaving] = useState(false);

  // 저장된 데이터가 있으면 초기화 시 채우기
  useEffect(() => {
    if (
      exercise.hasSavedData &&
      exercise.savedSets &&
      exercise.savedSets.length > 0
    ) {
      const saved = exercise.savedSets.map((set) => ({
        weight: exercise.slug === 'pullup' ? '' : set.weight.toString(),
        reps: set.reps.toString(),
      }));
      // 5세트로 채우기 (부족한 세트는 빈 값으로)
      const padded = Array.from(
        { length: 5 },
        (_, i) => saved[i] || { weight: '', reps: '' }
      );
      setSetInputs(padded);
    } else {
      // 저장된 데이터가 없으면 placeholder로 초기화
      setSetInputs(
        Array.from({ length: 5 }, () => ({
          weight: exercise.challengeWeight?.toString() || '',
          reps: '',
        }))
      );
    }
  }, [
    exercise.hasSavedData,
    exercise.savedSets,
    exercise.challengeWeight,
    exercise.slug,
  ]);

  const toggleExercise = () => {
    setExpanded(!expanded);
  };

  const handleSetInputChange = (
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const newInputs = [...setInputs];
    newInputs[setIndex] = { ...newInputs[setIndex], [field]: value };

    // 무게는 1세트에 입력하면 나머지 세트도 모두 동일하게 설정
    if (field === 'weight' && setIndex === 0 && exercise.slug !== 'pullup') {
      for (let i = 1; i < newInputs.length; i++) {
        newInputs[i] = { ...newInputs[i], weight: value };
      }
    }

    setSetInputs(newInputs);
  };

  const handleSave = async () => {
    const isPullup = exercise.slug === 'pullup';

    // pullup은 무게 체크 제외, 일반 운동은 무게와 횟수 모두 체크
    const isValid = setInputs.every((input) => {
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
    const sets: SetData[] = setInputs.map((input, index) => ({
      set: index + 1,
      weight: isPullup ? 0 : parseFloat(input.weight),
      reps: parseInt(input.reps, 10),
    }));

    const success = await onSave(
      exercise.id,
      sets,
      exercise.hasSavedData || false
    );

    if (success) {
      Alert.alert(
        '저장 완료',
        exercise.hasSavedData
          ? '운동 기록이 수정되었습니다!'
          : '운동 기록이 저장되었습니다!'
      );
      refetch?.();
    } else {
      Alert.alert('저장 실패', '운동 기록 저장에 실패했습니다.');
    }

    setSaving(false);
  };

  const isComplete =
    setInputs.length === 5 &&
    setInputs.every((input) => {
      if (exercise.slug === 'pullup') {
        return parseInt(input.reps, 10) > 0;
      }
      return parseFloat(input.weight) > 0 && parseInt(input.reps, 10) > 0;
    });

  const completedColor = isDarkMode
    ? workoutPalette.workoutCompleted.dark
    : workoutPalette.workoutCompleted.light;

  return (
    <View
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
      <Pressable onPress={toggleExercise}>
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
              {isComplete && (
                <MaterialIcons
                  name="check-circle"
                  size={24}
                  color={completedColor}
                />
              )}
            </View>
            <View style={styles.exerciseStatsRow}>
              {exercise.slug === 'pullup' ? (
                <TextBox variant="caption2" color={theme.textSecondary}>
                  최고개수: {exercise.maxReps ? `${exercise.maxReps}개` : '-'}
                </TextBox>
              ) : (
                <>
                  <TextBox variant="caption2" color={theme.textSecondary}>
                    최근:{' '}
                    {exercise.lastWeight ? `${exercise.lastWeight}kg` : '-'}
                  </TextBox>
                  <TextBox variant="caption2" color={theme.textSecondary}>
                    | 세트/횟수: {exercise.lastSuccess ? '5set,5reps' : '-'}
                  </TextBox>
                </>
              )}
            </View>
          </View>

          <MaterialIcons
            name={expanded ? 'expand-less' : 'expand-more'}
            size={24}
            color={theme.text}
          />
        </View>
      </Pressable>

      {/* 세트 입력 (드롭다운 콘텐츠) */}
      {expanded && (
        <View style={styles.setsContainer}>
          {/* 헤더 */}
          <View
            style={[styles.setsHeader, { borderBottomColor: theme.border }]}
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
            const input = setInputs[index] || {
              weight: exercise.challengeWeight?.toString() || '',
              reps: '',
            };

            const isPullup = exercise.slug === 'pullup';

            return (
              <View
                key={index}
                style={[styles.setRow, { borderBottomColor: theme.border }]}
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
                      handleSetInputChange(index, 'weight', value)
                    }
                    placeholder={exercise.challengeWeight?.toString() || '0'}
                    placeholderTextColor={theme.textSecondary}
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
                    handleSetInputChange(index, 'reps', value)
                  }
                  placeholder="5"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                />
              </View>
            );
          })}

          {/* 저장/수정 버튼 */}
          <View style={styles.saveButtonContainer}>
            <CustomButton
              title={
                saving
                  ? '저장 중...'
                  : exercise.hasSavedData
                    ? '수정하기'
                    : '저장'
              }
              onPress={handleSave}
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
  );
};

export default ExerciseCard;

const styles = StyleSheet.create({
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

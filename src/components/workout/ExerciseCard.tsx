import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import type { SetData } from '@/components/workout/SetInputTable';

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
  onDelete?: (exerciseId: number, resetRepsOnly: boolean) => Promise<boolean>;
  refetch?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  routineColor,
  routineCode,
  onSave,
  onDelete,
  refetch,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
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

  const handleViewHistory = () => {
    router.push({
      pathname: '/(app)/workout/exercises',
      params: { exerciseId: exercise.id.toString() },
    } as any);
  };

  const handleSetInputChange = (
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const newInputs = [...setInputs];
    newInputs[setIndex] = { ...newInputs[setIndex], [field]: value };

    // 무게는 1세트에 입력하면 나머지 세트도 모두 동일하게 설정 (pullup 제외)
    if (field === 'weight' && exercise.slug !== 'pullup') {
      const weightValue = setIndex === 0 ? value : newInputs[0].weight;
      // 1세트의 무게를 기준으로 모든 세트에 동일하게 적용
      for (let i = 0; i < newInputs.length; i++) {
        newInputs[i] = { ...newInputs[i], weight: weightValue };
      }
    }

    setSetInputs(newInputs);
  };

  const handleSave = async () => {
    const isPullup = exercise.slug === 'pullup';

    // 1세트의 무게 가져오기 (pullup 제외)
    const firstSetWeight = isPullup
      ? 0
      : parseFloat(setInputs[0]?.weight || '0');

    // 1세트에 무게가 없으면 에러
    if (!isPullup && (firstSetWeight <= 0 || isNaN(firstSetWeight))) {
      Alert.alert('입력 오류', '1세트에 무게를 입력해주세요.');
      return;
    }

    // 입력된 세트만 필터링 (1세트 이상 입력된 것만)
    const validSets: SetData[] = [];
    setInputs.forEach((input, index) => {
      const reps = parseInt(input.reps, 10);

      // 횟수가 0보다 크면 유효한 세트
      if (reps > 0) {
        validSets.push({
          set: index + 1,
          weight: isPullup ? 0 : firstSetWeight, // 모든 세트에 1세트 무게 적용
          reps: reps,
        });
      }
    });

    // 최소 1세트 이상 입력되어야 저장 가능
    if (validSets.length === 0) {
      Alert.alert(
        '입력 오류',
        isPullup
          ? '최소 1세트 이상 횟수를 입력해주세요.'
          : '최소 1세트 이상 횟수를 입력해주세요.'
      );
      return;
    }

    setSaving(true);

    const success = await onSave(
      exercise.id,
      validSets,
      exercise.hasSavedData || false
    );

    if (success) {
      Alert.alert('저장 완료', `${validSets.length}세트 저장되었습니다!`);
      refetch?.();
    } else {
      Alert.alert('저장 실패', '운동 기록 저장에 실패했습니다.');
    }

    setSaving(false);
  };

  const handleDelete = async (resetRepsOnly: boolean) => {
    if (!onDelete) return;

    const action = resetRepsOnly ? '횟수만 초기화' : '전체 삭제';
    Alert.alert(
      '기록 초기화',
      `정말로 이 날짜의 ${exercise.name} 기록을 ${action}하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            const success = await onDelete(exercise.id, resetRepsOnly);
            if (success) {
              Alert.alert('완료', `기록이 ${action}되었습니다.`);
              refetch?.();
            } else {
              Alert.alert('실패', '기록 초기화에 실패했습니다.');
            }
            setSaving(false);
          },
        },
      ]
    );
  };

  // 3세트 이상 완료 체크
  const completedSets = setInputs.filter((input) => {
    if (exercise.slug === 'pullup') {
      return parseInt(input.reps, 10) > 0;
    }
    return parseFloat(input.weight) > 0 && parseInt(input.reps, 10) > 0;
  });

  const isComplete = completedSets.length >= 3;

  const completedColor = theme.workoutCompleted;

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
              {/* 3세트 이상 완료 체크 */}
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
                  최고 개수: {exercise.maxReps ? `${exercise.maxReps}개` : '-'}
                </TextBox>
              ) : (
                <TextBox variant="caption2" color={theme.textSecondary}>
                  최근 중량:{' '}
                  {exercise.lastWeight ? `${exercise.lastWeight}kg` : '-'}
                </TextBox>
              )}

              <Pressable
                onPress={handleViewHistory}
                style={({ pressed }) => [
                  styles.historyButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <MaterialIcons name="history" size={16} color={routineColor} />
                <TextBox variant="caption2" color={theme.textSecondary}>
                  지난 운동기록
                </TextBox>
              </Pressable>
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
            // 무게는 1세트 입력값을 모든 세트에 표시 (pullup 제외)
            const displayWeight = isPullup
              ? ''
              : setInputs[0]?.weight ||
                exercise.challengeWeight?.toString() ||
                '';

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
                  <>
                    {index === 0 ? (
                      // 1세트: 입력 가능
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
                          handleSetInputChange(0, 'weight', value)
                        }
                        placeholder={
                          exercise.challengeWeight?.toString() || '0'
                        }
                        placeholderTextColor={theme.placeholder}
                        keyboardType="decimal-pad"
                      />
                    ) : (
                      // 2-5세트: 읽기 전용 (1세트 값 표시)
                      <View
                        style={[
                          styles.input,
                          styles.inputCol,
                          {
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <TextBox
                          variant="caption1"
                          color={theme.text}
                          style={styles.readOnlyText}
                        >
                          {displayWeight}
                        </TextBox>
                      </View>
                    )}
                  </>
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
                  placeholderTextColor={theme.placeholder}
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

          {/* 초기화 버튼 (저장된 데이터가 있을 때만 표시) */}
          {exercise.hasSavedData && onDelete && (
            <View style={styles.deleteButtonContainer}>
              <Pressable
                onPress={() => handleDelete(true)}
                disabled={saving}
                style={({ pressed }) => [
                  styles.deleteButton,
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: theme.error + '20',
                    borderColor: theme.error,
                  },
                ]}
              >
                <MaterialIcons name="refresh" size={16} color={theme.error} />
                <TextBox variant="caption2" color={theme.error}>
                  횟수만 초기화
                </TextBox>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(false)}
                disabled={saving}
                style={({ pressed }) => [
                  styles.deleteButton,
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: theme.error + '20',
                    borderColor: theme.error,
                  },
                ]}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={16}
                  color={theme.error}
                />
                <TextBox variant="caption2" color={theme.error}>
                  전체 삭제
                </TextBox>
              </Pressable>
            </View>
          )}
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
    alignItems: 'center',
    gap: 8,
  },

  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  readOnlyText: {
    textAlign: 'center',
  },
  saveButtonContainer: {
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});

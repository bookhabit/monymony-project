import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import type { WeekendExerciseType } from '@/db/weekendWorkoutRepository';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

import type {
  BodyweightExerciseState,
  BodyweightExerciseSet,
} from '@/hooks/workout/useBodyweightWorkout';

interface BodyweightExerciseCardProps {
  exercise: BodyweightExerciseState;
  onSave: (
    type: WeekendExerciseType,
    sets: {
      setIndex: number;
      durationSeconds?: number | null;
      reps?: number | null;
      floors?: number | null;
    }[]
  ) => Promise<boolean>;
  onDelete: (type: WeekendExerciseType) => Promise<boolean>;
}

interface SetInputState {
  setIndex: number;
  value: string;
}

const MAX_SETS = 10;

const valueKeyMap: Record<
  WeekendExerciseType,
  'durationSeconds' | 'reps' | 'floors'
> = {
  hang: 'durationSeconds',
  pushup: 'reps',
  handstand_pushup: 'reps',
  stairs: 'floors',
};

const numericValidationMessage: Record<WeekendExerciseType, string> = {
  hang: '초 단위 숫자를 입력해주세요.',
  pushup: '횟수는 숫자로 입력해주세요.',
  handstand_pushup: '횟수는 숫자로 입력해주세요.',
  stairs: '층수는 숫자로 입력해주세요.',
};

const BodyweightExerciseCard: React.FC<BodyweightExerciseCardProps> = ({
  exercise,
  onSave,
  onDelete,
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [setInputs, setSetInputs] = useState<SetInputState[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (exercise.sets.length > 0) {
      setSetInputs(
        exercise.sets.map((set) => ({
          setIndex: set.set,
          value: resolveValueString(exercise.type, set),
        }))
      );
    } else {
      setSetInputs([{ setIndex: 1, value: '' }]);
    }
  }, [exercise.sets, exercise.type]);

  const hasAnyInput = useMemo(
    () => setInputs.some((input) => input.value.trim().length > 0),
    [setInputs]
  );

  const handleValueChange = (setIndex: number, value: string) => {
    setSetInputs((prev) =>
      prev.map((item) =>
        item.setIndex === setIndex ? { ...item, value } : item
      )
    );
  };

  const handleAddSet = () => {
    setSetInputs((prev) => {
      if (prev.length >= MAX_SETS) return prev;
      const nextIndex =
        prev.length > 0 ? prev[prev.length - 1].setIndex + 1 : 1;
      return [...prev, { setIndex: nextIndex, value: '' }];
    });
  };

  const handleRemoveSet = (setIndex: number) => {
    setSetInputs((prev) => {
      if (prev.length <= 1) {
        return [{ setIndex: 1, value: '' }];
      }
      return prev.filter((item) => item.setIndex !== setIndex);
    });
  };

  const handleSave = async () => {
    const valueKey = valueKeyMap[exercise.type];
    const validSets = setInputs
      .map((input, idx) => {
        const parsed = parseInt(input.value, 10);
        if (isNaN(parsed) || parsed <= 0) {
          return null;
        }
        return {
          set: idx + 1,
          durationSeconds: valueKey === 'durationSeconds' ? parsed : null,
          reps: valueKey === 'reps' ? parsed : null,
          floors: valueKey === 'floors' ? parsed : null,
        };
      })
      .filter(Boolean) as BodyweightExerciseSet[];

    if (validSets.length === 0) {
      Alert.alert('입력 필요', numericValidationMessage[exercise.type]);
      return;
    }

    try {
      setSaving(true);
      await onSave(
        exercise.type,
        validSets.map((set) => ({
          setIndex: set.set,
          durationSeconds: set.durationSeconds ?? null,
          reps: set.reps ?? null,
          floors: set.floors ?? null,
        }))
      );
      Alert.alert('저장 완료', `${exercise.name} 기록이 저장되었습니다.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '맨몸 운동 저장에 실패했습니다.';
      Alert.alert('저장 실패', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!exercise.hasSavedData && !hasAnyInput) {
      setSetInputs([{ setIndex: 1, value: '' }]);
      return;
    }

    Alert.alert('기록 삭제', `${exercise.name} 기록을 모두 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            setSaving(true);
            await onDelete(exercise.type);
            Alert.alert('삭제 완료', `${exercise.name} 기록이 삭제되었습니다.`);
            setSetInputs([{ setIndex: 1, value: '' }]);
          } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : '맨몸 운동 삭제에 실패했습니다.';
            Alert.alert('삭제 실패', message);
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const toggleExercise = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      {/* 운동 헤더 (클릭 가능) */}
      <Pressable onPress={toggleExercise}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TextBox variant="title3" color={theme.text}>
              {exercise.name}
            </TextBox>
            <TextBox variant="caption2" color={theme.textSecondary}>
              {exercise.description}
            </TextBox>
          </View>
          <View style={styles.headerRight}>
            {exercise.helperText ? (
              <View style={styles.helperChip}>
                <MaterialIcons
                  name="info-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <TextBox variant="caption3" color={theme.textSecondary}>
                  {exercise.helperText}
                </TextBox>
              </View>
            ) : null}
            <MaterialIcons
              name={expanded ? 'expand-less' : 'expand-more'}
              size={24}
              color={theme.text}
            />
          </View>
        </View>
      </Pressable>

      {/* 세트 입력 (드롭다운 콘텐츠) */}
      {expanded && (
        <>
          <View style={styles.setContainer}>
            {setInputs.map((setInput, index) => (
              <View key={setInput.setIndex} style={styles.setRow}>
                <TextBox variant="body3" color={theme.text}>
                  {setInput.setIndex}세트
                </TextBox>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.border,
                      color: theme.text,
                      backgroundColor: theme.background,
                    },
                  ]}
                  keyboardType="number-pad"
                  value={setInput.value}
                  placeholder={`값 입력 (${exercise.valueUnit})`}
                  placeholderTextColor={theme.textSecondary}
                  onChangeText={(value) =>
                    handleValueChange(setInput.setIndex, value)
                  }
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.setAction,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => handleRemoveSet(setInput.setIndex)}
                >
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={theme.textSecondary}
                  />
                </Pressable>
              </View>
            ))}

            <Pressable
              style={({ pressed }) => [
                styles.addSetButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handleAddSet}
            >
              <MaterialIcons
                name="add-circle-outline"
                size={20}
                color={theme.primary}
              />
              <TextBox variant="body3" color={theme.primary}>
                세트 추가
              </TextBox>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="기록 삭제"
              variant="outline"
              onPress={handleDelete}
              disabled={saving}
            />
            <CustomButton
              title="기록 저장"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
            />
          </View>

          {exercise.latestHistory ? (
            <View style={styles.history}>
              <TextBox variant="caption2" color={theme.textSecondary}>
                마지막 기록: {exercise.latestHistory.date}
              </TextBox>
              <View style={styles.historySets}>
                {exercise.latestHistory.sets.map((set) => (
                  <TextBox
                    key={set.set}
                    variant="caption3"
                    color={theme.textSecondary}
                  >
                    {set.set}세트:{' '}
                    {resolveValueString(exercise.type, {
                      set: set.set,
                      durationSeconds: set.durationSeconds ?? undefined,
                      reps: set.reps ?? undefined,
                      floors: set.floors ?? undefined,
                    })}
                    {exercise.valueUnit}
                  </TextBox>
                ))}
              </View>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};

export default BodyweightExerciseCard;

function resolveValueString(
  type: WeekendExerciseType,
  set: BodyweightExerciseSet
) {
  if (type === 'hang') {
    return set.durationSeconds?.toString() ?? '';
  }
  if (type === 'stairs') {
    return set.floors?.toString() ?? '';
  }
  return set.reps?.toString() ?? '';
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helperChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  setContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  setAction: {
    padding: 4,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },
  history: {
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    gap: 6,
  },
  historySets: {
    gap: 4,
  },
});

import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import type { WeekendExerciseType } from '@/db/weekendWorkoutRepository';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

import type {
  WeekendExerciseState,
  WeekendExerciseSet,
} from '@/hooks/workout/useWeekendWorkout';

interface WeekendExerciseCardProps {
  exercise: WeekendExerciseState;
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

const WeekendExerciseCard: React.FC<WeekendExerciseCardProps> = ({
  exercise,
  onSave,
  onDelete,
}) => {
  const { theme } = useTheme();
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
      .filter(Boolean) as WeekendExerciseSet[];

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
        err instanceof Error ? err.message : '주말 운동 저장에 실패했습니다.';
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
                : '주말 운동 삭제에 실패했습니다.';
            Alert.alert('삭제 실패', message);
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
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
      <View style={styles.header}>
        <View>
          <TextBox variant="title3" color={theme.text}>
            {exercise.name}
          </TextBox>
          <TextBox variant="caption2" color={theme.textSecondary}>
            {exercise.description}
          </TextBox>
        </View>
        <TextBox variant="caption1" color={theme.textSecondary}>
          단위: {exercise.valueUnit}
        </TextBox>
      </View>

      <View style={styles.content}>
        {exercise.latestHistory && (
          <View
            style={[
              styles.latestWrapper,
              {
                borderColor: theme.border,
                backgroundColor: theme.background,
              },
            ]}
          >
            <TextBox variant="caption1" color={theme.textSecondary}>
              최근 기록 ({exercise.latestHistory.date})
            </TextBox>
            <View style={styles.latestList}>
              {exercise.latestHistory.sets.map((set) => {
                const value =
                  set.durationSeconds ?? set.reps ?? set.floors ?? 0;
                return (
                  <TextBox key={set.set} variant="caption2" color={theme.text}>
                    {set.set}세트: {value}
                    {exercise.valueUnit}
                  </TextBox>
                );
              })}
            </View>
          </View>
        )}

        {setInputs.map((set) => (
          <View key={set.setIndex} style={styles.setRow}>
            <TextBox
              variant="body3"
              color={theme.textSecondary}
              style={styles.setLabel}
            >
              {set.setIndex}세트
            </TextBox>
            <TextInput
              keyboardType="numeric"
              value={set.value}
              onChangeText={(value) => handleValueChange(set.setIndex, value)}
              placeholder={`${exercise.valueUnit} 입력`}
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                {
                  borderColor: theme.border,
                  color: theme.text,
                  backgroundColor: theme.background,
                },
              ]}
            />
            <Pressable
              onPress={() => handleRemoveSet(set.setIndex)}
              disabled={setInputs.length <= 1}
              style={({ pressed }) => [
                styles.removeButton,
                {
                  opacity: pressed ? 0.6 : setInputs.length <= 1 ? 0.3 : 1,
                },
              ]}
            >
              <MaterialIcons
                name="remove-circle-outline"
                size={20}
                color={theme.error}
              />
            </Pressable>
          </View>
        ))}

        {setInputs.length < MAX_SETS && (
          <Pressable
            onPress={handleAddSet}
            style={({ pressed }) => [
              styles.addSetButton,
              {
                borderColor: theme.border,
                backgroundColor: theme.background,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <MaterialIcons name="add" size={18} color={theme.textSecondary} />
            <TextBox variant="caption3" color={theme.textSecondary}>
              세트 추가
            </TextBox>
          </Pressable>
        )}

        {exercise.helperText && (
          <TextBox
            variant="caption3"
            color={theme.textSecondary}
            style={styles.helperText}
          >
            {exercise.helperText}
          </TextBox>
        )}
      </View>

      <View style={styles.footer}>
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
    </View>
  );
};

function resolveValueString(
  type: WeekendExerciseType,
  set: WeekendExerciseSet
): string {
  const key = valueKeyMap[type];
  const value =
    key === 'durationSeconds'
      ? set.durationSeconds
      : key === 'reps'
        ? set.reps
        : set.floors;
  return value != null ? String(value) : '';
}

export default WeekendExerciseCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    gap: 12,
  },
  latestWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  latestList: {
    gap: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  setLabel: {
    width: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  removeButton: {
    padding: 6,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
  },
  helperText: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
});

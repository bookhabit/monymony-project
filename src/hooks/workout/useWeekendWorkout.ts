import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  deleteWeekendExerciseEntries,
  getWeekendEntriesByDate,
  getLatestWeekendHistory,
  replaceWeekendExerciseEntries,
  type WeekendExerciseType,
  type WeekendSetInput,
} from '@/db/weekendWorkoutRepository';

import { formatDate } from '@/utils/routine';

export interface WeekendExerciseSet {
  set: number;
  durationSeconds?: number | null;
  reps?: number | null;
  floors?: number | null;
}

export interface WeekendExerciseState {
  type: WeekendExerciseType;
  name: string;
  description: string;
  valueUnit: string;
  helperText?: string;
  sets: WeekendExerciseSet[];
  hasSavedData: boolean;
  latestHistory?: {
    date: string;
    sets: WeekendExerciseSet[];
  };
}

const WEEKEND_EXERCISES_CONFIG: Record<
  WeekendExerciseType,
  Omit<WeekendExerciseState, 'type' | 'sets' | 'hasSavedData'>
> = {
  hang: {
    name: '철봉 매달리기',
    description: '세트별 매달린 시간을 기록하세요',
    valueUnit: '초',
    helperText: '1세트에 매달린 시간을 초 단위로 입력',
  },
  pushup: {
    name: '푸쉬업',
    description: '세트별 횟수를 기록하세요',
    valueUnit: '회',
  },
  handstand_pushup: {
    name: '물구나무 푸쉬업',
    description: '세트별 횟수를 기록하세요',
    valueUnit: '회',
  },
  stairs: {
    name: '계단 오르기',
    description: '세트별로 오른 층수를 기록하세요',
    valueUnit: '층',
    helperText: '예: 10층까지 올랐다면 10을 입력',
  },
};

const ORDER: WeekendExerciseType[] = [
  'hang',
  'pushup',
  'handstand_pushup',
  'stairs',
];

export function useWeekendWorkout(targetDate: Date = new Date()) {
  const [exercises, setExercises] = useState<WeekendExerciseState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formattedDate = useMemo(() => formatDate(targetDate), [targetDate]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getWeekendEntriesByDate(formattedDate);

      const grouped = new Map<WeekendExerciseType, WeekendExerciseSet[]>();
      for (const type of ORDER) {
        grouped.set(type, []);
      }

      rows.forEach((row) => {
        const sets = grouped.get(row.exercise_type as WeekendExerciseType);
        if (!sets) return;
        sets.push({
          set: row.set_index,
          durationSeconds: row.duration_seconds,
          reps: row.reps,
          floors: row.floors,
        });
      });

      const next: WeekendExerciseState[] = await Promise.all(
        ORDER.map(async (type) => {
          const config = WEEKEND_EXERCISES_CONFIG[type];
          const sets = grouped
            .get(type)
            ?.sort((a, b) => a.set - b.set) ?? [];

          const latestHistory = await getLatestWeekendHistory(type);

          return {
            type,
            ...config,
            sets,
            hasSavedData: sets.length > 0,
            latestHistory: latestHistory
              ? {
                  date: latestHistory.date,
                  sets: latestHistory.sets.map((set) => ({
                    set: set.setIndex,
                    durationSeconds: set.durationSeconds,
                    reps: set.reps,
                    floors: set.floors,
                  })),
                }
              : undefined,
          };
        })
      );

      setExercises(next);
      setError(null);
    } catch (err) {
      console.error('주말 운동 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '주말 운동 로드 실패');
    } finally {
      setLoading(false);
    }
  }, [formattedDate]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveExercise = useCallback(
    async (type: WeekendExerciseType, sets: WeekendSetInput[]) => {
      try {
        await replaceWeekendExerciseEntries(formattedDate, type, sets);
        await load();
        return true;
      } catch (err) {
        console.error('주말 운동 저장 실패:', err);
        setError(err instanceof Error ? err.message : '주말 운동 저장 실패');
        throw err;
      }
    },
    [formattedDate, load]
  );

  const deleteExercise = useCallback(
    async (type: WeekendExerciseType) => {
      try {
        await deleteWeekendExerciseEntries(formattedDate, type);
        await load();
        return true;
      } catch (err) {
        console.error('주말 운동 삭제 실패:', err);
        setError(err instanceof Error ? err.message : '주말 운동 삭제 실패');
        throw err;
      }
    },
    [formattedDate, load]
  );

  return {
    date: formattedDate,
    exercises,
    loading,
    error,
    saveExercise,
    deleteExercise,
    refresh: load,
  };
}

export const WEEKEND_EXERCISES = ORDER.map((type) => ({
  type,
  ...WEEKEND_EXERCISES_CONFIG[type],
}));


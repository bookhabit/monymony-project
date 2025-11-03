import { useEffect, useState, useCallback } from 'react';

import * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/db/setupDatabase';

export interface ExerciseSummary {
  id: number;
  slug: string;
  name: string;
  muscle_group: string;
  maxWeight: number | null;
  maxReps: number | null;
}

/**
 * 전체 운동종목 데이터 조회 훅
 */
export function useAllExercises() {
  const [exercises, setExercises] = useState<ExerciseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllExercises = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDatabase();

      // 1. 전체 운동 목록 조회
      const allExercises = await db.getAllAsync<{
        id: number;
        slug: string;
        name: string;
        muscle_group: string;
      }>(
        `SELECT id, slug, name, muscle_group FROM exercises 
         WHERE slug IN ('pullup', 'bench_press', 'deadlift', 'squat', 'military_press')
         ORDER BY 
           CASE 
             WHEN slug = 'pullup' THEN 1
             WHEN slug = 'bench_press' THEN 2
             WHEN slug = 'deadlift' THEN 3
             WHEN slug = 'squat' THEN 4
             WHEN slug = 'military_press' THEN 5
           END`
      );

      // 2. 각 운동별 최대 무게(또는 reps) 조회
      const exercisesWithHistory = await Promise.all(
        allExercises.map(async (exercise) => {
          // workout_entries에서 해당 운동의 모든 기록 조회
          const entries = await db.getAllAsync<{
            weight: number;
            reps: number;
          }>(
            `SELECT we.weight, we.reps 
             FROM workout_entries we
             WHERE we.exercise_id = ?`,
            [exercise.id]
          );

          if (entries.length === 0) {
            return {
              id: exercise.id,
              slug: exercise.slug,
              name: exercise.name,
              muscle_group: exercise.muscle_group,
              maxWeight: null,
              maxReps: null,
            };
          }

          // 풀업은 최대 reps, 나머지는 최대 무게
          if (exercise.slug === 'pullup') {
            const maxReps = Math.max(...entries.map((e) => e.reps));
            return {
              id: exercise.id,
              slug: exercise.slug,
              name: exercise.name,
              muscle_group: exercise.muscle_group,
              maxWeight: null,
              maxReps,
            };
          } else {
            const maxWeight = Math.max(...entries.map((e) => e.weight));
            return {
              id: exercise.id,
              slug: exercise.slug,
              name: exercise.name,
              muscle_group: exercise.muscle_group,
              maxWeight,
              maxReps: null,
            };
          }
        })
      );

      setExercises(exercisesWithHistory);
      setError(null);
    } catch (err) {
      console.error('전체 운동 조회 실패:', err);
      setError(err instanceof Error ? err.message : '조회 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllExercises();
  }, [fetchAllExercises]);

  return { exercises, loading, error, refetch: fetchAllExercises };
}

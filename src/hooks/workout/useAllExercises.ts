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
  // 월별 통계 (startDate, endDate가 있을 때만)
  monthStartWeight?: number | null;
  monthStartReps?: number | null;
  monthMaxWeight?: number | null;
  monthMaxReps?: number | null;
}

interface UseAllExercisesOptions {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

/**
 * 전체 운동종목 데이터 조회 훅
 * @param options startDate, endDate를 제공하면 월별 통계도 함께 조회
 */
export function useAllExercises(options?: UseAllExercisesOptions) {
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
          // 전체 기록 조회 (최대값 계산용)
          const allEntries = await db.getAllAsync<{
            weight: number;
            reps: number;
          }>(
            `SELECT we.weight, we.reps 
             FROM workout_entries we
             JOIN workout_sessions ws ON we.session_id = ws.id
             WHERE we.exercise_id = ?`,
            [exercise.id]
          );

          // 전체 최대값 계산
          let maxWeight: number | null = null;
          let maxReps: number | null = null;

          if (allEntries.length > 0) {
            if (exercise.slug === 'pullup') {
              maxReps = Math.max(...allEntries.map((e) => e.reps));
            } else {
              maxWeight = Math.max(...allEntries.map((e) => e.weight));
            }
          }

          // 월별 통계 계산 (날짜 범위가 있을 때)
          let monthStartWeight: number | null = null;
          let monthStartReps: number | null = null;
          let monthMaxWeight: number | null = null;
          let monthMaxReps: number | null = null;

          if (options?.startDate && options?.endDate) {
            // 이번달 기록 조회
            const monthEntries = await db.getAllAsync<{
              weight: number;
              reps: number;
            }>(
              `SELECT we.weight, we.reps 
               FROM workout_entries we
               JOIN workout_sessions ws ON we.session_id = ws.id
               WHERE we.exercise_id = ? 
                 AND ws.date >= ? 
                 AND ws.date <= ?`,
              [exercise.id, options.startDate, options.endDate]
            );

            if (monthEntries.length > 0) {
              // 이번달 첫 기록 조회
              const firstEntry = await db.getFirstAsync<{
                weight: number;
                reps: number;
              }>(
                `SELECT we.weight, we.reps 
                 FROM workout_entries we
                 JOIN workout_sessions ws ON we.session_id = ws.id
                 WHERE we.exercise_id = ? 
                   AND ws.date >= ? 
                   AND ws.date <= ?
                 ORDER BY ws.date ASC, we.set_index ASC
                 LIMIT 1`,
                [exercise.id, options.startDate, options.endDate]
              );

              // 이번달 최대값 및 시작값 계산
              if (exercise.slug === 'pullup') {
                monthMaxReps = Math.max(...monthEntries.map((e) => e.reps));
                if (firstEntry) {
                  monthStartReps = firstEntry.reps;
                }
              } else {
                monthMaxWeight = Math.max(...monthEntries.map((e) => e.weight));
                if (firstEntry) {
                  monthStartWeight = firstEntry.weight;
                }
              }
            }
          }

          return {
            id: exercise.id,
            slug: exercise.slug,
            name: exercise.name,
            muscle_group: exercise.muscle_group,
            maxWeight,
            maxReps,
            monthStartWeight,
            monthStartReps,
            monthMaxWeight,
            monthMaxReps,
          };
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
  }, [options?.startDate, options?.endDate]);

  useEffect(() => {
    fetchAllExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAllExercises]);

  return { exercises, loading, error, refetch: fetchAllExercises };
}

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

  console.log('options', options);

  const fetchAllExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const db = await getDatabase();

      if (!db) {
        throw new Error('데이터베이스 연결 실패');
      }

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

      if (!allExercises || allExercises.length === 0) {
        setExercises([]);
        setLoading(false);
        return;
      }

      // 2. 각 운동별 최대 무게(또는 reps) 조회
      const exercisesWithHistory = await Promise.all(
        allExercises.map(async (exercise) => {
          try {
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

            console.log('allEntries', allEntries);

            // 전체 최대값 계산
            let maxWeight: number | null = null;
            let maxReps: number | null = null;

            if (allEntries && allEntries.length > 0) {
              if (exercise.slug === 'pullup') {
                const repsArray = allEntries
                  .map((e) => e.reps)
                  .filter((r) => r != null);
                if (repsArray.length > 0) {
                  maxReps = Math.max(...repsArray);
                }
              } else {
                const weightsArray = allEntries
                  .map((e) => e.weight)
                  .filter((w) => w != null);
                if (weightsArray.length > 0) {
                  maxWeight = Math.max(...weightsArray);
                }
              }
            }

            // 월별 통계 계산 (날짜 범위가 있을 때)
            let monthStartWeight: number | null = null;
            let monthStartReps: number | null = null;
            let monthMaxWeight: number | null = null;
            let monthMaxReps: number | null = null;

            if (options?.startDate && options?.endDate) {
              try {
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
                console.log('monthEntries', monthEntries);

                if (monthEntries && monthEntries.length > 0) {
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
                    const repsArray = monthEntries
                      .map((e) => e.reps)
                      .filter((r) => r != null);
                    if (repsArray.length > 0) {
                      monthMaxReps = Math.max(...repsArray);
                    }
                    if (firstEntry && firstEntry.reps != null) {
                      monthStartReps = firstEntry.reps;
                    }
                  } else {
                    const weightsArray = monthEntries
                      .map((e) => e.weight)
                      .filter((w) => w != null);
                    if (weightsArray.length > 0) {
                      monthMaxWeight = Math.max(...weightsArray);
                    }
                    if (firstEntry && firstEntry.weight != null) {
                      monthStartWeight = firstEntry.weight;
                    }
                  }
                }
              } catch (monthErr) {
                // 월별 통계 조회 실패 시 해당 운동만 null로 설정하고 계속 진행
                console.warn(
                  `운동 ${exercise.name}의 월별 통계 조회 실패:`,
                  monthErr
                );
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
          } catch (exerciseErr) {
            // 개별 운동 조회 실패 시 기본값 반환
            console.warn(`운동 ${exercise.name} 조회 실패:`, exerciseErr);
            return {
              id: exercise.id,
              slug: exercise.slug,
              name: exercise.name,
              muscle_group: exercise.muscle_group,
              maxWeight: null,
              maxReps: null,
              monthStartWeight: null,
              monthStartReps: null,
              monthMaxWeight: null,
              monthMaxReps: null,
            };
          }
        })
      );

      setExercises(exercisesWithHistory);
      setError(null);
    } catch (err) {
      console.error('전체 운동 조회 실패:', err);
      setError(err instanceof Error ? err.message : '조회 실패');
      setExercises([]); // 에러 발생 시 빈 배열로 설정
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

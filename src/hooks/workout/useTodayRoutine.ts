import { useEffect, useState, useCallback } from 'react';

import * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/db/setupDatabase';

import {
  getRoutineByDate,
  formatDate,
  type RoutineCode,
} from '@/utils/routine';

export interface Exercise {
  id: number;
  slug: string;
  name: string;
  muscle_group: string;
  default_increment: number;
}

export interface RoutineExercise extends Exercise {
  position: number;
  lastWeight: number | null;
  lastSuccess: boolean;
  challengeWeight: number | null;
}

/**
 * 오늘의 루틴 데이터 조회 훅
 * @param date 선택적 날짜 파라미터. 제공되지 않으면 오늘 날짜 사용
 */
export function useTodayRoutine(date?: Date) {
  const [routineCode, setRoutineCode] = useState<RoutineCode>('A');
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayRoutine = useCallback(async () => {
    try {
      setLoading(true);
      const targetDate = date || new Date();
      const code = getRoutineByDate(targetDate);
      setRoutineCode(code);

      // 휴식일이면 운동 목록 없음
      if (code === 'REST') {
        setExercises([]);
        setLoading(false);
        return;
      }

      const db = await getDatabase();

      // 1. 해당 루틴의 운동 목록 조회
      const routineExercises = await db.getAllAsync<{
        id: number;
        slug: string;
        name: string;
        muscle_group: string;
        default_increment: number;
        position: number;
      }>(
        `
          SELECT 
            e.id, e.slug, e.name, e.muscle_group, e.default_increment,
            re.position
          FROM exercises e
          JOIN routine_exercises re ON e.id = re.exercise_id
          JOIN routines r ON re.routine_id = r.id
          WHERE r.code = ?
          ORDER BY re.position ASC
        `,
        [code]
      );

      // 2. 각 운동별 최근 기록 조회
      const exercisesWithHistory = await Promise.all(
        routineExercises.map(async (exercise) => {
          const summary = await db.getFirstAsync<{
            last_weight: number;
            last_success: number;
          }>(
            `SELECT last_weight, last_success FROM workout_summaries WHERE exercise_id = ?`,
            [exercise.id]
          );

          return {
            ...exercise,
            lastWeight: summary?.last_weight || null,
            lastSuccess: summary?.last_success === 1,
            challengeWeight: calculateChallengeWeight(
              summary?.last_weight || null,
              summary?.last_success === 1,
              exercise.default_increment
            ),
          };
        })
      );

      setExercises(exercisesWithHistory);
      setError(null);
    } catch (err) {
      console.error('오늘의 루틴 조회 실패:', err);
      setError(err instanceof Error ? err.message : '조회 실패');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchTodayRoutine();
  }, [fetchTodayRoutine]);

  return { routineCode, exercises, loading, error, refetch: fetchTodayRoutine };
}

/**
 * 도전 무게 계산
 * - 5x5 성공 시: 이전 무게 + 증량
 * - 실패 시: 이전 무게 유지
 * - 기록 없음: null
 */
function calculateChallengeWeight(
  lastWeight: number | null,
  lastSuccess: boolean,
  increment: number
): number | null {
  if (lastWeight === null) return null;

  return lastSuccess ? lastWeight + increment : lastWeight;
}

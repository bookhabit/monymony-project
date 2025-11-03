import { useState } from 'react';

import * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/db/setupDatabase';

import type { SetData } from '@/components/workout/SetInputTable';

import { formatDate } from '@/utils/routine';

/**
 * 운동 세션 저장 훅
 */
export function useSaveWorkout() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveWorkoutSession = async (
    routineCode: string,
    exerciseId: number,
    sets: SetData[],
    date?: Date
  ): Promise<boolean> => {
    setSaving(true);
    setError(null);

    try {
      const db = await getDatabase();
      const targetDate = date ? formatDate(date) : formatDate(new Date());

      // 1. 해당 날짜 세션이 있는지 확인
      let sessionId: number;
      const existingSession = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM workout_sessions WHERE date = ? AND routine_code = ?`,
        [targetDate, routineCode]
      );

      if (existingSession) {
        sessionId = existingSession.id;
        // 기존 기록 삭제 (수정을 위해)
        await db.runAsync(
          `DELETE FROM workout_entries WHERE session_id = ? AND exercise_id = ?`,
          [sessionId, exerciseId]
        );
      } else {
        // 새 세션 생성
        const insertResult = await db.runAsync(
          `INSERT INTO workout_sessions (date, routine_code) VALUES (?, ?)`,
          [targetDate, routineCode]
        );
        sessionId = insertResult.lastInsertRowId;
      }

      // 2. 세트 기록 삽입/수정
      for (const set of sets) {
        await db.runAsync(
          `INSERT INTO workout_entries (session_id, exercise_id, set_index, weight, reps)
           VALUES (?, ?, ?, ?, ?)`,
          [sessionId, exerciseId, set.set, set.weight, set.reps]
        );
      }

      // 3. workout_summaries 업데이트 (캐시)
      // 5x5 성공 여부 판단
      const isSuccess = sets.every((set) => set.reps >= 5);
      const lastWeight = sets[0]?.weight || 0;

      await db.runAsync(
        `INSERT OR REPLACE INTO workout_summaries (exercise_id, last_date, last_weight, last_success, updated_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
        [exerciseId, targetDate, lastWeight, isSuccess ? 1 : 0]
      );

      console.log('✅ 운동 기록 저장 완료');
      setSaving(false);
      return true;
    } catch (err) {
      console.error('❌ 운동 기록 저장 실패:', err);
      setError(err instanceof Error ? err.message : '저장 실패');
      setSaving(false);
      return false;
    }
  };

  return { saveWorkoutSession, saving, error };
}

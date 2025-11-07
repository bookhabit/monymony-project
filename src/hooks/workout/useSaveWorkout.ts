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

  /**
   * 특정 날짜의 특정 종목 기록 삭제 또는 초기화
   * @param routineCode 루틴 코드
   * @param exerciseId 운동 ID
   * @param date 날짜
   * @param resetRepsOnly true면 횟수만 0으로 초기화, false면 전체 삭제
   */
  const deleteWorkoutEntry = async (
    routineCode: string,
    exerciseId: number,
    date?: Date,
    resetRepsOnly: boolean = false
  ): Promise<boolean> => {
    setSaving(true);
    setError(null);

    try {
      const db = await getDatabase();
      const targetDate = date ? formatDate(date) : formatDate(new Date());

      // 해당 날짜 세션 찾기
      const existingSession = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM workout_sessions WHERE date = ? AND routine_code = ?`,
        [targetDate, routineCode]
      );

      if (!existingSession) {
        setSaving(false);
        return false; // 세션이 없으면 삭제할 것도 없음
      }

      const sessionId = existingSession.id;

      if (resetRepsOnly) {
        // 횟수만 0으로 초기화
        await db.runAsync(
          `UPDATE workout_entries SET reps = 0 WHERE session_id = ? AND exercise_id = ?`,
          [sessionId, exerciseId]
        );

        // workout_summaries 업데이트
        await db.runAsync(
          `UPDATE workout_summaries 
           SET last_weight = 0, last_success = 0, updated_at = datetime('now')
           WHERE exercise_id = ?`,
          [exerciseId]
        );
      } else {
        // 전체 삭제
        await db.runAsync(
          `DELETE FROM workout_entries WHERE session_id = ? AND exercise_id = ?`,
          [sessionId, exerciseId]
        );

        // 해당 세션에 다른 운동 기록이 있는지 확인
        const otherEntries = await db.getFirstAsync<{ count: number }>(
          `SELECT COUNT(*) as count FROM workout_entries WHERE session_id = ?`,
          [sessionId]
        );

        // 다른 기록이 없으면 세션도 삭제
        if (otherEntries && otherEntries.count === 0) {
          await db.runAsync(`DELETE FROM workout_sessions WHERE id = ?`, [
            sessionId,
          ]);
        }

        // workout_summaries 업데이트 (다른 날짜의 최근 기록으로 갱신)
        const latestEntry = await db.getFirstAsync<{
          date: string;
          weight: number;
          last_success: number;
        }>(
          `SELECT ws.date, we.weight, ws2.last_success
           FROM workout_entries we
           JOIN workout_sessions ws ON we.session_id = ws.id
           LEFT JOIN workout_summaries ws2 ON we.exercise_id = ws2.exercise_id
           WHERE we.exercise_id = ?
           ORDER BY ws.date DESC, we.set_index ASC
           LIMIT 1`,
          [exerciseId]
        );

        if (latestEntry) {
          await db.runAsync(
            `INSERT OR REPLACE INTO workout_summaries (exercise_id, last_date, last_weight, last_success, updated_at)
             VALUES (?, ?, ?, ?, datetime('now'))`,
            [
              exerciseId,
              latestEntry.date,
              latestEntry.weight,
              latestEntry.last_success || 0,
            ]
          );
        } else {
          // 기록이 없으면 초기화
          await db.runAsync(
            `DELETE FROM workout_summaries WHERE exercise_id = ?`,
            [exerciseId]
          );
        }
      }

      console.log(
        `✅ 운동 기록 ${resetRepsOnly ? '횟수 초기화' : '삭제'} 완료`
      );
      setSaving(false);
      return true;
    } catch (err) {
      console.error('❌ 운동 기록 삭제 실패:', err);
      setError(err instanceof Error ? err.message : '삭제 실패');
      setSaving(false);
      return false;
    }
  };

  return { saveWorkoutSession, deleteWorkoutEntry, saving, error };
}

import { useState, useEffect, useCallback } from 'react';

import { getDatabase } from '@/db/setupDatabase';

export interface ExerciseEntry {
  id: number;
  date: string;
  exerciseName: string;
  exerciseId: number;
  sessionId: number;
  sets: {
    setIndex: number;
    weight: number;
    reps: number;
  }[];
}

const PAGE_SIZE = 30;

/**
 * 선택한 운동종목의 기록을 페이지네이션으로 조회하는 훅
 */
export function useExerciseEntries(exerciseId: number | null) {
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchEntries = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      if (!exerciseId) {
        setEntries([]);
        setHasMore(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const db = await getDatabase();

        // 페이지네이션 쿼리: 날짜별로 그룹화하여 세션 조회
        // 최신순 정렬 (날짜 DESC)
        const offset = pageNum * PAGE_SIZE;
        const sessionsData = await db.getAllAsync<{
          session_id: number;
          date: string;
          exercise_name: string;
          exercise_id: number;
        }>(
          `SELECT DISTINCT
            ws.id as session_id,
            ws.date,
            e.name as exercise_name,
            e.id as exercise_id
          FROM workout_entries we
          JOIN workout_sessions ws ON we.session_id = ws.id
          JOIN exercises e ON we.exercise_id = e.id
          WHERE we.exercise_id = ?
          ORDER BY ws.date DESC, ws.id DESC
          LIMIT ? OFFSET ?`,
          [exerciseId, PAGE_SIZE, offset]
        );

        // 각 세션의 모든 세트 데이터 조회
        const formattedEntries: ExerciseEntry[] = await Promise.all(
          sessionsData.map(async (session) => {
            const sets = await db.getAllAsync<{
              set_index: number;
              weight: number;
              reps: number;
            }>(
              `SELECT set_index, weight, reps
               FROM workout_entries
               WHERE session_id = ? AND exercise_id = ?
               ORDER BY set_index ASC`,
              [session.session_id, exerciseId]
            );

            return {
              id: session.session_id,
              date: session.date,
              exerciseName: session.exercise_name,
              exerciseId: session.exercise_id,
              sessionId: session.session_id,
              sets: sets.map((set) => ({
                setIndex: set.set_index,
                weight: set.weight,
                reps: set.reps,
              })),
            };
          })
        );

        if (reset) {
          setEntries(formattedEntries);
        } else {
          setEntries((prev) => [...prev, ...formattedEntries]);
        }

        setHasMore(formattedEntries.length === PAGE_SIZE);
        setPage(pageNum);
      } catch (err) {
        console.error('운동 기록 조회 실패:', err);
        setError(err instanceof Error ? err.message : '조회 실패');
      } finally {
        setLoading(false);
      }
    },
    [exerciseId]
  );

  // exerciseId가 변경되면 초기화하고 첫 페이지 로드
  useEffect(() => {
    if (exerciseId) {
      setPage(0);
      setHasMore(true);
      fetchEntries(0, true);
    } else {
      setEntries([]);
      setHasMore(false);
    }
  }, [exerciseId, fetchEntries]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && exerciseId) {
      fetchEntries(page + 1, false);
    }
  }, [loading, hasMore, exerciseId, page, fetchEntries]);

  return {
    entries,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => {
      if (exerciseId) {
        setPage(0);
        setHasMore(true);
        fetchEntries(0, true);
      }
    },
  };
}

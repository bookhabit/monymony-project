import { useState, useEffect, useCallback } from 'react';

import { getDatabase } from '@/db/setupDatabase';

export interface Exercise {
  id: number;
  slug: string;
  name: string;
  muscle_group: string | null;
}

/**
 * 운동종목 목록 조회 훅
 */
export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const db = await getDatabase();
      if (!db) {
        throw new Error('데이터베이스 연결 실패');
      }

      const allExercises = await db.getAllAsync<Exercise>(
        `SELECT id, slug, name, muscle_group FROM exercises 
         ORDER BY name ASC`
      );

      setExercises(allExercises);
    } catch (err) {
      console.error('운동종목 조회 실패:', err);
      setError(err instanceof Error ? err.message : '조회 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return { exercises, loading, error, refetch: fetchExercises };
}

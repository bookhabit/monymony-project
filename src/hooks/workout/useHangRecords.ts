import { useState, useEffect } from 'react';

import * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/db/setupDatabase';

import { formatDate } from '@/utils/routine';

export interface HangRecord {
  id: number;
  date: string;
  set_index: number;
  duration_seconds: number;
  created_at: string;
}

export interface HangSession {
  date: string;
  sets: {
    setIndex: number;
    durationSeconds: number;
  }[];
}

/**
 * 철봉 매달리기 기록 조회 및 저장 훅
 */
export function useHangRecords(date?: Date) {
  const [records, setRecords] = useState<HangRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date ? formatDate(date) : formatDate(new Date());

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const db = await getDatabase();
      const result = await db.getAllAsync<HangRecord>(
        `SELECT * FROM hang_records WHERE date = ? ORDER BY set_index ASC`,
        [targetDate]
      );
      setRecords(result);
    } catch (err) {
      console.error('❌ 철봉 매달리기 기록 조회 실패:', err);
      setError(err instanceof Error ? err.message : '조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [targetDate]);

  const saveHangSession = async (
    sets: { setIndex: number; durationSeconds: number }[],
    recordDate?: Date
  ): Promise<boolean> => {
    try {
      const db = await getDatabase();
      const saveDate = recordDate ? formatDate(recordDate) : targetDate;

      // 트랜잭션으로 모든 세트 저장
      await db.withTransactionAsync(async () => {
        for (const set of sets) {
          await db.runAsync(
            `INSERT OR REPLACE INTO hang_records (date, set_index, duration_seconds, created_at)
             VALUES (?, ?, ?, datetime('now'))`,
            [saveDate, set.setIndex, set.durationSeconds]
          );
        }
      });

      console.log('✅ 철봉 매달리기 기록 저장 완료');
      await fetchRecords(); // 새로고침
      return true;
    } catch (err) {
      console.error('❌ 철봉 매달리기 기록 저장 실패:', err);
      setError(err instanceof Error ? err.message : '저장 실패');
      return false;
    }
  };

  return {
    records,
    loading,
    error,
    refetch: fetchRecords,
    saveHangSession,
  };
}

/**
 * 오늘의 철봉 매달리기 기록 조회
 */
export function useTodayHangRecord() {
  return useHangRecords(new Date());
}

/**
 * 최근 기록 조회 (통계용)
 */
export async function getHangRecordStats(): Promise<{
  totalDays: number;
  maxDuration: number;
  lastDate: string | null;
}> {
  try {
    const db = await getDatabase();

    // 총 운동한 날짜 수
    const totalDaysResult = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(DISTINCT date) as count FROM hang_records`
    );

    // 최대 지속 시간 (하루 총합)
    const maxDurationResult = await db.getFirstAsync<{
      max_duration: number | null;
    }>(
      `SELECT MAX(total_duration) as max_duration FROM (
        SELECT date, SUM(duration_seconds) as total_duration 
        FROM hang_records 
        GROUP BY date
      )`
    );

    // 마지막 운동 날짜
    const lastDateResult = await db.getFirstAsync<{ last_date: string | null }>(
      `SELECT MAX(date) as last_date FROM hang_records`
    );

    return {
      totalDays: totalDaysResult?.count || 0,
      maxDuration: maxDurationResult?.max_duration || 0,
      lastDate: lastDateResult?.last_date || null,
    };
  } catch (err) {
    console.error('❌ 철봉 매달리기 통계 조회 실패:', err);
    return {
      totalDays: 0,
      maxDuration: 0,
      lastDate: null,
    };
  }
}

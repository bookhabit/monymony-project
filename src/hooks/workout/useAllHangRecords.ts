import { useState, useEffect } from 'react';

import * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/db/setupDatabase';

import type { HangRecord } from './useHangRecords';

export interface HangDayRecord {
  date: string;
  sets: {
    setIndex: number;
    durationSeconds: number;
  }[];
  totalSeconds: number;
}

/**
 * 모든 철봉 매달리기 기록 조회 (날짜별)
 */
export function useAllHangRecords() {
  const [records, setRecords] = useState<HangDayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const db = await getDatabase();
      const allRecords = await db.getAllAsync<HangRecord>(
        `SELECT * FROM hang_records ORDER BY date DESC, set_index ASC`
      );

      // 날짜별로 그룹화
      const groupedByDate: { [date: string]: HangDayRecord } = {};

      allRecords.forEach((record) => {
        if (!groupedByDate[record.date]) {
          groupedByDate[record.date] = {
            date: record.date,
            sets: [],
            totalSeconds: 0,
          };
        }

        groupedByDate[record.date].sets.push({
          setIndex: record.set_index,
          durationSeconds: record.duration_seconds,
        });
        groupedByDate[record.date].totalSeconds += record.duration_seconds;
      });

      // 배열로 변환 및 정렬 (최신순)
      const recordsArray = Object.values(groupedByDate).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setRecords(recordsArray);
    } catch (err) {
      console.error('❌ 철봉 매달리기 전체 기록 조회 실패:', err);
      setError(err instanceof Error ? err.message : '조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRecords();
  }, []);

  return {
    records,
    loading,
    error,
    refetch: fetchAllRecords,
  };
}

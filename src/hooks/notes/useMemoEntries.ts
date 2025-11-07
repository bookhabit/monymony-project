import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  addMemoEntry,
  deleteMemoEntry,
  getMemoEntries,
  type MemoEntry,
  updateMemoEntry,
} from '@/db/memoRepository';

interface UseMemoEntriesOptions {
  autoRefreshInterval?: number;
}

export function useMemoEntries(options: UseMemoEntriesOptions = {}) {
  const { autoRefreshInterval } = options;
  const [entries, setEntries] = useState<MemoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rows = await getMemoEntries();
      setEntries(rows);
    } catch (err) {
      console.error('❌ 메모 목록 로드 실패:', err);
      setError(
        err instanceof Error ? err.message : '메모 목록을 불러오지 못했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    if (!autoRefreshInterval) {
      return;
    }
    const timer = setInterval(() => {
      void loadEntries();
    }, autoRefreshInterval);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, loadEntries]);

  const addEntry = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return null;
    }

    try {
      setSaving(true);
      setError(null);
      const newEntry = await addMemoEntry(trimmed);
      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      console.error('❌ 메모 추가 실패:', err);
      const message =
        err instanceof Error ? err.message : '메모 추가에 실패했습니다.';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateEntry = useCallback(async (id: number, content: string) => {
    try {
      setSaving(true);
      setError(null);
      await updateMemoEntry(id, content);
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                content: content.trim(),
                updated_at: new Date().toISOString(),
              }
            : entry
        )
      );
    } catch (err) {
      console.error('❌ 메모 수정 실패:', err);
      const message =
        err instanceof Error ? err.message : '메모 수정에 실패했습니다.';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const removeEntry = useCallback(async (id: number) => {
    try {
      setSaving(true);
      setError(null);
      await deleteMemoEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error('❌ 메모 삭제 실패:', err);
      const message =
        err instanceof Error ? err.message : '메모 삭제에 실패했습니다.';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const latestEntry = useMemo(() => entries[0] ?? null, [entries]);

  return {
    entries,
    latestEntry,
    loading,
    saving,
    error,
    refresh: loadEntries,
    addEntry,
    updateEntry,
    removeEntry,
  };
}

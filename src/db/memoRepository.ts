import { getDatabase } from './setupDatabase';

export interface MemoEntry {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getMemoEntries(): Promise<MemoEntry[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<MemoEntry>(
    `SELECT id, content, created_at, updated_at
     FROM memo_entries
     ORDER BY datetime(created_at) DESC`
  );
  return rows;
}

export async function addMemoEntry(content: string): Promise<MemoEntry> {
  const db = await getDatabase();
  const normalized = content.trim();
  const result = await db.runAsync(
    `INSERT INTO memo_entries (content, created_at, updated_at)
     VALUES (?, datetime('now'), datetime('now'))`,
    [normalized]
  );

  return {
    id: result.lastInsertRowId,
    content: normalized,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateMemoEntry(
  id: number,
  content: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE memo_entries
     SET content = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [content.trim(), id]
  );
}

export async function deleteMemoEntry(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM memo_entries WHERE id = ?`, [id]);
}

export async function getMemoEntry(id: number): Promise<MemoEntry | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<MemoEntry>(
    `SELECT id, content, created_at, updated_at
     FROM memo_entries
     WHERE id = ?`,
    [id]
  );
  return row ?? null;
}

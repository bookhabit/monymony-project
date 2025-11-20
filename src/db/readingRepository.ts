import * as SQLite from 'expo-sqlite';

import { getDatabase } from './setupDatabase';

export interface BookNote {
  id: number;
  text: string;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  memorableQuote: string;
  review: string;
  actionItem: string;
  learnedPoints: BookNote[];
  created_at: string;
  updated_at: string;
}

/**
 * 모든 책 목록 조회 (검색 가능)
 */
export async function getAllBooks(searchQuery?: string): Promise<Book[]> {
  const db = await getDatabase();

  let query = `
    SELECT 
      b.id,
      b.title,
      COALESCE(b.memorable_quote, '') as memorableQuote,
      COALESCE(b.review, '') as review,
      COALESCE(b.action_item, '') as actionItem,
      b.created_at,
      b.updated_at
    FROM reading_books b
  `;

  const params: any[] = [];

  if (searchQuery && searchQuery.trim()) {
    query += ` WHERE b.title LIKE ?`;
    params.push(`%${searchQuery.trim()}%`);
  }

  query += ` ORDER BY b.updated_at DESC`;

  const rows = await db.getAllAsync<any>(query, params);

  // 각 책의 배운점 조회
  const books: Book[] = [];
  for (const row of rows) {
    const learnedPoints = await db.getAllAsync<BookNote>(
      `SELECT id, text, created_at 
       FROM reading_learned_points 
       WHERE book_id = ? 
       ORDER BY id`,
      [row.id]
    );

    books.push({
      id: row.id,
      title: row.title,
      memorableQuote: row.memorableQuote || '',
      review: row.review || '',
      actionItem: row.actionItem || '',
      learnedPoints: learnedPoints.map((lp) => ({
        id: lp.id,
        text: lp.text,
        created_at: lp.created_at,
      })),
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  return books;
}

/**
 * 책 ID로 조회
 */
export async function getBookById(id: number): Promise<Book | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<any>(
    `SELECT 
      id,
      title,
      COALESCE(memorable_quote, '') as memorableQuote,
      COALESCE(review, '') as review,
      COALESCE(action_item, '') as actionItem,
      created_at,
      updated_at
     FROM reading_books 
     WHERE id = ?`,
    [id]
  );

  if (!row) return null;

  const learnedPoints = await db.getAllAsync<BookNote>(
    `SELECT id, text, created_at 
     FROM reading_learned_points 
     WHERE book_id = ? 
     ORDER BY id`,
    [id]
  );

  return {
    id: row.id,
    title: row.title,
    memorableQuote: row.memorableQuote || '',
    review: row.review || '',
    actionItem: row.actionItem || '',
    learnedPoints: learnedPoints.map((lp) => ({
      id: lp.id,
      text: lp.text,
      created_at: lp.created_at,
    })),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * 새 책 생성
 */
export async function createBook(title: string): Promise<Book> {
  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO reading_books (title, created_at, updated_at)
     VALUES (?, datetime('now'), datetime('now'))`,
    [title.trim()]
  );

  // 기본 배운점 1개 추가
  await db.runAsync(
    `INSERT INTO reading_learned_points (book_id, text, created_at)
     VALUES (?, '', datetime('now'))`,
    [result.lastInsertRowId]
  );

  const book = await getBookById(result.lastInsertRowId);
  if (!book) {
    throw new Error('책 생성 후 조회 실패');
  }

  return book;
}

/**
 * 책 정보 업데이트
 */
export async function updateBook(
  id: number,
  data: {
    title?: string;
    memorableQuote?: string;
    review?: string;
    actionItem?: string;
  }
): Promise<void> {
  const db = await getDatabase();

  const updates: string[] = [];
  const params: any[] = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    params.push(data.title.trim());
  }
  if (data.memorableQuote !== undefined) {
    updates.push('memorable_quote = ?');
    params.push(data.memorableQuote);
  }
  if (data.review !== undefined) {
    updates.push('review = ?');
    params.push(data.review);
  }
  if (data.actionItem !== undefined) {
    updates.push('action_item = ?');
    params.push(data.actionItem);
  }

  if (updates.length === 0) return;

  updates.push("updated_at = datetime('now')");
  params.push(id);

  await db.runAsync(
    `UPDATE reading_books 
     SET ${updates.join(', ')} 
     WHERE id = ?`,
    params
  );
}

/**
 * 배운점 추가
 */
export async function addLearnedPoint(
  bookId: number,
  text: string
): Promise<BookNote> {
  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO reading_learned_points (book_id, text, created_at)
     VALUES (?, ?, datetime('now'))`,
    [bookId, text.trim()]
  );

  const point = await db.getFirstAsync<BookNote>(
    `SELECT id, text, created_at 
     FROM reading_learned_points 
     WHERE id = ?`,
    [result.lastInsertRowId]
  );

  if (!point) {
    throw new Error('배운점 생성 후 조회 실패');
  }

  return point;
}

/**
 * 배운점 업데이트
 */
export async function updateLearnedPoint(
  id: number,
  text: string
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE reading_learned_points 
     SET text = ? 
     WHERE id = ?`,
    [text.trim(), id]
  );
}

/**
 * 배운점 삭제
 */
export async function deleteLearnedPoint(id: number): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(`DELETE FROM reading_learned_points WHERE id = ?`, [id]);
}

/**
 * 책 삭제 (배운점도 함께 삭제됨 - CASCADE)
 */
export async function deleteBook(id: number): Promise<void> {
  const db = await getDatabase();

  // 배운점 먼저 삭제 (CASCADE가 작동하지 않을 경우를 대비)
  await db.runAsync(`DELETE FROM reading_learned_points WHERE book_id = ?`, [
    id,
  ]);

  // 책 삭제
  await db.runAsync(`DELETE FROM reading_books WHERE id = ?`, [id]);
}

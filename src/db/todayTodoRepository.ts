import * as SQLite from 'expo-sqlite';

import { getDatabase } from './setupDatabase';

export type TodoType =
  | 'study'
  | 'algorithm'
  | 'bodyweight'
  | 'reading'
  | 'running'
  | 'health';

/**
 * 특정 날짜의 TODO 체크 상태 조회
 */
export async function getTodoDatesByType(
  todoType: TodoType
): Promise<Set<string>> {
  try {
    const db = await getDatabase();
    if (!db) {
      console.error('데이터베이스 연결 실패');
      return new Set();
    }
    const result = await db.getAllAsync<{ date: string }>(
      'SELECT date FROM today_todo_dates WHERE todo_type = ?',
      [todoType]
    );

    return new Set(result.map((row) => row.date));
  } catch (error) {
    console.error(`${todoType} 날짜 조회 실패:`, error);
    return new Set();
  }
}

/**
 * 특정 날짜의 특정 TODO 체크 여부 확인
 */
export async function isTodoChecked(
  date: string,
  todoType: TodoType
): Promise<boolean> {
  try {
    const db = await getDatabase();
    if (!db) {
      console.error('데이터베이스 연결 실패');
      return false;
    }
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM today_todo_dates WHERE date = ? AND todo_type = ?',
      [date, todoType]
    );

    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error(`${todoType} 체크 여부 확인 실패:`, error);
    return false;
  }
}

/**
 * TODO 체크/해제
 */
export async function toggleTodo(
  date: string,
  todoType: TodoType,
  checked: boolean
): Promise<void> {
  try {
    const db = await getDatabase();
    if (!db) {
      throw new Error('데이터베이스 연결 실패');
    }

    if (checked) {
      // 체크: INSERT
      await db.runAsync(
        `INSERT OR IGNORE INTO today_todo_dates (date, todo_type, created_at)
         VALUES (?, ?, datetime('now'))`,
        [date, todoType]
      );
    } else {
      // 해제: DELETE
      await db.runAsync(
        'DELETE FROM today_todo_dates WHERE date = ? AND todo_type = ?',
        [date, todoType]
      );
    }
  } catch (error) {
    console.error(`${todoType} 체크/해제 실패:`, error);
    throw error;
  }
}

/**
 * 모든 TODO 타입의 날짜 조회
 */
export async function getAllTodoDates(): Promise<{
  study: Set<string>;
  algorithm: Set<string>;
  bodyweight: Set<string>;
  reading: Set<string>;
  running: Set<string>;
  health: Set<string>;
}> {
  try {
    const [study, algorithm, bodyweight, reading, running, health] =
      await Promise.all([
        getTodoDatesByType('study'),
        getTodoDatesByType('algorithm'),
        getTodoDatesByType('bodyweight'),
        getTodoDatesByType('reading'),
        getTodoDatesByType('running'),
        getTodoDatesByType('health'),
      ]);

    return {
      study,
      algorithm,
      bodyweight,
      reading,
      running,
      health,
    };
  } catch (error) {
    console.error('모든 TODO 날짜 조회 실패:', error);
    return {
      study: new Set(),
      algorithm: new Set(),
      bodyweight: new Set(),
      reading: new Set(),
      running: new Set(),
      health: new Set(),
    };
  }
}

import * as SQLite from 'expo-sqlite';

import { getDatabase } from './setupDatabase';

/**
 * 학습 목표 체크 상태 조회
 */
export async function getCheckedGoals(): Promise<Record<string, boolean>> {
  try {
    const db = await getDatabase();
    const result = await db.getAllAsync<{ goal_id: string; checked: number }>(
      'SELECT goal_id, checked FROM study_goals WHERE checked = 1'
    );

    const checkedGoals: Record<string, boolean> = {};
    result.forEach((row) => {
      checkedGoals[row.goal_id] = row.checked === 1;
    });

    return checkedGoals;
  } catch (error) {
    console.error('학습 목표 조회 실패:', error);
    return {};
  }
}

/**
 * 학습 목표 체크 상태 저장
 */
export async function saveCheckedGoal(
  goalId: string,
  checked: boolean
): Promise<void> {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT OR REPLACE INTO study_goals (goal_id, checked, updated_at)
       VALUES (?, ?, datetime('now'))`,
      [goalId, checked ? 1 : 0]
    );
  } catch (error) {
    console.error('학습 목표 저장 실패:', error);
    throw error;
  }
}

/**
 * 모든 학습 목표 체크 상태 일괄 저장
 */
export async function saveAllCheckedGoals(
  checkedGoals: Record<string, boolean>
): Promise<void> {
  try {
    const db = await getDatabase();
    
    // 트랜잭션 시작
    await db.withTransactionAsync(async () => {
      // 기존 데이터 삭제
      await db.runAsync('DELETE FROM study_goals');
      
      // 새 데이터 삽입
      const entries = Object.entries(checkedGoals);
      for (const [goalId, checked] of entries) {
        await db.runAsync(
          `INSERT INTO study_goals (goal_id, checked, updated_at)
           VALUES (?, ?, datetime('now'))`,
          [goalId, checked ? 1 : 0]
        );
      }
    });
  } catch (error) {
    console.error('학습 목표 일괄 저장 실패:', error);
    throw error;
  }
}


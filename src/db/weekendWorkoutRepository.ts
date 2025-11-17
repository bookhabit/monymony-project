import { getDatabase } from './setupDatabase';

export type WeekendExerciseType =
  | 'hang'
  | 'pushup'
  | 'handstand_pushup'
  | 'stairs';

export interface WeekendWorkoutEntry {
  id: number;
  date: string;
  exercise_type: WeekendExerciseType;
  set_index: number;
  duration_seconds: number | null;
  reps: number | null;
  floors: number | null;
  created_at: string;
  updated_at: string;
}

export interface WeekendSetInput {
  setIndex: number;
  durationSeconds?: number | null;
  reps?: number | null;
  floors?: number | null;
}

export async function getWeekendEntriesByDate(
  date: string
): Promise<WeekendWorkoutEntry[]> {
  const db = await getDatabase();
  return db.getAllAsync<WeekendWorkoutEntry>(
    `SELECT id, date, exercise_type, set_index, duration_seconds, reps, floors, created_at, updated_at
     FROM weekend_workout_entries
     WHERE date = ?
     ORDER BY 
       CASE exercise_type
         WHEN 'stairs' THEN 1
         WHEN 'pushup' THEN 2
         WHEN 'handstand_pushup' THEN 3
         WHEN 'hang' THEN 4
         ELSE 5
       END,
       set_index ASC`,
    [date]
  );
}

export async function replaceWeekendExerciseEntries(
  date: string,
  exerciseType: WeekendExerciseType,
  sets: WeekendSetInput[]
): Promise<void> {
  const db = await getDatabase();

  // 트랜잭션 처리
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `DELETE FROM weekend_workout_entries WHERE date = ? AND exercise_type = ?`,
      [date, exerciseType]
    );

    for (const set of sets) {
      await db.runAsync(
        `INSERT INTO weekend_workout_entries
          (date, exercise_type, set_index, duration_seconds, reps, floors, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [
          date,
          exerciseType,
          set.setIndex,
          set.durationSeconds ?? null,
          set.reps ?? null,
          set.floors ?? null,
        ]
      );
    }
  });
}

export async function deleteWeekendExerciseEntries(
  date: string,
  exerciseType: WeekendExerciseType
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `DELETE FROM weekend_workout_entries WHERE date = ? AND exercise_type = ?`,
    [date, exerciseType]
  );
}

export interface WeekendHistoryEntry {
  date: string;
  sets: {
    setIndex: number;
    durationSeconds: number | null;
    reps: number | null;
    floors: number | null;
  }[];
}

export async function getWeekendHistory(
  exerciseType: WeekendExerciseType,
  limit: number,
  offset: number
): Promise<WeekendHistoryEntry[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<WeekendWorkoutEntry>(
    `SELECT id, date, exercise_type, set_index, duration_seconds, reps, floors, created_at, updated_at
     FROM weekend_workout_entries
     WHERE exercise_type = ?
     ORDER BY date DESC, set_index ASC
     LIMIT ? OFFSET ?`,
    [exerciseType, limit, offset]
  );

  const grouped = new Map<string, WeekendHistoryEntry>();

  for (const row of rows) {
    if (!grouped.has(row.date)) {
      grouped.set(row.date, {
        date: row.date,
        sets: [],
      });
    }
    grouped.get(row.date)!.sets.push({
      setIndex: row.set_index,
      durationSeconds: row.duration_seconds,
      reps: row.reps,
      floors: row.floors,
    });
  }

  return Array.from(grouped.values());
}

export async function getLatestWeekendHistory(
  exerciseType: WeekendExerciseType
): Promise<WeekendHistoryEntry | null> {
  const histories = await getWeekendHistory(exerciseType, 1, 0);
  return histories.length > 0 ? histories[0] : null;
}

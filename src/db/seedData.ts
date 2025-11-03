import * as SQLite from 'expo-sqlite';

/**
 * 초기 운동 종목 + 루틴 데이터 시드
 */
export const initialExercises = [
  { slug: 'pullup', name: '풀업', muscle_group: '등' },
  { slug: 'bench_press', name: '벤치 프레스', muscle_group: '가슴' },
  { slug: 'deadlift', name: '데드리프트', muscle_group: '등/하체' },
  { slug: 'barbell_curl', name: '바벨 컬', muscle_group: '이두' },
  { slug: 'military_press', name: '밀리터리 프레스', muscle_group: '어깨' },
  { slug: 'squat', name: '스쿼트', muscle_group: '하체' },
  {
    slug: 'overhead_extension',
    name: '오버헤드 익스텐션',
    muscle_group: '삼두',
  },
  { slug: 'barbell_row', name: '바벨로우', muscle_group: '등' },
  { slug: 'dumbbell_row', name: '덤벨로우', muscle_group: '등' },
  { slug: 'rear_delt', name: '후면 델토이드', muscle_group: '어깨' },
  { slug: 'lateral_raise', name: '사이드 레터럴 레이즈', muscle_group: '어깨' },
];

/**
 * 루틴 정의 (요일별)
 *
 * 월/A: 풀업, 벤치, 데드, 바벨컬
 * 화/B: 풀업, 밀프, 스쿼트, 오버헤드익스텐션
 * 수/C: 바벨로우, 덤벨로우, 후면델트, 레터럴레이즈
 * 목/A(vari): 풀업, 벤치, 데드, 바벨컬
 * 금/B: 풀업, 밀프, 스쿼트, 오버헤드익스텐션
 */
export const initialRoutines = [
  {
    code: 'A',
    name: '상체 중심',
    exercises: ['pullup', 'bench_press', 'deadlift', 'barbell_curl'],
  },
  {
    code: 'B',
    name: '전신 균형',
    exercises: ['pullup', 'military_press', 'squat', 'overhead_extension'],
  },
  {
    code: 'C',
    name: '등/어깨 집중',
    exercises: ['barbell_row', 'dumbbell_row', 'rear_delt', 'lateral_raise'],
  },
];

/**
 * DB에 초기 데이터 삽입
 */
export async function seedDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    // 1. 운동 종목 삽입
    for (const exercise of initialExercises) {
      await db.runAsync(
        `INSERT OR IGNORE INTO exercises (slug, name, muscle_group) VALUES (?, ?, ?)`,
        [exercise.slug, exercise.name, exercise.muscle_group]
      );
    }

    // 2. 루틴 삽입
    for (const routine of initialRoutines) {
      // 루틴 삽입
      const result = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM routines WHERE code = ?`,
        [routine.code]
      );

      let routineId: number;
      if (!result) {
        const insertResult = await db.runAsync(
          `INSERT INTO routines (code, name) VALUES (?, ?)`,
          [routine.code, routine.name]
        );
        routineId = insertResult.lastInsertRowId;
      } else {
        routineId = result.id;
      }

      // 루틴-운동 매핑 삽입
      for (let i = 0; i < routine.exercises.length; i++) {
        const exerciseSlug = routine.exercises[i];
        const exerciseResult = await db.getFirstAsync<{ id: number }>(
          `SELECT id FROM exercises WHERE slug = ?`,
          [exerciseSlug]
        );

        if (exerciseResult) {
          await db.runAsync(
            `INSERT OR IGNORE INTO routine_exercises (routine_id, exercise_id, position)
             VALUES (?, ?, ?)`,
            [routineId, exerciseResult.id, i]
          );
        }
      }
    }

    console.log('✅ 초기 데이터 시드 완료');
  } catch (error) {
    console.error('❌ 초기 데이터 시드 실패:', error);
    throw error;
  }
}

import * as SQLite from 'expo-sqlite';

/**
 * 초기 운동 종목 + 루틴 데이터 시드
 */
export const initialExercises = [
  { slug: 'pullup', name: '풀업', muscle_group: '등' },
  { slug: 'lat_pulldown', name: '랫풀다운', muscle_group: '등' },
  { slug: 'arm_pulldown', name: '암풀다운', muscle_group: '등' },
  { slug: 'barbell_row', name: '바벨로우', muscle_group: '등' },
  { slug: 'dumbbell_row', name: '덤벨로우', muscle_group: '등' },
  { slug: 'barbell_curl', name: '바벨 컬', muscle_group: '이두' },
  { slug: 'bench_press', name: '벤치 프레스', muscle_group: '가슴' },
  {
    slug: 'incline_bench_press',
    name: '인클라인 벤치 프레스',
    muscle_group: '가슴',
  },
  { slug: 'military_press', name: '밀리터리 프레스', muscle_group: '어깨' },
  { slug: 'dumbbell_press', name: '덤벨 프레스', muscle_group: '어깨' },
  {
    slug: 'cable_pushdown',
    name: '케이블 푸쉬다운',
    muscle_group: '삼두',
  },
  { slug: 'squat', name: '스쿼트', muscle_group: '하체' },
  { slug: 'deadlift', name: '데드리프트', muscle_group: '등/하체' },
  { slug: 'rear_delt', name: '후면 델토이드', muscle_group: '어깨' },
  { slug: 'lateral_raise', name: '사이드 레터럴 레이즈', muscle_group: '어깨' },
];

/**
 * 루틴 정의 (요일별)
 *
 * 월/A: 풀업, 랫풀다운, 암풀다운, 바벨로우, 덤벨로우, 바벨컬
 * 화/B: 벤치프레스, 인클라인 벤치프레스, 밀리터리 프레스, 덤벨 프레스, 케이블푸쉬다운
 * 수/C: 스쿼트, 데드리프트, 후면 델토이드, 사이드 레터럴 레이즈
 * 목/A: 풀업, 랫풀다운, 암풀다운, 바벨로우, 덤벨로우, 바벨컬
 * 금/B: 벤치프레스, 인클라인 벤치프레스, 밀리터리 프레스, 덤벨 프레스, 케이블푸쉬다운
 */
export const initialRoutines = [
  {
    code: 'A',
    name: '등/이두',
    exercises: [
      'pullup',
      'lat_pulldown',
      'arm_pulldown',
      'barbell_row',
      'dumbbell_row',
      'barbell_curl',
    ],
  },
  {
    code: 'B',
    name: '가슴/어깨/삼두',
    exercises: [
      'bench_press',
      'incline_bench_press',
      'military_press',
      'dumbbell_press',
      'cable_pushdown',
    ],
  },
  {
    code: 'C',
    name: '하체/등/어깨',
    exercises: ['squat', 'deadlift', 'rear_delt', 'lateral_raise'],
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

    // 2. 루틴 삽입 및 업데이트
    for (const routine of initialRoutines) {
      // 루틴 조회 또는 생성
      const result = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM routines WHERE code = ?`,
        [routine.code]
      );

      let routineId: number;
      if (!result) {
        // 새 루틴 생성
        const insertResult = await db.runAsync(
          `INSERT INTO routines (code, name) VALUES (?, ?)`,
          [routine.code, routine.name]
        );
        routineId = insertResult.lastInsertRowId;
      } else {
        // 기존 루틴 업데이트 (이름 변경 가능)
        routineId = result.id;
        await db.runAsync(`UPDATE routines SET name = ? WHERE id = ?`, [
          routine.name,
          routineId,
        ]);

        // 기존 루틴-운동 매핑 삭제 (새로운 매핑으로 교체하기 위해)
        await db.runAsync(
          `DELETE FROM routine_exercises WHERE routine_id = ?`,
          [routineId]
        );
      }

      // 루틴-운동 매핑 삽입 (기존 매핑 삭제 후 새로 추가)
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

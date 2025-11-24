/**
 * 날짜별 루틴 계산 유틸리티
 *
 * 월/목: A (등/이두)
 * 화/금: B (가슴/어깨/삼두)
 * 수: C (하체/등/어깨)
 * 토/일: REST (휴식)
 */
export type RoutineCode = 'A' | 'B' | 'C' | 'WEEKEND' | 'REST';

/**
 * 날짜로 루틴 코드 계산
 * @param date 날짜 객체
 * @returns 루틴 코드
 */
export function getRoutineByDate(date: Date = new Date()): RoutineCode {
  const dayOfWeek = date.getDay(); // 0=일요일, 1=월요일, ... 6=토요일

  // 주말: 휴식
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'WEEKEND';
  }

  // 월요일: 1, 목요일: 4 → A
  if (dayOfWeek === 1 || dayOfWeek === 4) {
    return 'A';
  }

  // 화요일: 2, 금요일: 5 → B
  if (dayOfWeek === 2 || dayOfWeek === 5) {
    return 'B';
  }

  // 수요일: 3 → C
  return 'C';
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 요일 이름 반환
 */
export function getDayName(date: Date): string {
  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  return days[date.getDay()];
}

/**
 * 루틴 코드로 루틴 이름 반환
 */
export function getRoutineName(code: RoutineCode): string {
  const names: Record<RoutineCode, string> = {
    A: '등/이두',
    B: '가슴/어깨/삼두',
    C: '하체/등/어깨',
    WEEKEND: '주말 운동',
    REST: '휴식',
  };
  return names[code];
}

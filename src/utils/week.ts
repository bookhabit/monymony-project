import { formatDate } from './routine';

/**
 * 주의 시작일(월요일)과 종료일(일요일) 계산
 * @param date 기준 날짜
 * @returns 주의 시작일과 종료일 (YYYY-MM-DD)
 */
export function getWeekRange(date: Date = new Date()): {
  startDate: string;
  endDate: string;
} {
  const currentDay = date.getDay(); // 0=일요일, 1=월요일, ... 6=토요일
  const dayOfWeek = currentDay === 0 ? 7 : currentDay; // 일요일을 7로 변환 (월요일=1 ~ 일요일=7)

  // 월요일까지의 일수 계산 (월요일이면 0, 화요일이면 1, ... 일요일이면 6)
  const daysToMonday = dayOfWeek - 1;

  // 주의 시작일 (월요일)
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - daysToMonday);
  startDate.setHours(0, 0, 0, 0);

  // 주의 종료일 (일요일)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

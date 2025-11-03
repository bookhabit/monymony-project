import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import { useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';
import { getDatabase } from '@/db/setupDatabase';

import CustomHeader from '@/components/layout/CustomHeader';
import WorkoutStatistics from '@/components/workout/WorkoutStatistics';

import { workoutPalette } from '@/constants/colors';

import { formatDate } from '@/utils/routine';
import { getWeekRange } from '@/utils/week';

// 한글 로케일 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

interface MarkedDates {
  [key: string]: {
    marked?: boolean;
    selected?: boolean;
    selectedColor?: string;
    dotColor?: string;
    customStyles?: {
      container?: {
        borderWidth?: number;
        borderColor?: string;
        borderRadius?: number;
      };
      text?: {
        color?: string;
      };
    };
  };
}

const MonthScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const workoutColors = isDarkMode
    ? {
        completed: workoutPalette.workoutCompleted.dark,
        bg: workoutPalette.workoutBg.dark,
        accent: workoutPalette.accentBlue.dark,
      }
    : {
        completed: workoutPalette.workoutCompleted.light,
        bg: workoutPalette.workoutBg.light,
        accent: workoutPalette.accentBlue.light,
      };
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [loading, setLoading] = useState(true);

  // 이번달 날짜 범위 계산
  const monthDateRange = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    return { startDate, endDate };
  }, [currentMonth]);

  // 이번주 날짜 범위 계산
  const weekDateRange = useMemo(() => {
    return getWeekRange(new Date());
  }, []);

  // 현재 날짜 문자열 (YYYY-MM-DD) - 안전하게 계산
  const currentDateString = useMemo(() => {
    if (
      !currentMonth ||
      !(currentMonth instanceof Date) ||
      isNaN(currentMonth.getTime())
    ) {
      return formatDate(new Date());
    }
    return formatDate(currentMonth);
  }, [currentMonth]);

  useEffect(() => {
    loadMonthData();
  }, [currentMonth]);

  const loadMonthData = async () => {
    try {
      setLoading(true);
      const db = await getDatabase();
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      // 이번달 날짜 범위
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

      // 운동 기록이 있는 날짜들 조회
      const sessions = await db.getAllAsync<{
        date: string;
        routine_code: string;
      }>(
        `SELECT date, routine_code FROM workout_sessions 
         WHERE date >= ? AND date <= ? 
         ORDER BY date ASC`,
        [startDate, endDate]
      );

      // 마크된 날짜 객체 생성
      const marked: MarkedDates = {};
      sessions.forEach((session) => {
        marked[session.date] = {
          marked: true,
          dotColor: workoutColors.completed,
          customStyles: {
            container: {
              borderWidth: 2,
              borderColor: workoutColors.completed,
              borderRadius: 8,
            },
            text: {
              color: theme.text,
            },
          },
        };
      });

      setMarkedDates(marked);
      setLoading(false);
    } catch (error) {
      console.error('월간 데이터 로드 실패:', error);
      setLoading(false);
    }
  };

  const handleDayPress = (day: DateData) => {
    // 특정 날짜 운동 화면으로 이동
    router.push(`/(app)/workout/today?date=${day.dateString}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: workoutColors.bg }]}>
      <CustomHeader title="월별 운동기록" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Calendar
              current={currentDateString}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType="custom"
              monthFormat={'yyyy년 MM월'}
              hideExtraDays={true}
              firstDay={0}
              onMonthChange={(month: { year: number; month: number }) => {
                if (month && month.year && month.month) {
                  setCurrentMonth(new Date(month.year, month.month - 1, 1));
                }
              }}
              theme={{
                backgroundColor: theme.surface,
                calendarBackground: theme.surface,
                textSectionTitleColor: theme.text,
                selectedDayBackgroundColor: workoutColors.accent,
                selectedDayTextColor: '#ffffff',
                todayTextColor: workoutColors.accent,
                dayTextColor: theme.text,
                textDisabledColor: theme.textSecondary,
                dotColor: workoutColors.completed,
                selectedDotColor: workoutColors.completed,
                arrowColor: workoutColors.accent,
                monthTextColor: theme.text,
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
              }}
              style={styles.calendar}
            />
          </View>

          {/* 이번달 통계 */}
          <WorkoutStatistics
            type="month"
            startDate={monthDateRange.startDate}
            endDate={monthDateRange.endDate}
          />

          {/* 이번주 통계 */}
          <WorkoutStatistics
            type="week"
            startDate={weekDateRange.startDate}
            endDate={weekDateRange.endDate}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MonthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    padding: 20,
    borderRadius: 15,
  },
  calendar: {
    borderRadius: 10,
  },
});

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';

import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import { getDatabase } from '@/db/setupDatabase';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

interface WorkoutDate {
  date: string;
  hasWorkout: boolean;
  routineCode: string;
}

const ThisMonthScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [workoutDates, setWorkoutDates] = useState<WorkoutDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthData();
  }, [currentMonth]);

  const loadMonthData = async () => {
    try {
      const db = await getDatabase();
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      // 이번달 날짜 범위
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`;

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

      // 전체 날짜에 대한 데이터 생성
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dates: WorkoutDate[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const session = sessions.find((s) => s.date === dateStr);

        dates.push({
          date: dateStr,
          hasWorkout: !!session,
          routineCode: session?.routine_code || '',
        });
      }

      setWorkoutDates(dates);
      setLoading(false);
    } catch (error) {
      console.error('월간 데이터 로드 실패:', error);
      setLoading(false);
    }
  };

  const handleDatePress = (date: string) => {
    // 오늘 운동 화면으로 이동 (향후 날짜 파라미터로 확장 가능)
    router.push('/(app)/workout/today' as any);
  };

  const renderCalendar = () => {
    if (workoutDates.length === 0) return null;

    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
    const weeks = Math.ceil((firstDay + workoutDates.length) / 7);
    const rows = [];

    for (let week = 0; week < weeks; week++) {
      const weekDays = [];

      for (let day = 0; day < 7; day++) {
        const dateIndex = week * 7 + day - firstDay;
        const workoutDate = workoutDates[dateIndex];

        if (workoutDate) {
          weekDays.push(
            <Pressable
              key={dateIndex}
              onPress={() => handleDatePress(workoutDate.date)}
              style={[
                styles.dateCell,
                { backgroundColor: theme.background },
                workoutDate.hasWorkout && {
                  ...styles.hasWorkoutCell,
                  borderColor: theme.success,
                },
              ]}
            >
              <TextBox
                variant="caption1"
                color={
                  workoutDate.hasWorkout ? theme.success : theme.textSecondary
                }
              >
                {new Date(workoutDate.date).getDate()}
              </TextBox>
              {workoutDate.hasWorkout && (
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={theme.success}
                  style={styles.checkIcon}
                />
              )}
            </Pressable>
          );
        } else {
          weekDays.push(<View key={day} style={styles.dateCell} />);
        }
      }

      rows.push(
        <View key={week} style={styles.weekRow}>
          {weekDays}
        </View>
      );
    }

    return rows;
  };

  const monthName = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="이번달 운동기록" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox variant="title2" color={theme.text} style={styles.heading}>
              {monthName}
            </TextBox>

            {/* 요일 헤더 */}
            <View style={styles.weekHeader}>
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <View key={day} style={styles.dayHeader}>
                  <TextBox
                    variant="caption1"
                    color={index === 0 ? theme.error : theme.text}
                  >
                    {day}
                  </TextBox>
                </View>
              ))}
            </View>

            {/* 캘린더 그리드 */}
            <View style={styles.calendar}>{renderCalendar()}</View>

            {/* 범례 */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={theme.success}
                />
                <TextBox variant="caption2" color={theme.textSecondary}>
                  운동 완료
                </TextBox>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ThisMonthScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  section: { padding: 20, borderRadius: 15 },
  heading: { marginBottom: 16, textAlign: 'center' },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendar: {
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dateCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 2,
  },
  hasWorkoutCell: {
    borderWidth: 2,
  },
  checkIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

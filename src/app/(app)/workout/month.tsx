import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import { getDatabase } from '@/db/setupDatabase';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

import { formatDate } from '@/utils/routine';

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
      };
      text?: {
        color?: string;
      };
    };
  };
}

const MonthScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [loading, setLoading] = useState(true);

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

      // 마크된 날짜 객체 생성
      const marked: MarkedDates = {};
      sessions.forEach((session) => {
        marked[session.date] = {
          marked: true,
          dotColor: theme.success,
          customStyles: {
            container: {
              borderWidth: 2,
              borderColor: theme.success,
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

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const monthName = `${currentMonth.getFullYear()}년 ${
    currentMonth.getMonth() + 1
  }월`;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="월별 운동기록" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            {/* 캘린더 */}
            <Calendar
              current={formatDate(currentMonth)}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType="custom"
              monthFormat={'yyyy년 MM월'}
              hideExtraDays={true}
              firstDay={0}
              onMonthChange={(month) => {
                setCurrentMonth(new Date(month.year, month.month - 1, 1));
              }}
              theme={{
                backgroundColor: theme.surface,
                calendarBackground: theme.surface,
                textSectionTitleColor: theme.text,
                selectedDayBackgroundColor: theme.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: theme.primary,
                dayTextColor: theme.text,
                textDisabledColor: theme.textSecondary,
                dotColor: theme.success,
                selectedDotColor: theme.success,
                arrowColor: theme.primary,
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
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    flex: 1,
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

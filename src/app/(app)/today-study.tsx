import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { useFocusEffect } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TextBox from '@/components/common/TextBox';
import { CustomHeader } from '@/components/layout/CustomHeader';

import { STUDY_GOALS } from './checklist';

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

const STORAGE_KEY_GOALS = '@study_goals_2026';
const STORAGE_KEY_TODAY_STUDY = '@today_study_goal';
const STORAGE_KEY_STUDY_DATES = '@study_dates_2026';
const STORAGE_KEY_ALGORITHM_DATES = '@algorithm_dates_2026';

// 날짜를 YYYY-MM-DD 형식으로 변환
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 모든 목표를 평탄화하여 순서대로 배열로 만듦
const getAllGoalsFlat = () => {
  const allGoals: Array<{ id: string; text: string }> = [];
  STUDY_GOALS.forEach((monthData) => {
    monthData.goals.forEach((goal) => {
      allGoals.push(goal);
    });
  });
  return allGoals;
};

// 다음 목표 찾기
const getNextGoal = (checkedGoals: Record<string, boolean>) => {
  const allGoals = getAllGoalsFlat();
  for (const goal of allGoals) {
    if (!checkedGoals[goal.id]) {
      return goal;
    }
  }
  return null;
};

interface MarkedDates {
  [key: string]: {
    marked?: boolean;
    dotColor?: string;
    customStyles?: {
      container?: {
        borderWidth?: number;
        borderColor?: string;
        borderRadius?: number;
        backgroundColor?: string;
      };
      text?: {
        color?: string;
      };
    };
  };
}

export default function TodayStudyScreen() {
  const { theme, isDarkMode } = useTheme();
  const [todayGoal, setTodayGoal] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [checkedGoals, setCheckedGoals] = useState<Record<string, boolean>>({});
  const [studyDates, setStudyDates] = useState<Set<string>>(new Set());
  const [algorithmDates, setAlgorithmDates] = useState<Set<string>>(new Set());
  const [isTodayStudied, setIsTodayStudied] = useState(false);
  const [isTodayAlgorithmSolved, setIsTodayAlgorithmSolved] = useState(false);

  const today = useMemo(() => new Date(), []);
  const todayString = formatDate(today);

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      // 체크된 목표 로드
      const storedGoals = await AsyncStorage.getItem(STORAGE_KEY_GOALS);
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        setCheckedGoals(goals);
        // 다음 목표 찾기
        const nextGoal = getNextGoal(goals);
        setTodayGoal(nextGoal);
      } else {
        // 처음 시작할 때는 첫 번째 목표
        const allGoals = getAllGoalsFlat();
        if (allGoals.length > 0) {
          setTodayGoal(allGoals[0]);
        }
      }

      // 공부한 날짜 로드
      const storedDates = await AsyncStorage.getItem(STORAGE_KEY_STUDY_DATES);
      if (storedDates) {
        const dates = JSON.parse(storedDates);
        setStudyDates(new Set(dates));
        setIsTodayStudied(dates.includes(todayString));
      }

      // 알고리즘 문제풀이 날짜 로드
      const storedAlgorithmDates = await AsyncStorage.getItem(
        STORAGE_KEY_ALGORITHM_DATES
      );
      if (storedAlgorithmDates) {
        const dates = JSON.parse(storedAlgorithmDates);
        setAlgorithmDates(new Set(dates));
        setIsTodayAlgorithmSolved(dates.includes(todayString));
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  }, [todayString]);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // 오늘 공부 체크/해제
  const toggleTodayStudy = async () => {
    const newIsStudied = !isTodayStudied;
    setIsTodayStudied(newIsStudied);

    const newStudyDates = new Set(studyDates);
    if (newIsStudied) {
      newStudyDates.add(todayString);
    } else {
      newStudyDates.delete(todayString);
    }
    setStudyDates(newStudyDates);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_STUDY_DATES,
        JSON.stringify(Array.from(newStudyDates))
      );
    } catch (error) {
      console.error('공부 날짜 저장 실패:', error);
    }
  };

  // 알고리즘 문제풀이 체크/해제
  const toggleAlgorithmStudy = async () => {
    const newIsSolved = !isTodayAlgorithmSolved;
    setIsTodayAlgorithmSolved(newIsSolved);

    const newAlgorithmDates = new Set(algorithmDates);
    if (newIsSolved) {
      newAlgorithmDates.add(todayString);
    } else {
      newAlgorithmDates.delete(todayString);
    }
    setAlgorithmDates(newAlgorithmDates);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_ALGORITHM_DATES,
        JSON.stringify(Array.from(newAlgorithmDates))
      );
    } catch (error) {
      console.error('알고리즘 날짜 저장 실패:', error);
    }
  };

  // 목표 체크 시 다음 목표로 업데이트
  useEffect(() => {
    const updateTodayGoal = async () => {
      const nextGoal = getNextGoal(checkedGoals);
      setTodayGoal(nextGoal);
      try {
        if (nextGoal) {
          await AsyncStorage.setItem(
            STORAGE_KEY_TODAY_STUDY,
            JSON.stringify(nextGoal)
          );
        }
      } catch (error) {
        console.error('오늘의 공부 목표 저장 실패:', error);
      }
    };

    updateTodayGoal();
  }, [checkedGoals]);

  // 캘린더 마킹 데이터 생성 (공부한 날짜와 알고리즘 문제풀이 날짜 모두 표시)
  const markedDates: MarkedDates = useMemo(() => {
    const marked: MarkedDates = {};
    const allDates = new Set([...studyDates, ...algorithmDates]);
    allDates.forEach((date) => {
      const hasStudy = studyDates.has(date);
      const hasAlgorithm = algorithmDates.has(date);

      // 둘 다 있으면 primary 색상, 하나만 있으면 secondary 색상
      const dotColor =
        hasStudy && hasAlgorithm ? theme.primary : theme.secondary;
      const bgColor =
        hasStudy && hasAlgorithm
          ? theme.primary + '20'
          : theme.secondary + '20';

      marked[date] = {
        marked: true,
        dotColor: dotColor,
        customStyles: {
          container: {
            backgroundColor: bgColor,
            borderRadius: 20,
          },
          text: {
            color: dotColor,
          },
        },
      };
    });
    return marked;
  }, [studyDates, algorithmDates, theme.primary, theme.secondary]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <CustomHeader title="오늘의 공부" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* 오늘의 공부 목표 */}
        <View style={[styles.goalSection, { backgroundColor: theme.surface }]}>
          <TextBox
            variant="body2"
            color={theme.text}
            style={styles.sectionTitle}
          >
            오늘의 공부 목표
          </TextBox>
          {todayGoal ? (
            <View style={styles.goalContent}>
              <TextBox
                variant="body3"
                color={theme.text}
                style={styles.goalText}
              >
                {todayGoal.text}
              </TextBox>
            </View>
          ) : (
            <View style={styles.goalContent}>
              <TextBox
                variant="body4"
                color={theme.textSecondary}
                style={styles.goalText}
              >
                모든 목표를 완료했습니다! 🎉
              </TextBox>
            </View>
          )}
        </View>

        {/* 오늘 공부 체크 */}
        <View style={[styles.checkSection, { backgroundColor: theme.surface }]}>
          <TextBox
            variant="body2"
            color={theme.text}
            style={styles.sectionTitle}
          >
            오늘 공부했나요?
          </TextBox>
          <Pressable style={styles.checkButton} onPress={toggleTodayStudy}>
            <View
              style={[
                styles.checkCircle,
                {
                  backgroundColor: isTodayStudied
                    ? theme.primary
                    : 'transparent',
                  borderColor: isTodayStudied ? theme.primary : theme.border,
                },
              ]}
            >
              {isTodayStudied && (
                <MaterialIcons name="check" size={18} color="#fff" />
              )}
            </View>
            <TextBox
              variant="body3"
              color={isTodayStudied ? theme.primary : theme.text}
              style={styles.checkText}
            >
              {isTodayStudied ? '오늘 공부 완료!' : '공부 완료 체크'}
            </TextBox>
          </Pressable>
        </View>

        {/* 알고리즘 문제풀이 체크 */}
        <View style={[styles.checkSection, { backgroundColor: theme.surface }]}>
          <TextBox
            variant="body2"
            color={theme.text}
            style={styles.sectionTitle}
          >
            알고리즘 문제풀이
          </TextBox>
          <Pressable style={styles.checkButton} onPress={toggleAlgorithmStudy}>
            <View
              style={[
                styles.checkCircle,
                {
                  backgroundColor: isTodayAlgorithmSolved
                    ? theme.secondary
                    : 'transparent',
                  borderColor: isTodayAlgorithmSolved
                    ? theme.secondary
                    : theme.border,
                },
              ]}
            >
              {isTodayAlgorithmSolved && (
                <MaterialIcons name="check" size={18} color="#fff" />
              )}
            </View>
            <TextBox
              variant="body4"
              color={isTodayAlgorithmSolved ? theme.secondary : theme.text}
              style={styles.checkText}
            >
              {isTodayAlgorithmSolved
                ? '오늘 알고리즘 문제풀이 완료!'
                : '알고리즘 문제풀이 체크'}
            </TextBox>
          </Pressable>
        </View>

        {/* 캘린더 */}
        <View
          style={[styles.calendarSection, { backgroundColor: theme.surface }]}
        >
          <TextBox
            variant="body2"
            color={theme.text}
            style={styles.sectionTitle}
          >
            공부 기록 캘린더
          </TextBox>
          <Calendar
            current={todayString}
            markedDates={markedDates}
            markingType="custom"
            monthFormat={'yyyy년 MM월'}
            hideExtraDays={true}
            firstDay={0}
            theme={{
              backgroundColor: theme.surface,
              calendarBackground: theme.surface,
              textSectionTitleColor: theme.text,
              selectedDayBackgroundColor: theme.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: theme.primary,
              dayTextColor: theme.text,
              textDisabledColor: theme.textSecondary,
              dotColor: theme.primary,
              selectedDotColor: theme.primary,
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
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: theme.primary + '20' },
                ]}
              />
              <TextBox variant="caption2" color={theme.textSecondary}>
                공부 + 알고리즘
              </TextBox>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: theme.secondary + '20' },
                ]}
              />
              <TextBox variant="caption2" color={theme.textSecondary}>
                공부 또는 알고리즘
              </TextBox>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  goalSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  checkSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  calendarSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  goalContent: {
    paddingVertical: 12,
  },
  goalText: {
    lineHeight: 24,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    flex: 1,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

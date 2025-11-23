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
import {
  getAllTodoDates,
  toggleTodo,
  isTodoChecked,
} from '@/db/todayTodoRepository';

import TextBox from '@/components/common/TextBox';
import { CustomHeader } from '@/components/layout/CustomHeader';

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

// 날짜를 YYYY-MM-DD 형식으로 변환
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const [studyDates, setStudyDates] = useState<Set<string>>(new Set());
  const [algorithmDates, setAlgorithmDates] = useState<Set<string>>(new Set());
  const [bodyweightDates, setBodyweightDates] = useState<Set<string>>(
    new Set()
  );
  const [readingDates, setReadingDates] = useState<Set<string>>(new Set());
  const [runningDates, setRunningDates] = useState<Set<string>>(new Set());
  const [healthDates, setHealthDates] = useState<Set<string>>(new Set());
  const [isTodayStudied, setIsTodayStudied] = useState(false);
  const [isTodayAlgorithmSolved, setIsTodayAlgorithmSolved] = useState(false);
  const [isTodayBodyweightDone, setIsTodayBodyweightDone] = useState(false);
  const [isTodayReadingDone, setIsTodayReadingDone] = useState(false);
  const [isTodayRunningDone, setIsTodayRunningDone] = useState(false);
  const [isTodayHealthDone, setIsTodayHealthDone] = useState(false);

  const today = useMemo(() => new Date(), []);
  const todayString = formatDate(today);

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      // 모든 TODO 날짜 로드
      const allDates = await getAllTodoDates();
      setStudyDates(allDates.study);
      setAlgorithmDates(allDates.algorithm);
      setBodyweightDates(allDates.bodyweight);
      setReadingDates(allDates.reading);
      setRunningDates(allDates.running);
      setHealthDates(allDates.health);

      // 오늘 날짜 체크 상태 확인
      const [
        isStudied,
        isAlgorithmSolved,
        isBodyweightDone,
        isReadingDone,
        isRunningDone,
        isHealthDone,
      ] = await Promise.all([
        isTodoChecked(todayString, 'study'),
        isTodoChecked(todayString, 'algorithm'),
        isTodoChecked(todayString, 'bodyweight'),
        isTodoChecked(todayString, 'reading'),
        isTodoChecked(todayString, 'running'),
        isTodoChecked(todayString, 'health'),
      ]);

      setIsTodayStudied(isStudied);
      setIsTodayAlgorithmSolved(isAlgorithmSolved);
      setIsTodayBodyweightDone(isBodyweightDone);
      setIsTodayReadingDone(isReadingDone);
      setIsTodayRunningDone(isRunningDone);
      setIsTodayHealthDone(isHealthDone);
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

    try {
      await toggleTodo(todayString, 'study', newIsStudied);
      const newStudyDates = new Set(studyDates);
      if (newIsStudied) {
        newStudyDates.add(todayString);
      } else {
        newStudyDates.delete(todayString);
      }
      setStudyDates(newStudyDates);
    } catch (error) {
      console.error('공부 날짜 저장 실패:', error);
      setIsTodayStudied(!newIsStudied); // 롤백
    }
  };

  // 알고리즘 문제풀이 체크/해제
  const toggleAlgorithmStudy = async () => {
    const newIsSolved = !isTodayAlgorithmSolved;
    setIsTodayAlgorithmSolved(newIsSolved);

    try {
      await toggleTodo(todayString, 'algorithm', newIsSolved);
      const newAlgorithmDates = new Set(algorithmDates);
      if (newIsSolved) {
        newAlgorithmDates.add(todayString);
      } else {
        newAlgorithmDates.delete(todayString);
      }
      setAlgorithmDates(newAlgorithmDates);
    } catch (error) {
      console.error('알고리즘 날짜 저장 실패:', error);
      setIsTodayAlgorithmSolved(!newIsSolved); // 롤백
    }
  };

  // 맨몸운동 체크/해제
  const toggleBodyweight = async () => {
    const newIsDone = !isTodayBodyweightDone;
    setIsTodayBodyweightDone(newIsDone);

    try {
      await toggleTodo(todayString, 'bodyweight', newIsDone);
      const newBodyweightDates = new Set(bodyweightDates);
      if (newIsDone) {
        newBodyweightDates.add(todayString);
      } else {
        newBodyweightDates.delete(todayString);
      }
      setBodyweightDates(newBodyweightDates);
    } catch (error) {
      console.error('맨몸운동 날짜 저장 실패:', error);
      setIsTodayBodyweightDone(!newIsDone); // 롤백
    }
  };

  // 독서 체크/해제
  const toggleReading = async () => {
    const newIsDone = !isTodayReadingDone;
    setIsTodayReadingDone(newIsDone);

    try {
      await toggleTodo(todayString, 'reading', newIsDone);
      const newReadingDates = new Set(readingDates);
      if (newIsDone) {
        newReadingDates.add(todayString);
      } else {
        newReadingDates.delete(todayString);
      }
      setReadingDates(newReadingDates);
    } catch (error) {
      console.error('독서 날짜 저장 실패:', error);
      setIsTodayReadingDone(!newIsDone); // 롤백
    }
  };

  // 런닝 체크/해제
  const toggleRunning = async () => {
    const newIsDone = !isTodayRunningDone;
    setIsTodayRunningDone(newIsDone);

    try {
      await toggleTodo(todayString, 'running', newIsDone);
      const newRunningDates = new Set(runningDates);
      if (newIsDone) {
        newRunningDates.add(todayString);
      } else {
        newRunningDates.delete(todayString);
      }
      setRunningDates(newRunningDates);
    } catch (error) {
      console.error('런닝 날짜 저장 실패:', error);
      setIsTodayRunningDone(!newIsDone); // 롤백
    }
  };

  // 헬스 체크/해제
  const toggleHealth = async () => {
    const newIsDone = !isTodayHealthDone;
    setIsTodayHealthDone(newIsDone);

    try {
      await toggleTodo(todayString, 'health', newIsDone);
      const newHealthDates = new Set(healthDates);
      if (newIsDone) {
        newHealthDates.add(todayString);
      } else {
        newHealthDates.delete(todayString);
      }
      setHealthDates(newHealthDates);
    } catch (error) {
      console.error('헬스 날짜 저장 실패:', error);
      setIsTodayHealthDone(!newIsDone); // 롤백
    }
  };

  // 캘린더 마킹 데이터 생성 (모든 체크 항목 날짜 표시)
  const markedDates: MarkedDates = useMemo(() => {
    const marked: MarkedDates = {};
    const allDates = new Set([
      ...studyDates,
      ...algorithmDates,
      ...bodyweightDates,
      ...readingDates,
      ...runningDates,
      ...healthDates,
    ]);

    allDates.forEach((date) => {
      const hasStudy = studyDates.has(date);
      const hasAlgorithm = algorithmDates.has(date);
      const hasBodyweight = bodyweightDates.has(date);
      const hasReading = readingDates.has(date);
      const hasRunning = runningDates.has(date);
      const hasHealth = healthDates.has(date);

      // 체크된 항목 개수에 따라 색상 결정
      const checkedCount =
        (hasStudy ? 1 : 0) +
        (hasAlgorithm ? 1 : 0) +
        (hasBodyweight ? 1 : 0) +
        (hasReading ? 1 : 0) +
        (hasRunning ? 1 : 0) +
        (hasHealth ? 1 : 0);

      // 6개 모두 체크: primary, 4-5개: secondary, 1-3개: accent
      let dotColor: string;
      let bgColor: string;

      if (checkedCount === 6) {
        dotColor = theme.primary;
        bgColor = theme.primary + '30';
      } else if (checkedCount >= 4) {
        dotColor = theme.secondary;
        bgColor = theme.secondary + '20';
      } else {
        dotColor = theme.textSecondary;
        bgColor = theme.textSecondary + '10';
      }

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
  }, [
    studyDates,
    algorithmDates,
    bodyweightDates,
    readingDates,
    runningDates,
    healthDates,
    theme.primary,
    theme.secondary,
    theme.textSecondary,
  ]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <CustomHeader title="TODAY-TODO-LIST" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* 체크리스트 컨테이너 */}
        <View
          style={[
            styles.checklistContainer,
            { backgroundColor: theme.surface },
          ]}
        >
          {/* 공부 완료 체크 */}
          <Pressable style={styles.checkItem} onPress={toggleTodayStudy}>
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
              공부 완료
            </TextBox>
          </Pressable>

          {/* 알고리즘 문제풀이 체크 */}
          <Pressable style={styles.checkItem} onPress={toggleAlgorithmStudy}>
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
              variant="body3"
              color={isTodayAlgorithmSolved ? theme.secondary : theme.text}
              style={styles.checkText}
            >
              알고리즘 문제풀이
            </TextBox>
          </Pressable>

          {/* 맨몸운동 체크 */}
          <Pressable style={styles.checkItem} onPress={toggleBodyweight}>
            <View
              style={[
                styles.checkCircle,
                {
                  backgroundColor: isTodayBodyweightDone
                    ? '#FF6B6B'
                    : 'transparent',
                  borderColor: isTodayBodyweightDone ? '#FF6B6B' : theme.border,
                },
              ]}
            >
              {isTodayBodyweightDone && (
                <MaterialIcons name="check" size={18} color="#fff" />
              )}
            </View>
            <TextBox
              variant="body3"
              color={isTodayBodyweightDone ? '#FF6B6B' : theme.text}
              style={styles.checkText}
            >
              맨몸운동 (계단, 푸쉬업, 물구나무, 매달리기)
            </TextBox>
          </Pressable>

          {/* 독서 체크 */}
          <Pressable style={styles.checkItem} onPress={toggleReading}>
            <View
              style={[
                styles.checkCircle,
                {
                  backgroundColor: isTodayReadingDone
                    ? '#06B6D4'
                    : 'transparent',
                  borderColor: isTodayReadingDone ? '#06B6D4' : theme.border,
                },
              ]}
            >
              {isTodayReadingDone && (
                <MaterialIcons name="check" size={18} color="#fff" />
              )}
            </View>
            <TextBox
              variant="body3"
              color={isTodayReadingDone ? '#06B6D4' : theme.text}
              style={styles.checkText}
            >
              독서
            </TextBox>
          </Pressable>

          {/* 런닝 체크 */}
          <Pressable style={styles.checkItem} onPress={toggleRunning}>
            <View
              style={[
                styles.checkCircle,
                {
                  backgroundColor: isTodayRunningDone
                    ? '#10B981'
                    : 'transparent',
                  borderColor: isTodayRunningDone ? '#10B981' : theme.border,
                },
              ]}
            >
              {isTodayRunningDone && (
                <MaterialIcons name="check" size={18} color="#fff" />
              )}
            </View>
            <TextBox
              variant="body3"
              color={isTodayRunningDone ? '#10B981' : theme.text}
              style={styles.checkText}
            >
              런닝
            </TextBox>
          </Pressable>

          {/* 헬스 체크 */}
          <Pressable style={styles.checkItem} onPress={toggleHealth}>
            <View
              style={[
                styles.checkCircle,
                {
                  backgroundColor: isTodayHealthDone
                    ? '#8B5CF6'
                    : 'transparent',
                  borderColor: isTodayHealthDone ? '#8B5CF6' : theme.border,
                },
              ]}
            >
              {isTodayHealthDone && (
                <MaterialIcons name="check" size={18} color="#fff" />
              )}
            </View>
            <TextBox
              variant="body3"
              color={isTodayHealthDone ? '#8B5CF6' : theme.text}
              style={styles.checkText}
            >
              헬스
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
                  { backgroundColor: theme.primary + '30' },
                ]}
              />
              <TextBox variant="caption2" color={theme.textSecondary}>
                6개 모두 완료
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
                4-5개 완료
              </TextBox>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: theme.textSecondary + '10' },
                ]}
              />
              <TextBox variant="caption2" color={theme.textSecondary}>
                1-3개 완료
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
  checklistContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    gap: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  calendarSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
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

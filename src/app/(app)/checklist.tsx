import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TextBox from '@/components/common/TextBox';
import { CustomHeader } from '@/components/layout/CustomHeader';

interface Goal {
  id: string;
  text: string;
}

interface MonthData {
  month: number;
  label: string;
  goals: Goal[];
}

export const STUDY_GOALS: MonthData[] = [
  {
    month: 1,
    label: '11~1월: JS + 알고리즘 (6권, 3개월)',
    goals: [
      { id: '1-1', text: '1-2주차: 자바스크립트 자료구조 알고리즘' },
      { id: '1-2', text: '3-4주차: 코딩테스트 합격자 되기' },
      { id: '1-3', text: '5-6주차: 자바스크립트 Deep Dive' },
      { id: '1-4', text: '7-8주차: 코어 자바스크립트' },
      { id: '1-5', text: '9-10주차: 자바스크립트 퀴즈북' },
      { id: '1-6', text: '11-12주차: 추가 학습 및 정리' },
    ],
  },
  {
    month: 2,
    label: '2월: OS/리눅스 (2권, 1개월)',
    goals: [
      { id: '2-1', text: '1-2주차: 운영체제' },
      { id: '2-2', text: '3-4주차: 리눅스' },
    ],
  },
  {
    month: 3,
    label: '3월~4월 : 앱 언어 (3권, 1.5개월)',
    goals: [
      { id: '3-1', text: '1-2주차: 안드로이드 - 자바 (혼자 공부하는 자바)' },
      { id: '3-2', text: '3-4주차: 안드로이드 - 코틀린 (코틀린 완벽 가이드)' },
      { id: '3-3', text: '5-6주차: IOS - 스위프트 데이터 구조와 알고리즘' },
    ],
  },
  {
    month: 4,
    label: '4월 ~5월 : 운동앱 (4주, 1개월)',
    goals: [
      { id: '4-1', text: '1주차: React Native로 운동앱 개발' },
      { id: '4-2', text: '2주차: 안드로이드로 운동앱 개발' },
      { id: '4-3', text: '3주차: IOS로 운동앱 개발' },
      { id: '4-4', text: '4주차: 기능별로 비교 및 분석' },
    ],
  },
  {
    month: 5,
    label: '5월 ~6월 : RN + React (2권, 1개월)',
    goals: [
      { id: '5-1', text: '1-2주차: 인사이드 리액트' },
      { id: '5-2', text: '3-4주차: 리액트 네이티브' },
    ],
  },
  {
    month: 6,
    label: '6월 ~8월 : Android 심화 (4권, 2개월)',
    goals: [
      { id: '6-1', text: '1-2주차: 핵심만 골라 배우는 젯팩 컴포즈' },
      { id: '6-2', text: '3-4주차: 안드로이드 개발 레벨업 교과서' },
      { id: '6-3', text: '5-6주차: 인사이드 안드로이드 OS' },
      { id: '6-4', text: '7-8주차: 안드로이드 시스템 프로그래밍 완전정복' },
    ],
  },
  {
    month: 7,
    label: '8월 ~11월 : Android 보안 (6권, 3개월)',
    goals: [
      { id: '7-1', text: '1-2주차: 안드로이드 모의해킹 입문 (실습 기반)' },
      { id: '7-2', text: '3-4주차: 안드로이드 모바일 앱 모의해킹' },
      { id: '7-3', text: '5-6주차: 안드로이드 해킹과 보안' },
      {
        id: '7-4',
        text: '7-8주차: 안드로이드 모바일 악성코드와 모의 해킹 진단',
      },
      { id: '7-5', text: '9-10주차: 안드로이드 포렌식' },
      { id: '7-6', text: '11-12주차: 안드로이드 NDK 프로그래밍' },
    ],
  },
  {
    month: 8,
    label: '11월 ~12월 : iOS (2권, 1개월)',
    goals: [
      { id: '8-1', text: '1-2주차: iOS 책 1' },
      { id: '8-2', text: '3-4주차: iOS 책 2' },
    ],
  },
  {
    month: 9,
    label: '12월 ~2027.02: AI (5권, 2.5개월)',
    goals: [
      {
        id: '9-1',
        text: '1주차: 요즘 바이브 코딩 커서 AI 30가지 프로그램 만들기',
      },
      { id: '9-2', text: '2주차: 10분만에 따라 하는 Claude MCP 업무 자동화' },
      { id: '9-3', text: '3주차: MCP로 똑똑하게 일하는 법' },
      { id: '9-4', text: '4주차: 클로드 코드' },
      { id: '9-5', text: '5주차: 요즘 바이브 코딩 클로드 코드 완벽 가이드' },
    ],
  },
];

const STORAGE_KEY = '@study_goals_2026';

export default function ChecklistScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const [checkedGoals, setCheckedGoals] = useState<Record<string, boolean>>({});
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>(
    {}
  );

  // 체크 상태 로드
  useEffect(() => {
    loadCheckedGoals();
  }, []);

  const loadCheckedGoals = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        // JSON 파싱을 안전하게 처리
        const parsed = JSON.parse(stored);
        // 파싱된 데이터가 유효한 객체인지 확인
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setCheckedGoals(parsed);
        } else {
          console.warn('저장된 데이터 형식이 올바르지 않습니다. 초기화합니다.');
          // 잘못된 데이터는 삭제하고 빈 객체로 초기화
          await AsyncStorage.removeItem(STORAGE_KEY);
          setCheckedGoals({});
        }
      }
    } catch (error) {
      console.error('체크 상태 로드 실패:', error);
      // JSON 파싱 실패 시 저장된 데이터 삭제
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (removeError) {
        console.error('저장된 데이터 삭제 실패:', removeError);
      }
      // 빈 객체로 초기화
      setCheckedGoals({});
    }
  };

  // 체크 상태 저장
  const saveCheckedGoals = async (newCheckedGoals: Record<string, boolean>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCheckedGoals));
    } catch (error) {
      console.error('체크 상태 저장 실패:', error);
    }
  };

  // 체크박스 토글
  const toggleGoal = (goalId: string) => {
    // checkedGoals가 유효한 객체인지 확인
    const currentGoals =
      checkedGoals &&
      typeof checkedGoals === 'object' &&
      !Array.isArray(checkedGoals)
        ? checkedGoals
        : {};

    const newCheckedGoals = {
      ...currentGoals,
      [goalId]: !currentGoals[goalId],
    };
    setCheckedGoals(newCheckedGoals);
    saveCheckedGoals(newCheckedGoals);
  };

  // 월별 드롭다운 토글
  const toggleMonth = (month: number) => {
    setExpandedMonths({
      ...expandedMonths,
      [month]: !expandedMonths[month],
    });
  };

  // 전체 진행률 계산
  const totalGoals = STUDY_GOALS.reduce(
    (sum, month) => sum + month.goals.length,
    0
  );
  // checkedGoals가 유효한 객체인지 확인 후 진행률 계산
  const completedGoals =
    checkedGoals &&
    typeof checkedGoals === 'object' &&
    !Array.isArray(checkedGoals)
      ? Object.values(checkedGoals).filter(Boolean).length
      : 0;
  const progressPercentage =
    totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <CustomHeader title="2026 학습 목표" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* 진행률 표시 */}
        <View
          style={[styles.progressSection, { backgroundColor: theme.surface }]}
        >
          <TextBox
            variant="body2"
            color={theme.text}
            style={styles.progressTitle}
          >
            전체 진행률
          </TextBox>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
          <TextBox
            variant="body4"
            color={theme.textSecondary}
            style={styles.progressText}
          >
            {completedGoals} / {totalGoals} 완료 (
            {Math.round(progressPercentage)}%)
          </TextBox>
        </View>

        {/* 월별 체크리스트 */}
        {STUDY_GOALS.map((monthData) => (
          <View
            key={monthData.month}
            style={[styles.monthSection, { backgroundColor: theme.surface }]}
          >
            <Pressable
              style={[styles.monthHeader]}
              onPress={() => toggleMonth(monthData.month)}
            >
              <TextBox variant="body2" color={theme.text}>
                {monthData.label}
              </TextBox>
              <MaterialIcons
                name={
                  expandedMonths[monthData.month]
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={24}
                color={theme.text}
              />
            </Pressable>

            {expandedMonths[monthData.month] && (
              <View style={styles.goalsContainer}>
                {monthData.goals.map((goal) => (
                  <Pressable
                    key={goal.id}
                    style={styles.goalItem}
                    onPress={() => toggleGoal(goal.id)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor:
                            checkedGoals && checkedGoals[goal.id]
                              ? theme.primary
                              : 'transparent',
                          borderColor:
                            checkedGoals && checkedGoals[goal.id]
                              ? theme.primary
                              : theme.border,
                        },
                      ]}
                    >
                      {checkedGoals && checkedGoals[goal.id] && (
                        <MaterialIcons name="check" size={16} color="#fff" />
                      )}
                    </View>
                    <TextBox
                      variant="body4"
                      style={[
                        styles.goalText,
                        checkedGoals &&
                          checkedGoals[goal.id] && {
                            textDecorationLine: 'line-through',
                            opacity: 0.6,
                          },
                      ]}
                      color={
                        checkedGoals && checkedGoals[goal.id]
                          ? theme.textSecondary
                          : theme.text
                      }
                    >
                      {goal.text}
                    </TextBox>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
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
  progressSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  progressTitle: {
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
  },
  monthSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  goalsContainer: {
    paddingTop: 12,
    paddingLeft: 8,
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    flex: 1,
  },
  todayStudyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
    gap: 8,
  },
  todayStudyText: {
    marginLeft: 4,
  },
});

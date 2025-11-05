import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';
import ExerciseMaxValues from '@/components/workout/ExerciseMaxValues';

import { formatDate } from '@/utils/routine';

const WorkoutMainScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const navigationButtons: {
    type: 'today' | 'month' | 'week' | 'hang';
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    route: string;
    handler?: () => void;
  }[] = [
    {
      type: 'today',
      title: '오늘의 운동',
      icon: 'today',
      route: 'workout/today',
      handler: () => {
        const today = new Date();
        router.push(`/(app)/workout/today?date=${formatDate(today)}` as any);
      },
    },
    {
      type: 'month',
      title: '월별 기록 보기',
      icon: 'calendar-view-month',
      route: 'workout/month',
    },
    {
      type: 'week',
      title: '종목별 기록 보기',
      icon: 'fitness-center',
      route: 'workout/exercises',
    },
    {
      type: 'hang',
      title: '철봉 매달리기',
      icon: 'accessibility',
      route: 'workout/hang',
      handler: () => {
        router.push('/(app)/workout/hang' as any);
      },
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.workoutBg }]}>
      <CustomHeader title="5 x 5 스트렝스 훈련" showBackButton={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.content}>
          {/* 종목별 최고 중량 */}
          <ExerciseMaxValues />

          {/* 네비게이션 버튼 */}
          <View style={styles.navigationSection}>
            <TextBox variant="title3" color={theme.text} style={styles.heading}>
              운동 기록 보기
            </TextBox>
            <View style={styles.navigationGrid}>
              {navigationButtons.map((button, index) => (
                <Pressable
                  key={index}
                  onPress={
                    button.handler ||
                    (() => router.push(`/(app)/${button.route}` as any))
                  }
                  style={({ pressed }) => [
                    styles.navButton,
                    {
                      width:
                        button.type === 'today' || button.type === 'hang'
                          ? '100%'
                          : '48%',
                      backgroundColor: theme.surface,
                      borderColor: theme.accentOrange,
                      borderWidth: 2,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <MaterialIcons
                    name={button.icon}
                    size={32}
                    color={theme.accentOrange}
                  />
                  <TextBox
                    variant="body2"
                    color={theme.text}
                    style={styles.navButtonText}
                  >
                    {button.title}
                  </TextBox>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkoutMainScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  heading: { marginBottom: 16 },
  navigationSection: {
    paddingBottom: 20,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navButton: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    marginTop: 12,
    textAlign: 'center',
  },
});

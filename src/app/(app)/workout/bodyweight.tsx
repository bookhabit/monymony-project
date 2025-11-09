import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';
import BodyweightExerciseCard from '@/components/workout/BodyweightExerciseCard';
import ErrorState from '@/components/workout/ErrorState';
import LoadingState from '@/components/workout/LoadingState';
import RestTimer from '@/components/workout/RestTimer';
import Stopwatch from '@/components/workout/Stopwatch';

import { useBodyweightWorkout } from '@/hooks/workout/useBodyweightWorkout';

import { formatDate } from '@/utils/routine';

const BodyweightScreen = () => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { exercises, loading, error, saveExercise, deleteExercise } =
    useBodyweightWorkout(selectedDate);

  const formattedDate = useMemo(() => formatDate(selectedDate), [selectedDate]);

  const changeDate = (offset: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + offset);
      return next;
    });
  };

  const resetToToday = () => {
    setSelectedDate(new Date());
  };

  if (loading) {
    return <LoadingState message="맨몸 운동 데이터를 불러오는 중..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.workoutBg }]}>
      <CustomHeader title="맨몸 운동" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.dateSelector,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable
            onPress={() => changeDate(-1)}
            style={({ pressed }) => [
              styles.dateButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <MaterialIcons name="chevron-left" size={28} color={theme.text} />
          </Pressable>
          <Pressable
            onPress={resetToToday}
            style={({ pressed }) => [
              styles.dateLabel,
              pressed && { opacity: 0.7 },
            ]}
          >
            <TextBox variant="title4" color={theme.text}>
              {formattedDate}
            </TextBox>
            <TextBox variant="caption2" color={theme.textSecondary}>
              탭하여 오늘 날짜로 이동
            </TextBox>
          </Pressable>
          <Pressable
            onPress={() => changeDate(1)}
            style={({ pressed }) => [
              styles.dateButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <MaterialIcons name="chevron-right" size={28} color={theme.text} />
          </Pressable>
        </View>

        {exercises.map((exercise) => (
          <BodyweightExerciseCard
            key={exercise.type}
            exercise={exercise}
            onSave={async (type, sets) => {
              await saveExercise(type, sets);
              return true;
            }}
            onDelete={async (type) => {
              await deleteExercise(type);
              return true;
            }}
          />
        ))}
        <RestTimer defaultSeconds={90} />
        <Stopwatch />
      </ScrollView>
    </View>
  );
};

export default BodyweightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateButton: {
    padding: 8,
  },
  dateLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tip: {
    lineHeight: 20,
    marginBottom: 8,
  },
});

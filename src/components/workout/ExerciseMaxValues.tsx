import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

import { workoutPalette } from '@/constants/colors';

import { useAllExercises } from '@/hooks/workout/useAllExercises';

const ExerciseMaxValues: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const workoutColors = isDarkMode
    ? {
        accent: workoutPalette.accentOrange.dark,
      }
    : {
        accent: workoutPalette.accentOrange.light,
      };
  const { exercises, loading, error } = useAllExercises();

  return (
    <>
      <TextBox variant="title3" color={theme.text} style={styles.heading}>
        종목별 현재 최고 중량
      </TextBox>
      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.surface,
            borderLeftWidth: 4,
            borderLeftColor: workoutColors.accent,
          },
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <TextBox
              variant="body2"
              color={theme.textSecondary}
              style={styles.loadingText}
            >
              운동 데이터 로딩 중...
            </TextBox>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color={theme.error} />
            <TextBox
              variant="body2"
              color={theme.error}
              style={styles.errorText}
            >
              {error}
            </TextBox>
          </View>
        ) : exercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={48} color={theme.textSecondary} />
            <TextBox
              variant="body2"
              color={theme.textSecondary}
              style={styles.emptyText}
            >
              등록된 운동이 없습니다
            </TextBox>
          </View>
        ) : (
          <View style={styles.exercisesList}>
            {exercises.map((exercise) => (
              <View
                key={exercise.id}
                style={[
                  styles.exerciseRow,
                  {
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <TextBox
                  variant="body2"
                  color={theme.text}
                  style={styles.exerciseName}
                >
                  {exercise.name}
                </TextBox>
                <TextBox
                  variant="body2"
                  color={workoutColors.accent}
                  style={styles.maxValue}
                >
                  {exercise.slug === 'pullup'
                    ? exercise.maxReps
                      ? `${exercise.maxReps}개`
                      : '-'
                    : exercise.maxWeight
                      ? `${exercise.maxWeight}kg`
                      : '-'}
                </TextBox>
              </View>
            ))}
          </View>
        )}
      </View>
    </>
  );
};

export default ExerciseMaxValues;

const styles = StyleSheet.create({
  heading: {
    marginBottom: 16,
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
  },
  exercisesList: {
    gap: 0,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  exerciseName: {
    flex: 1,
  },
  maxValue: {
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

import { workoutPalette } from '@/constants/colors';

import { useAllExercises } from '@/hooks/workout/useAllExercises';

interface WorkoutStatisticsProps {
  type: 'month' | 'week';
  startDate: string;
  endDate: string;
}

const WorkoutStatistics: React.FC<WorkoutStatisticsProps> = ({
  type,
  startDate,
  endDate,
}) => {
  const { theme, isDarkMode } = useTheme();
  const workoutColors = isDarkMode
    ? {
        accent: workoutPalette.accentBlue.dark,
      }
    : {
        accent: workoutPalette.accentBlue.light,
      };
  const [expanded, setExpanded] = useState(true);
  const { exercises, loading, error } = useAllExercises({ startDate, endDate });

  const title = type === 'month' ? '이번달 통계' : '이번주 통계';

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
          <TextBox variant="title3" color={theme.text} style={styles.heading}>
            {title}
          </TextBox>
          <MaterialIcons
            name={expanded ? 'expand-less' : 'expand-more'}
            size={24}
            color={theme.text}
          />
        </Pressable>
        {expanded && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
          </View>
        )}
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
          <TextBox variant="title3" color={theme.text} style={styles.heading}>
            {title}
          </TextBox>
          <MaterialIcons
            name={expanded ? 'expand-less' : 'expand-more'}
            size={24}
            color={theme.text}
          />
        </Pressable>
        {expanded && (
          <View style={styles.errorContainer}>
            <TextBox variant="caption2" color={theme.error}>
              {error}
            </TextBox>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
        <TextBox variant="title3" color={theme.text} style={styles.heading}>
          {title}
        </TextBox>
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={theme.text}
        />
      </Pressable>

      {expanded && (
        <View style={styles.statsList}>
          {exercises.map((exercise) => (
            <View
              key={exercise.id}
              style={[
                styles.statRow,
                {
                  borderBottomColor: theme.border,
                },
              ]}
            >
              <View style={styles.exerciseInfo}>
                <TextBox
                  variant="body2"
                  color={theme.text}
                  style={styles.exerciseName}
                >
                  {exercise.name}
                </TextBox>

                <View style={styles.statsContainer}>
                  {exercise.slug === 'pullup' ? (
                    <>
                      <View style={styles.statItem}>
                        <TextBox
                          variant="caption2"
                          color={theme.textSecondary}
                          style={styles.statLabel}
                        >
                          시작개수
                        </TextBox>
                        <TextBox
                          variant="body2"
                          color={workoutColors.accent}
                          style={styles.statValue}
                        >
                          {exercise.monthStartReps
                            ? `${exercise.monthStartReps}개`
                            : '-'}
                        </TextBox>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <TextBox
                          variant="caption2"
                          color={theme.textSecondary}
                          style={styles.statLabel}
                        >
                          최고개수
                        </TextBox>
                        <TextBox
                          variant="body2"
                          color={workoutColors.accent}
                          style={styles.statValue}
                        >
                          {exercise.monthMaxReps
                            ? `${exercise.monthMaxReps}개`
                            : '-'}
                        </TextBox>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.statItem}>
                        <TextBox
                          variant="caption2"
                          color={theme.textSecondary}
                          style={styles.statLabel}
                        >
                          시작중량
                        </TextBox>
                        <TextBox
                          variant="body2"
                          color={workoutColors.accent}
                          style={styles.statValue}
                        >
                          {exercise.monthStartWeight
                            ? `${exercise.monthStartWeight}kg`
                            : '-'}
                        </TextBox>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <TextBox
                          variant="caption2"
                          color={theme.textSecondary}
                          style={styles.statLabel}
                        >
                          최고중량
                        </TextBox>
                        <TextBox
                          variant="body2"
                          color={workoutColors.accent}
                          style={styles.statValue}
                        >
                          {exercise.monthMaxWeight
                            ? `${exercise.monthMaxWeight}kg`
                            : '-'}
                        </TextBox>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default WorkoutStatistics;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  statsList: {
    gap: 0,
  },
  statRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  exerciseInfo: {
    gap: 8,
  },
  exerciseName: {
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flex: 1,
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
});

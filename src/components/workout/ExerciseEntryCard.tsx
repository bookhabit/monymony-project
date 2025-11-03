import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

import type { ExerciseEntry } from '@/hooks/workout/useExerciseEntries';

interface ExerciseEntryCardProps {
  entry: ExerciseEntry;
}

const ExerciseEntryCard: React.FC<ExerciseEntryCardProps> = ({ entry }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} (${weekday})`;
  };

  const isPullup = entry.exerciseName === '풀업';
  const totalReps = entry.sets.reduce((sum, set) => sum + set.reps, 0);
  const maxWeight = Math.max(...entry.sets.map((set) => set.weight));
  const maxReps = Math.max(...entry.sets.map((set) => set.reps));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.exerciseName}
            >
              {entry.exerciseName}
            </TextBox>
            <TextBox variant="caption2" color={theme.textSecondary}>
              {formatDate(entry.date)}
            </TextBox>
          </View>
          <View style={styles.statsRow}>
            {!isPullup && (
              <TextBox variant="caption1" color={theme.textSecondary}>
                {maxWeight}kg
              </TextBox>
            )}
            <TextBox variant="caption1" color={theme.textSecondary}>
              {entry.sets.length}세트
            </TextBox>
            <TextBox variant="caption1" color={theme.textSecondary}>
              {totalReps}회
            </TextBox>
          </View>
        </View>
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={theme.textSecondary}
        />
      </Pressable>

      {expanded && (
        <View
          style={[styles.expandedContent, { borderTopColor: theme.border }]}
        >
          {entry.sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <TextBox
                variant="caption1"
                color={theme.textSecondary}
                style={styles.setIndex}
              >
                {set.setIndex}세트
              </TextBox>
              {!isPullup && (
                <TextBox variant="caption1" color={theme.text}>
                  {set.weight}kg
                </TextBox>
              )}
              <TextBox variant="caption1" color={theme.text}>
                {set.reps}회
              </TextBox>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ExerciseEntryCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerContent: {
    flex: 1,
    gap: 8,
  },
  exerciseName: {
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 12,
    gap: 8,
  },
  setRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingVertical: 4,
  },
  setIndex: {
    width: 50,
  },
});

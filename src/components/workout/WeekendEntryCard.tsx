import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export interface WeekendHistoryEntry {
  date: string;
  sets: {
    setIndex: number;
    durationSeconds: number | null;
    reps: number | null;
    floors: number | null;
  }[];
  exerciseName: string;
  unitLabel: string;
}

interface WeekendEntryCardProps {
  entry: WeekendHistoryEntry;
}

const WeekendEntryCard: React.FC<WeekendEntryCardProps> = ({ entry }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const totalValue = entry.sets.reduce((sum, set) => {
    const value =
      set.durationSeconds ?? set.reps ?? set.floors ?? 0;
    return sum + value;
  }, 0);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')} (${weekdays[date.getDay()]})`;
  };

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
            <TextBox variant="body2" color={theme.text} style={styles.title}>
              {entry.exerciseName}
            </TextBox>
            <TextBox variant="caption2" color={theme.textSecondary}>
              {formattedDate(entry.date)}
            </TextBox>
          </View>
          <View style={styles.statsRow}>
            <TextBox variant="caption1" color={theme.textSecondary}>
              {entry.sets.length}세트
            </TextBox>
            <TextBox variant="caption1" color={theme.textSecondary}>
              합계 {totalValue}
              {entry.unitLabel}
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
          style={[
            styles.expanded,
            {
              borderTopColor: theme.border,
            },
          ]}
        >
          {entry.sets.map((set) => {
            const value =
              set.durationSeconds ?? set.reps ?? set.floors ?? 0;
            return (
              <View key={set.setIndex} style={styles.setRow}>
                <TextBox
                  variant="caption1"
                  color={theme.textSecondary}
                  style={styles.setLabel}
                >
                  {set.setIndex}세트
                </TextBox>
                <TextBox variant="caption1" color={theme.text}>
                  {value}
                  {entry.unitLabel}
                </TextBox>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default WeekendEntryCard;

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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  expanded: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  setRow: {
    flexDirection: 'row',
    gap: 12,
  },
  setLabel: {
    width: 60,
  },
});


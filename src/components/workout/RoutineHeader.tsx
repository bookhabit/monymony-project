import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

import {
  getRoutineName,
  getDayName,
  formatDate,
  type RoutineCode,
} from '@/utils/routine';

interface RoutineHeaderProps {
  date: Date;
  routineCode: RoutineCode;
}

const RoutineHeader: React.FC<RoutineHeaderProps> = ({ date, routineCode }) => {
  const { theme } = useTheme();

  // 루틴별 색상 가져오기
  const getRoutineColor = (code: RoutineCode): string => {
    if (code === 'REST') {
      return theme.rest;
    }
    if (code === 'A') {
      return theme.routineA;
    }
    if (code === 'B') {
      return theme.routineB;
    }
    return theme.routineC;
  };

  const routineColor = getRoutineColor(routineCode);

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.surface,
          borderLeftWidth: 4,
          borderLeftColor: routineColor,
        },
      ]}
    >
      <TextBox variant="title1" color={theme.text} style={styles.dateText}>
        {formatDate(date)}
      </TextBox>
      <TextBox variant="body2" color={theme.textSecondary}>
        {getDayName(date)}
      </TextBox>
      <View
        style={[
          styles.routineBadge,
          {
            backgroundColor: routineColor + '20',
            padding: 12,
            borderRadius: 12,
          },
        ]}
      >
        <TextBox variant="title2" color={routineColor}>
          {routineCode} 루틴
        </TextBox>
        <TextBox variant="body3" color={theme.textSecondary}>
          {getRoutineName(routineCode)}
        </TextBox>
      </View>
    </View>
  );
};

export default RoutineHeader;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  dateText: {
    marginBottom: 4,
  },
  routineBadge: {
    marginTop: 16,
    alignItems: 'center',
  },
});

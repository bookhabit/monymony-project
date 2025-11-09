import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

const formatTime = (elapsedMs: number) => {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((elapsedMs % 1000) / 10);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}.${String(milliseconds).padStart(2, '0')}`;
};

const Stopwatch: React.FC = () => {
  const { theme } = useTheme();
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      if (startTimestampRef.current === null) {
        startTimestampRef.current = Date.now() - elapsed;
      }
      intervalRef.current = setInterval(() => {
        if (startTimestampRef.current !== null) {
          setElapsed(Date.now() - startTimestampRef.current);
        }
      }, 50);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, elapsed]);

  const handleStart = () => {
    if (!isRunning) {
      startTimestampRef.current = Date.now() - elapsed;
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    startTimestampRef.current = null;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <TextBox variant="title3" color={theme.text} style={styles.title}>
        스톱워치
      </TextBox>
      <TextBox variant="title1" color={theme.primary} style={styles.timeText}>
        {formatTime(elapsed)}
      </TextBox>

      <View style={styles.actions}>
        <CustomButton
          title="시작"
          onPress={handleStart}
          disabled={isRunning}
          style={styles.button}
        />
        <CustomButton
          title="중지"
          onPress={handleStop}
          disabled={!isRunning}
          variant="outline"
          style={styles.button}
        />
        <CustomButton
          title="초기화"
          onPress={handleReset}
          variant="ghost"
          style={styles.button}
        />
      </View>
    </View>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
  timeText: {
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

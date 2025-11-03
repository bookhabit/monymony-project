import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  AppState,
  AppStateStatus,
  TextInput,
  Vibration,
} from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface RestTimerProps {
  defaultSeconds?: number; // 기본 휴식 시간 (초 단위), 기본값 90초 (1:30)
}

const RestTimer: React.FC<RestTimerProps> = ({ defaultSeconds = 90 }) => {
  const { theme } = useTheme();
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [selectedSeconds, setSelectedSeconds] = useState(30);
  const [totalSeconds, setTotalSeconds] = useState(defaultSeconds);
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // 총 시간 계산 (분 + 초)
  useEffect(() => {
    const total = selectedMinutes * 60 + selectedSeconds;
    setTotalSeconds(total);
    if (!isRunning) {
      setSeconds(total);
    }
  }, [selectedMinutes, selectedSeconds, isRunning]);

  // 앱 상태 변경 감지 (백그라운드/포그라운드)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // 백그라운드에서 포그라운드로 복귀 시 남은 시간 계산
        if (isRunning && !isPaused && startTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000
          );
          const remaining = Math.max(0, totalSeconds - elapsed);
          setSeconds(remaining);
          if (remaining === 0) {
            setIsRunning(false);
            setIsPaused(false);
            setIsFinished(true);
            startTimeRef.current = null;
            pausedTimeRef.current = 0;
          }
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isRunning, isPaused, totalSeconds]);

  // 타이머 로직
  useEffect(() => {
    if (isRunning && !isPaused && seconds > 0 && !isFinished) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        pausedTimeRef.current = 0;
      }
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            setIsFinished(true);
            startTimeRef.current = null;
            pausedTimeRef.current = 0;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (isPaused && startTimeRef.current) {
        pausedTimeRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, seconds, isFinished]);

  // 진동 반복 처리 (3번만)
  useEffect(() => {
    let vibrationInterval: ReturnType<typeof setInterval> | null = null;
    let vibrationCount = 0;

    if (isFinished) {
      // 즉시 한 번 진동
      Vibration.vibrate([300, 500, 200, 500]);
      vibrationCount = 1;

      // 1초마다 진동 반복 (최대 3번)
      vibrationInterval = setInterval(() => {
        vibrationCount++;
        if (vibrationCount <= 3) {
          Vibration.vibrate([300, 500, 200, 500]);
        } else {
          // 3번 이후 interval 정리
          if (vibrationInterval) {
            clearInterval(vibrationInterval);
            vibrationInterval = null;
          }
        }
      }, 1000);
    }

    return () => {
      if (vibrationInterval) {
        clearInterval(vibrationInterval);
      }
      Vibration.cancel();
    };
  }, [isFinished]);

  // 확인 버튼 클릭 (진동 중지, 타이머 초기화)
  const confirmFinished = () => {
    // isFinished를 false로 설정하면 useEffect에서 진동이 자동으로 중지됨
    setIsFinished(false);
    setSeconds(totalSeconds);
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  // 타이머 시작
  const startTimer = () => {
    if (seconds === 0) {
      setSeconds(totalSeconds);
    }
    setIsRunning(true);
    setIsPaused(false);
    setIsEditing(false);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
  };

  // 타이머 일시정지
  const pauseTimer = () => {
    setIsPaused(true);
  };

  // 타이머 재개
  const resumeTimer = () => {
    setIsPaused(false);
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
  };

  // 타이머 중지
  const stopTimer = () => {
    Vibration.cancel();
    setIsRunning(false);
    setIsPaused(false);
    setIsEditing(false);
    setIsFinished(false);
    setSeconds(totalSeconds);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  // 시간 편집 모드 토글
  const toggleEdit = () => {
    if (isRunning) {
      return; // 실행 중에는 편집 불가
    }
    setIsEditing(!isEditing);
  };

  // 시간 포맷팅 (MM:SS)
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 분/초 입력값 파싱
  const handleMinutesChange = (value: string) => {
    const num = parseInt(value, 10) || 0;
    setSelectedMinutes(Math.max(0, Math.min(59, num)));
  };

  const handleSecondsChange = (value: string) => {
    const num = parseInt(value, 10) || 0;
    setSelectedSeconds(Math.max(0, Math.min(59, num)));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <TextBox variant="title4" color={theme.text}>
          휴식 타이머
        </TextBox>

        {isEditing ? (
          <View style={styles.timeEditor}>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={selectedMinutes.toString()}
                onChangeText={handleMinutesChange}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="1"
                placeholderTextColor={theme.placeholder}
              />
              <TextBox
                variant="title2"
                color={theme.text}
                style={styles.timeSeparator}
              >
                :
              </TextBox>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={selectedSeconds.toString()}
                onChangeText={handleSecondsChange}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="30"
                placeholderTextColor={theme.placeholder}
              />
            </View>
            <CustomButton
              title="확인"
              onPress={toggleEdit}
              style={{
                ...styles.editButton,
                backgroundColor: theme.primary,
              }}
            />
          </View>
        ) : (
          <View style={styles.timerDisplay}>
            <TextBox
              variant="title1"
              color={seconds === 0 || isFinished ? theme.error : theme.text}
              style={styles.timerText}
            >
              {formatTime(seconds)}
            </TextBox>
            {!isRunning && !isFinished && (
              <CustomButton
                title="시간 설정"
                onPress={toggleEdit}
                variant="ghost"
                style={styles.editButton}
              />
            )}
          </View>
        )}
      </View>

      <View style={styles.controls}>
        {isFinished ? (
          <CustomButton
            title="확인"
            onPress={confirmFinished}
            style={{
              ...styles.button,
              backgroundColor: theme.workoutCompleted,
            }}
          />
        ) : !isRunning ? (
          <CustomButton
            title="시작"
            onPress={startTimer}
            style={{
              ...styles.button,
              backgroundColor: theme.workoutCompleted,
            }}
          />
        ) : (
          <>
            {isPaused ? (
              <CustomButton
                title="재개"
                onPress={resumeTimer}
                style={{ ...styles.button, backgroundColor: theme.primary }}
              />
            ) : (
              <CustomButton
                title="일시정지"
                onPress={pauseTimer}
                style={{ ...styles.button, backgroundColor: theme.warning }}
              />
            )}
            <CustomButton
              title="초기화"
              onPress={stopTimer}
              style={{ ...styles.button, backgroundColor: theme.error }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default RestTimer;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  timerDisplay: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    marginTop: 12,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  timeEditor: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    fontSize: 24,
    minWidth: 60,
    fontFamily: 'monospace',
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 4,
  },
  editButton: {
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
});

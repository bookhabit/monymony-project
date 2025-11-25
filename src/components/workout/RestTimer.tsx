import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  NativeEventEmitter,
  NativeModules,
  Vibration,
} from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

// @ts-ignore - TurboModule은 런타임에 로드됨
import NativeTimerModule from '../../../specs/NativeTimerModule';

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

  // 총 시간 계산 (분 + 초)
  useEffect(() => {
    const total = selectedMinutes * 60 + selectedSeconds;
    setTotalSeconds(total);
    if (!isRunning) {
      setSeconds(total);
    }
  }, [selectedMinutes, selectedSeconds, isRunning]);

  // 네이티브 모듈 이벤트 리스너
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(
      NativeModules.NativeTimerModule
    );

    const updateSubscription = eventEmitter.addListener(
      'onTimerUpdate',
      (data: {
        remainingSeconds: number;
        isRunning: boolean;
        isPaused: boolean;
      }) => {
        setSeconds(data.remainingSeconds);
        setIsRunning(data.isRunning);
        setIsPaused(data.isPaused);

        if (data.remainingSeconds === 0 && !data.isRunning) {
          setIsFinished(true);
          // 네이티브에서 진동과 소리를 계속 반복하므로 여기서는 상태만 업데이트
        }
      }
    );

    const finishedSubscription = eventEmitter.addListener(
      'onTimerFinished',
      () => {
        setIsFinished(true);
        setIsRunning(false);
        setIsPaused(false);
        setSeconds(0);
        // 네이티브에서 진동과 소리를 계속 반복하므로 여기서는 상태만 업데이트
      }
    );

    // 초기 상태 동기화
    NativeTimerModule?.isRunning?.().then((running: boolean) => {
      setIsRunning(running);
    });
    NativeTimerModule?.isPaused?.().then((paused: boolean) => {
      setIsPaused(paused);
    });
    NativeTimerModule?.getRemainingSeconds?.().then((remaining: number) => {
      if (remaining > 0) {
        setSeconds(remaining);
      } else {
        setSeconds(0);
      }
    });
    // 알람 상태 확인 (딥링크로 들어올 때 상태 동기화)
    NativeTimerModule?.isAlarming?.().then((alarming: boolean) => {
      if (alarming) {
        setIsFinished(true);
        setSeconds(0);
        setIsRunning(false);
        setIsPaused(false);
      }
    });

    return () => {
      updateSubscription.remove();
      finishedSubscription.remove();
    };
  }, []);

  // 확인 버튼 클릭 (진동 중지, 타이머 초기화)
  const confirmFinished = () => {
    Vibration.cancel();
    setIsFinished(false);
    setSeconds(totalSeconds);
    setIsRunning(false);
    setIsPaused(false);
    // 네이티브 모듈의 stopTimer 호출하여 알림 중지
    NativeTimerModule?.stopTimer?.();
  };

  // 타이머 시작
  const startTimer = () => {
    const timeToStart = seconds === 0 ? totalSeconds : seconds;
    setSeconds(timeToStart);
    setIsRunning(true);
    setIsPaused(false);
    setIsEditing(false);
    setIsFinished(false);
    NativeTimerModule?.startTimer?.(timeToStart);
  };

  // 타이머 일시정지
  const pauseTimer = () => {
    setIsPaused(true);
    NativeTimerModule?.pauseTimer?.();
  };

  // 타이머 재개
  const resumeTimer = () => {
    setIsPaused(false);
    NativeTimerModule?.resumeTimer?.();
  };

  // 타이머 중지
  const stopTimer = () => {
    Vibration.cancel();
    setIsRunning(false);
    setIsPaused(false);
    setIsEditing(false);
    setIsFinished(false);
    setSeconds(totalSeconds);
    NativeTimerModule?.stopTimer?.();
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
            }}
          />
        ) : !isRunning ? (
          <CustomButton
            title="시작"
            onPress={startTimer}
            style={{
              ...styles.button,
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

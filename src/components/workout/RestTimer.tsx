import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
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
    Promise.all([
      NativeTimerModule?.isRunning?.() || Promise.resolve(false),
      NativeTimerModule?.isPaused?.() || Promise.resolve(false),
      NativeTimerModule?.getRemainingSeconds?.() || Promise.resolve(0),
      NativeTimerModule?.isAlarming?.() || Promise.resolve(false),
    ]).then(([running, paused, remaining, alarming]) => {
      setIsRunning(running);
      setIsPaused(paused);

      // 알람 상태 확인 (딥링크로 들어올 때 상태 동기화)
      if (alarming) {
        setIsFinished(true);
        setSeconds(0);
        setIsRunning(false);
        setIsPaused(false);
      } else if (running && remaining > 0) {
        // 타이머가 실행 중일 때만 네이티브 값 사용
        setSeconds(remaining);
      } else {
        // 타이머가 실행 중이 아닐 때는 기본값 사용
        // selectedMinutes와 selectedSeconds로 계산된 값을 사용
        const defaultTotal = selectedMinutes * 60 + selectedSeconds;
        setTotalSeconds(defaultTotal);
        setSeconds(defaultTotal);
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
    setIsEditing(false);
    // 네이티브 모듈의 stopTimer 호출하여 모든 것을 초기화
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

  // 휠 피커 관련
  const ITEM_HEIGHT = 50;
  const VISIBLE_ITEMS = 3;
  const minutesScrollRef = useRef<ScrollView>(null);
  const secondsScrollRef = useRef<ScrollView>(null);

  // 분 배열 생성 (0-59)
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);
  // 초 배열 생성 (0-59)
  const secondsArray = Array.from({ length: 60 }, (_, i) => i);

  // 스크롤 위치 계산
  const getScrollOffset = (value: number) => {
    return value * ITEM_HEIGHT;
  };

  // 스크롤 이벤트 핸들러
  const handleMinutesScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(59, index));
    if (clampedIndex !== selectedMinutes) {
      setSelectedMinutes(clampedIndex);
      // 정확한 위치로 스냅
      minutesScrollRef.current?.scrollTo({
        y: getScrollOffset(clampedIndex),
        animated: true,
      });
    }
  };

  const handleSecondsScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(59, index));
    if (clampedIndex !== selectedSeconds) {
      setSelectedSeconds(clampedIndex);
      // 정확한 위치로 스냅
      secondsScrollRef.current?.scrollTo({
        y: getScrollOffset(clampedIndex),
        animated: true,
      });
    }
  };

  // 편집 모드 진입 시 스크롤 위치 초기화
  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        minutesScrollRef.current?.scrollTo({
          y: getScrollOffset(selectedMinutes),
          animated: false,
        });
        secondsScrollRef.current?.scrollTo({
          y: getScrollOffset(selectedSeconds),
          animated: false,
        });
      }, 100);
    }
  }, [isEditing]);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <TextBox variant="title4" color={theme.text}>
          휴식 타이머
        </TextBox>

        {isEditing ? (
          <View style={styles.timeEditor}>
            <View style={styles.pickerContainer}>
              {/* 분 피커 */}
              <View style={styles.pickerWrapper}>
                <View style={[styles.pickerOverlay]} />
                <ScrollView
                  ref={minutesScrollRef}
                  style={styles.pickerScroll}
                  contentContainerStyle={styles.pickerContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleMinutesScroll}
                  onScrollEndDrag={handleMinutesScroll}
                  nestedScrollEnabled={true}
                >
                  {minutesArray.map((minute) => {
                    const isSelected = minute === selectedMinutes;
                    return (
                      <View
                        key={minute}
                        style={[
                          styles.pickerItem,
                          {
                            height: ITEM_HEIGHT,
                            backgroundColor: isSelected
                              ? theme.primary + '30'
                              : 'transparent',
                            borderRadius: isSelected ? 8 : 0,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: isSelected
                              ? theme.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        <TextBox
                          variant={isSelected ? 'title1' : 'title2'}
                          color={
                            isSelected ? theme.primary : theme.textSecondary
                          }
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.pickerItemTextSelected,
                          ]}
                        >
                          {String(minute).padStart(2, '0')}
                        </TextBox>
                      </View>
                    );
                  })}
                </ScrollView>
                <TextBox
                  variant="body2"
                  color={theme.textSecondary}
                  style={styles.pickerLabel}
                >
                  분
                </TextBox>
              </View>

              {/* 구분선 */}
              <TextBox
                variant="title1"
                color={theme.text}
                style={styles.timeSeparator}
              >
                :
              </TextBox>

              {/* 초 피커 */}
              <View style={styles.pickerWrapper}>
                <View style={[styles.pickerOverlay]} />
                <ScrollView
                  ref={secondsScrollRef}
                  style={styles.pickerScroll}
                  contentContainerStyle={styles.pickerContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleSecondsScroll}
                  onScrollEndDrag={handleSecondsScroll}
                  nestedScrollEnabled={true}
                >
                  {secondsArray.map((second) => {
                    const isSelected = second === selectedSeconds;
                    return (
                      <View
                        key={second}
                        style={[
                          styles.pickerItem,
                          {
                            height: ITEM_HEIGHT,
                            backgroundColor: isSelected
                              ? theme.primary + '30'
                              : 'transparent',
                            borderRadius: isSelected ? 8 : 0,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: isSelected
                              ? theme.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        <TextBox
                          variant={isSelected ? 'title1' : 'title2'}
                          color={
                            isSelected ? theme.primary : theme.textSecondary
                          }
                          style={[
                            styles.pickerItemText,
                            isSelected && styles.pickerItemTextSelected,
                          ]}
                        >
                          {String(second).padStart(2, '0')}
                        </TextBox>
                      </View>
                    );
                  })}
                </ScrollView>
                <TextBox
                  variant="body2"
                  color={theme.textSecondary}
                  style={styles.pickerLabel}
                >
                  초
                </TextBox>
              </View>
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
    gap: 16,
    marginTop: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  pickerWrapper: {
    flex: 1,
    height: 150, // ITEM_HEIGHT * VISIBLE_ITEMS (50 * 3)
    position: 'relative',
    maxWidth: 100,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerContent: {
    paddingVertical: 50, // ITEM_HEIGHT
  },
  pickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  pickerItemText: {
    fontFamily: 'monospace',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 50, // ITEM_HEIGHT
    left: 0,
    right: 0,
    height: 50, // ITEM_HEIGHT
    pointerEvents: 'none',
    zIndex: 1,
  },
  pickerItemTextSelected: {
    fontWeight: 'bold',
  },
  pickerLabel: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
  timeSeparator: {
    fontSize: 32,
    marginHorizontal: 8,
    marginTop: 50, // ITEM_HEIGHT
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

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

import { useAllExercises } from '@/hooks/workout/useAllExercises';

const MIN_LOADING_TIME = 2000; // 최소 2초

const ExerciseMaxValues: React.FC = () => {
  const { theme } = useTheme();
  const { exercises, loading, error, refetch } = useAllExercises();
  const [displayLoading, setDisplayLoading] = useState(false);
  const loadingStartTimeRef = useRef<number | null>(null);
  const isManualRefreshRef = useRef<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      if (!loadingStartTimeRef.current) {
        loadingStartTimeRef.current = Date.now();
        setDisplayLoading(true);
        // 페이드 인 애니메이션
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      // 로딩이 끝났을 때
      if (loadingStartTimeRef.current) {
        // 수동 refresh인 경우에만 최소 시간 보장
        if (isManualRefreshRef.current) {
          const elapsed = Date.now() - loadingStartTimeRef.current;
          const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

          setTimeout(() => {
            // 페이드 아웃 애니메이션
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setDisplayLoading(false);
              loadingStartTimeRef.current = null;
              isManualRefreshRef.current = false;
            });
          }, remaining);
        } else {
          // 일반 로딩은 즉시 숨김
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setDisplayLoading(false);
            loadingStartTimeRef.current = null;
          });
        }
      }
    }
  }, [loading, fadeAnim]);

  const handleRefresh = () => {
    isManualRefreshRef.current = true;
    loadingStartTimeRef.current = null;
    refetch();
  };

  return (
    <>
      <View style={styles.headingContainer}>
        <TextBox variant="title3" color={theme.text} style={styles.heading}>
          종목별 현재 최고 중량
        </TextBox>
        <Pressable
          onPress={handleRefresh}
          disabled={loading}
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.refreshButtonPressed,
          ]}
        >
          <MaterialIcons
            name="refresh"
            size={20}
            color={loading ? theme.textSecondary : theme.accentOrange}
          />
        </Pressable>
      </View>
      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.surface,
            borderLeftWidth: 4,
            borderLeftColor: theme.accentOrange,
          },
        ]}
      >
        {displayLoading ? (
          <Animated.View
            style={[styles.loadingContainer, { opacity: fadeAnim }]}
          >
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={theme.accentOrange} />
              <TextBox
                variant="body2"
                color={theme.textSecondary}
                style={styles.loadingText}
              >
                최고 중량 계산 중...
              </TextBox>
            </View>
          </Animated.View>
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
                  color={theme.accentOrange}
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
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  heading: {
    flex: 1,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 20,
  },
  refreshButtonPressed: {
    opacity: 0.6,
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    minHeight: 150,
    justifyContent: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
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

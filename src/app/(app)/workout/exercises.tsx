import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import SelectBox from '@/components/common/SelectBox';
import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';
import ExerciseEntryCard from '@/components/workout/ExerciseEntryCard';

import { useExerciseEntries } from '@/hooks/workout/useExerciseEntries';
import { useExercises } from '@/hooks/workout/useExercises';

const ExercisesScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ exerciseId?: string }>();
  const { exercises, loading: exercisesLoading } = useExercises();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null
  );

  // 파라미터로 받은 exerciseId를 초기 선택값으로 설정
  useEffect(() => {
    if (params.exerciseId && exercises.length > 0) {
      const exerciseId = parseInt(params.exerciseId, 10);
      // exercises 배열에 해당 ID가 있는지 확인
      const exerciseExists = exercises.some((ex) => ex.id === exerciseId);
      if (exerciseExists && !isNaN(exerciseId)) {
        setSelectedExerciseId(exerciseId);
      }
    }
  }, [params.exerciseId, exercises]);
  const {
    entries,
    loading: entriesLoading,
    error,
    hasMore,
    loadMore,
  } = useExerciseEntries(selectedExerciseId);

  const selectOptions = exercises.map((exercise) => ({
    label: exercise.name,
    value: exercise.id,
  }));

  const handleLoadMore = () => {
    if (hasMore && !entriesLoading) {
      loadMore();
    }
  };

  const renderFooter = () => {
    if (!entriesLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.workoutBg }]}>
      <CustomHeader title="종목별 보기" showBackButton />

      <View style={styles.content}>
        {/* 운동종목 선택 */}
        <View style={styles.selectContainer}>
          <TextBox
            variant="title3"
            color={theme.text}
            style={styles.selectLabel}
          >
            운동종목 선택
          </TextBox>
          <SelectBox
            options={selectOptions}
            selectedValue={selectedExerciseId}
            onValueChange={(value) => setSelectedExerciseId(value as number)}
            placeholder="운동종목을 선택하세요"
          />
        </View>

        {/* 운동 기록 리스트 */}
        {selectedExerciseId && (
          <View style={styles.listContainer}>
            {entriesLoading && entries.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <TextBox
                  variant="body2"
                  color={theme.textSecondary}
                  style={styles.loadingText}
                >
                  기록을 불러오는 중...
                </TextBox>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <TextBox variant="body2" color={theme.error}>
                  {error}
                </TextBox>
              </View>
            ) : entries.length === 0 ? (
              <View style={styles.emptyContainer}>
                <TextBox variant="body2" color={theme.textSecondary}>
                  기록이 없습니다
                </TextBox>
              </View>
            ) : (
              <FlatList
                data={entries}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <ExerciseEntryCard entry={item} />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        )}

        {!selectedExerciseId && (
          <View style={styles.emptyState}>
            <TextBox variant="body2" color={theme.textSecondary}>
              운동종목을 선택하면 기록을 확인할 수 있습니다
            </TextBox>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExercisesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  selectContainer: {
    marginBottom: 24,
    gap: 12,
  },
  selectLabel: {
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

import {
  useAllHangRecords,
  type HangDayRecord,
} from '@/hooks/workout/useAllHangRecords';
import { useTodayHangRecord } from '@/hooks/workout/useHangRecords';

import { formatDate } from '@/utils/routine';

const HangScreen = () => {
  const { theme } = useTheme();
  const { records, loading, refetch, saveHangSession } = useTodayHangRecord();
  const { records: allRecords, refetch: refetchAll } = useAllHangRecords();

  const [inputSets, setInputSets] = useState<{ [key: number]: string }>({
    1: '',
    2: '',
    3: '',
  });
  const [saving, setSaving] = useState(false);

  // 저장된 기록 불러오기
  useEffect(() => {
    if (records && records.length > 0) {
      const saved: { [key: number]: string } = {};
      records.forEach((record) => {
        saved[record.set_index] = record.duration_seconds.toString();
      });
      setInputSets(saved);
    } else {
      // 저장된 기록이 없으면 빈 값으로 초기화
      setInputSets({ 1: '', 2: '', 3: '' });
    }
  }, [records]);

  // 저장
  const handleSave = async () => {
    // 입력값 검증
    const setsToSave = [];
    for (let i = 1; i <= 3; i++) {
      const value = inputSets[i]?.trim();
      if (!value || value === '') {
        Alert.alert('입력 오류', '모든 세트의 시간을 입력해주세요.');
        return;
      }
      const seconds = parseInt(value, 10);
      if (isNaN(seconds) || seconds <= 0) {
        Alert.alert('입력 오류', '올바른 시간을 입력해주세요 (1초 이상).');
        return;
      }
      setsToSave.push({
        setIndex: i,
        durationSeconds: seconds,
      });
    }

    setSaving(true);
    const success = await saveHangSession(setsToSave);

    if (success) {
      Alert.alert('저장 완료', '기록이 저장되었습니다.');
      refetch();
      refetchAll();
    } else {
      Alert.alert('저장 실패', '기록 저장에 실패했습니다.');
    }
    setSaving(false);
  };

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 날짜 포맷팅
  const formatDateDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  // 기록 아이템 렌더링
  const renderRecordItem = ({ item }: { item: HangDayRecord }) => (
    <View
      style={[
        styles.recordItem,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.recordHeader}>
        <TextBox variant="body1" color={theme.text} style={styles.recordDate}>
          {formatDateDisplay(item.date)}
        </TextBox>
        <TextBox
          variant="body1"
          color={theme.accentOrange}
          style={styles.recordTotal}
        >
          총 {formatTime(item.totalSeconds)}
        </TextBox>
      </View>
      <View style={styles.recordSets}>
        {item.sets.map((set) => (
          <View key={set.setIndex} style={styles.recordSetItem}>
            <TextBox variant="caption1" color={theme.textSecondary}>
              {set.setIndex}세트
            </TextBox>
            <TextBox variant="body2" color={theme.text}>
              {formatTime(set.durationSeconds)}
            </TextBox>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.workoutBg }]}>
      <CustomHeader title="철봉 매달리기" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 입력 섹션 */}
        <View
          style={[
            styles.inputCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.accentOrange,
            },
          ]}
        >
          <TextBox
            variant="title4"
            color={theme.text}
            style={styles.sectionTitle}
          >
            오늘의 기록
          </TextBox>
          <TextBox
            variant="caption1"
            color={theme.textSecondary}
            style={styles.sectionDesc}
          >
            각 세트의 시간을 초 단위로 입력해주세요
          </TextBox>

          {[1, 2, 3].map((setIndex) => (
            <View key={setIndex} style={styles.inputRow}>
              <TextBox
                variant="body1"
                color={theme.text}
                style={styles.inputLabel}
              >
                {setIndex}세트
              </TextBox>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={inputSets[setIndex] || ''}
                onChangeText={(text) => {
                  setInputSets({ ...inputSets, [setIndex]: text });
                }}
                placeholder="초 단위 입력"
                placeholderTextColor={theme.placeholder}
                keyboardType="number-pad"
              />
              <TextBox
                variant="caption1"
                color={theme.textSecondary}
                style={styles.inputUnit}
              >
                초
              </TextBox>
            </View>
          ))}

          <CustomButton
            title={saving ? '저장 중...' : '저장'}
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: theme.accentOrange,
              borderColor: theme.accentOrange,
              marginTop: 16,
            }}
          />
        </View>

        {/* 기록 목록 */}
        <View style={styles.recordsSection}>
          <TextBox
            variant="title4"
            color={theme.text}
            style={styles.sectionTitle}
          >
            기록 보기
          </TextBox>
          {allRecords.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <TextBox variant="body2" color={theme.textSecondary}>
                아직 기록이 없습니다
              </TextBox>
            </View>
          ) : (
            <FlatList
              data={allRecords}
              renderItem={renderRecordItem}
              keyExtractor={(item) => item.date}
              scrollEnabled={false}
              contentContainerStyle={styles.recordsList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HangScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 24,
  },
  inputCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDesc: {
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputLabel: {
    width: 60,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  inputUnit: {
    width: 30,
  },
  recordsSection: {
    gap: 12,
  },
  recordsList: {
    gap: 12,
  },
  recordItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDate: {
    fontWeight: '600',
  },
  recordTotal: {
    fontWeight: '600',
  },
  recordSets: {
    flexDirection: 'row',
    gap: 16,
  },
  recordSetItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
});

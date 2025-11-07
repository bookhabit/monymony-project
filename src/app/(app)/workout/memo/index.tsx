import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

import { useMemoEntries } from '@/hooks/notes/useMemoEntries';

const MemoScreen = () => {
  const { theme } = useTheme();
  const { entries, loading, saving, error, addEntry, removeEntry, refresh } =
    useMemoEntries();

  const [composerVisible, setComposerVisible] = useState(false);
  const [newMemo, setNewMemo] = useState('');

  const sortedEntries = useMemo(
    () =>
      entries.map((entry) => ({
        ...entry,
        createdLabel: new Date(entry.created_at).toLocaleString('ko-KR'),
      })),
    [entries]
  );

  const handleOpenComposer = () => {
    setNewMemo('');
    setComposerVisible(true);
  };

  const handleCloseComposer = () => {
    setComposerVisible(false);
    setNewMemo('');
  };

  const handleSave = async () => {
    const trimmed = newMemo.trim();
    if (!trimmed) {
      Alert.alert('입력 필요', '메모 내용을 입력해주세요.');
      return;
    }

    try {
      await addEntry(trimmed);
      Alert.alert('저장 완료', '새로운 메모가 저장되었습니다.');
      handleCloseComposer();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '메모 저장에 실패했습니다.';
      Alert.alert('저장 실패', message);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('메모 삭제', '선택한 메모를 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeEntry(id);
          } catch (err) {
            const message =
              err instanceof Error ? err.message : '메모 삭제에 실패했습니다.';
            Alert.alert('삭제 실패', message);
          }
        },
      },
    ]);
  };

  const renderItem = ({
    item,
  }: typeof sortedEntries extends (infer U)[] ? { item: U } : never) => (
    <View style={[styles.memoCard, { backgroundColor: theme.surface }]}>
      <View style={styles.memoCardHeader}>
        <TextBox
          variant="body3"
          color={theme.textSecondary}
          style={styles.memoDate}
        >
          {item.createdLabel}
        </TextBox>
        <Pressable
          onPress={() => handleDelete(item.id)}
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="메모 삭제"
        >
          <MaterialIcons name="delete" size={20} color={theme.error} />
        </Pressable>
      </View>
      <TextBox variant="body2" color={theme.text}>
        {item.content}
      </TextBox>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.workoutBg }]}>
      <CustomHeader
        title="운동 메모"
        showBackButton
        rightIcon="add"
        onRightPress={handleOpenComposer}
      />

      <View style={styles.summarySection}>
        <TextBox variant="body2" color={theme.textSecondary}>
          운동 중 느낀 점이나 기록하고 싶은 내용을 자유롭게 적고 보관하세요.
          메모 카드를 길게 눌러 삭제할 수 있습니다.
        </TextBox>
      </View>

      {loading ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color={theme.primary} />
          <TextBox variant="body3" color={theme.textSecondary}>
            메모를 불러오는 중...
          </TextBox>
        </View>
      ) : error ? (
        <View style={styles.loaderWrapper}>
          <TextBox
            variant="body2"
            color={theme.error}
            style={styles.centerText}
          >
            {error}
          </TextBox>
          <CustomButton
            title="다시 불러오기"
            variant="outline"
            onPress={refresh}
          />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons
            name="note-alt"
            size={36}
            color={theme.textSecondary}
          />
          <TextBox
            variant="body2"
            color={theme.textSecondary}
            style={styles.centerText}
          >
            아직 저장된 메모가 없습니다.
          </TextBox>
          <CustomButton title="메모 작성" onPress={handleOpenComposer} />
        </View>
      ) : (
        <FlatList
          data={sortedEntries}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          style={styles.memoList}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      <Modal visible={composerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            <TextBox variant="title3" color={theme.text}>
              새 메모 작성
            </TextBox>
            <TextInput
              value={newMemo}
              onChangeText={setNewMemo}
              placeholder="운동과 관련된 생각이나 기록을 입력하세요"
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              style={[
                styles.textArea,
                { color: theme.text, borderColor: theme.border },
              ]}
            />
            <View style={styles.modalButton}>
              <CustomButton
                title="취소"
                variant="outline"
                onPress={handleCloseComposer}
                fullWidth
              />
              <CustomButton
                title="저장"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MemoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summarySection: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'transparent',
  },
  loaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 80,
  },
  centerText: {
    textAlign: 'center',
  },
  flatListContent: {
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  memoList: {
    flex: 1,
  },
  memoCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    gap: 8,
  },
  memoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  memoDate: {
    textAlign: 'right',
  },
  deleteButton: {
    padding: 6,
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  textArea: {
    minHeight: 160,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  modalButton: {
    gap: 12,
  },
});

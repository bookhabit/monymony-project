import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

export interface SetData {
  set: number;
  weight: number;
  reps: number;
}

interface SetInputTableProps {
  visible: boolean;
  exerciseName: string;
  challengeWeight: number | null;
  onClose: () => void;
  onSave: (sets: SetData[]) => void;
}

/**
 * 5세트 입력 테이블 컴포넌트
 */
export default function SetInputTable({
  visible,
  exerciseName,
  challengeWeight,
  onClose,
  onSave,
}: SetInputTableProps) {
  const { theme } = useTheme();
  const [sets, setSets] = useState<SetData[]>(
    Array.from({ length: 5 }, (_, i) => ({
      set: i + 1,
      weight: challengeWeight || 0,
      reps: 0,
    }))
  );

  const handleWeightChange = (index: number, value: string) => {
    const newSets = [...sets];
    newSets[index].weight = parseFloat(value) || 0;
    setSets(newSets);
  };

  const handleRepsChange = (index: number, value: string) => {
    const newSets = [...sets];
    newSets[index].reps = parseInt(value, 10) || 0;
    setSets(newSets);
  };

  const handleSave = () => {
    // 유효성 검사: 모든 세트에 무게와 reps 입력되었는지
    const isValid = sets.every((set) => set.weight > 0 && set.reps > 0);

    if (!isValid) {
      alert('모든 세트에 무게와 횟수를 입력해주세요.');
      return;
    }

    onSave(sets);
    onClose();
  };

  const handleClose = () => {
    // 리셋
    setSets(
      Array.from({ length: 5 }, (_, i) => ({
        set: i + 1,
        weight: challengeWeight || 0,
        reps: 0,
      }))
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <TextBox variant="title2" color={theme.text}>
              {exerciseName}
            </TextBox>
            <Pressable onPress={handleClose}>
              <MaterialIcons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* 세트 입력 테이블 */}
            <View style={styles.table}>
              {/* 테이블 헤더 */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <TextBox
                  variant="body2"
                  color={theme.text}
                  style={styles.setCol}
                >
                  세트
                </TextBox>
                <TextBox
                  variant="body2"
                  color={theme.text}
                  style={styles.weightCol}
                >
                  무게 (kg)
                </TextBox>
                <TextBox
                  variant="body2"
                  color={theme.text}
                  style={styles.repsCol}
                >
                  횟수
                </TextBox>
              </View>

              {/* 세트 입력 행들 */}
              {sets.map((set, index) => (
                <View
                  key={set.set}
                  style={[
                    styles.tableRow,
                    styles.tableDataRow,
                    { borderBottomColor: theme.border },
                  ]}
                >
                  <TextBox
                    variant="body2"
                    color={theme.text}
                    style={styles.setCol}
                  >
                    {set.set}
                  </TextBox>

                  <TextInput
                    style={[
                      styles.input,
                      styles.weightCol,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={set.weight.toString()}
                    onChangeText={(value) => handleWeightChange(index, value)}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />

                  <TextInput
                    style={[
                      styles.input,
                      styles.repsCol,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={set.reps.toString()}
                    onChangeText={(value) => handleRepsChange(index, value)}
                    keyboardType="number-pad"
                    placeholder="0"
                  />
                </View>
              ))}
            </View>

            {/* 안내 */}
            <View style={styles.infoBox}>
              <TextBox variant="caption2" color={theme.textSecondary}>
                💡 모든 세트를 완료하면 자동으로 저장됩니다
              </TextBox>
            </View>
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="저장"
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  table: {
    margin: 20,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(128, 128, 128, 0.3)',
    marginBottom: 8,
  },
  tableDataRow: {
    borderBottomWidth: 1,
  },
  setCol: {
    flex: 1,
    textAlign: 'center',
  },
  weightCol: {
    flex: 2,
    textAlign: 'center',
  },
  repsCol: {
    flex: 2,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  infoBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
  },
});

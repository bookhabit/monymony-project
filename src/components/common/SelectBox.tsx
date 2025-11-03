import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, FlatList } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

interface SelectBoxOption {
  label: string;
  value: number | string;
}

interface SelectBoxProps {
  options: SelectBoxOption[];
  selectedValue?: number | string | null;
  onValueChange: (value: number | string) => void;
  placeholder?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = '선택하세요',
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (value: number | string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[
          styles.selectButton,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <TextBox
          variant="body2"
          color={selectedOption ? theme.text : theme.textSecondary}
          style={styles.selectText}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </TextBox>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={theme.textSecondary}
        />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <TextBox variant="title3" color={theme.text}>
                선택
              </TextBox>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor:
                        selectedValue === item.value
                          ? theme.primary + '20'
                          : 'transparent',
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <TextBox
                    variant="body2"
                    color={
                      selectedValue === item.value ? theme.primary : theme.text
                    }
                  >
                    {item.label}
                  </TextBox>
                  {selectedValue === item.value && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={theme.primary}
                    />
                  )}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default SelectBox;

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
});

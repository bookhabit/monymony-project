import React from 'react';
import { View } from 'react-native';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface BasicSheetProps {
  onClose: () => void;
}

export const BasicSheet: React.FC<BasicSheetProps> = ({ onClose }) => {
  return (
    <View>
      <TextBox variant="title5" style={{ marginBottom: 16 }}>
        기본 Bottom Sheet
      </TextBox>
      <TextBox variant="body3">이것은 기본 크기의 Bottom Sheet입니다.</TextBox>
      <CustomButton
        title="닫기"
        onPress={onClose}
        variant="outline"
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

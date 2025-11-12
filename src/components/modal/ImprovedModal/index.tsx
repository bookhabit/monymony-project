import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface ModalButton {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  color?: string;
  disabled?: boolean;
}

interface ImprovedModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 콜백 */
  onClose: () => void;
  /** 모달 제목 */
  title?: string;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 버튼 배열 */
  buttons?: ModalButton[];
  /** 헤더 표시 여부 */
  headerShown?: boolean;
  /** 버튼 표시 여부 */
  buttonShown?: boolean;
  /** 닫기 버튼 표시 */
  closeButton?: boolean;
  /** 배경 터치로 닫기 */
  closeOnBackdropPress?: boolean;
  /** 모달 위치 */
  position?: 'center' | 'bottom';
  /** 모달 크기 */
  size?: 'small' | 'medium' | 'large' | 'full';
  /** 배경 표시 여부 */
  hasBackground?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ImprovedModal: React.FC<ImprovedModalProps> = ({
  visible,
  onClose,
  title,
  children,
  buttons = [],
  headerShown = true,
  buttonShown = true,
  closeButton = true,
  closeOnBackdropPress = true,
  position = 'center',
  size = 'medium',
  hasBackground = true,
}) => {
  const { theme } = useTheme();
  console.log('visible', visible);
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      Keyboard.dismiss();
      onClose();
    }
  };

  const getModalWidth = () => {
    switch (size) {
      case 'small':
        return '80%';
      case 'medium':
        return '90%';
      case 'large':
        return '95%';
      case 'full':
        return '100%';
      default:
        return '90%';
    }
  };

  const getModalMaxWidth = () => {
    switch (size) {
      case 'small':
        return 320;
      case 'medium':
        return 400;
      case 'large':
        return 600;
      case 'full':
        return undefined;
      default:
        return 400;
    }
  };

  const isBottom = position === 'bottom';
  const entering = isBottom ? SlideInDown.duration(250) : FadeIn.duration(200);
  const exiting = isBottom ? SlideOutDown.duration(250) : FadeOut.duration(200);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.keyboardView, isBottom && styles.bottomPosition]}
          >
            <AnimatedPressable
              entering={entering}
              exiting={exiting}
              style={[
                styles.modalContainer,
                { width: getModalWidth(), maxWidth: getModalMaxWidth() },
                isBottom && styles.bottomModal,
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <View
                style={[
                  styles.modal,
                  hasBackground && { backgroundColor: theme.background },
                ]}
              >
                {/* Header */}
                {headerShown && (
                  <View
                    style={[styles.header, { borderBottomColor: theme.border }]}
                  >
                    <TextBox variant="title5" style={styles.title}>
                      {title}
                    </TextBox>
                    {closeButton && (
                      <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeIcon}
                      >
                        <TextBox variant="body3" color={theme.textSecondary}>
                          ✕
                        </TextBox>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Content */}
                <View style={styles.content}>{children}</View>

                {/* Footer Buttons */}
                {buttonShown && (
                  <View
                    style={[styles.footer, { borderTopColor: theme.border }]}
                  >
                    {buttons.length > 0 ? (
                      buttons.map((button, index) => (
                        <CustomButton
                          key={index}
                          title={button.text}
                          onPress={() => {
                            button.onPress();
                            onClose();
                          }}
                          variant={button.variant || 'primary'}
                          style={styles.button}
                          disabled={button.disabled}
                        />
                      ))
                    ) : (
                      <CustomButton
                        title="Confirm"
                        onPress={onClose}
                        style={styles.button}
                      />
                    )}
                  </View>
                )}
              </View>
            </AnimatedPressable>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomPosition: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
  },
  bottomModal: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modal: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
  },
  closeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  content: {
    padding: 20,
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
  },
});

export default ImprovedModal;

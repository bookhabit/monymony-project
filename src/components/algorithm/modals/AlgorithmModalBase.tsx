import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface AlgorithmModalBaseProps {
  visible: boolean;
  title: string;
  sections: Array<{ heading?: string; body: string | string[] }>;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  onCloseRequest?: () => void;
  disableDismiss?: boolean;
}

export default function AlgorithmModalBase({
  visible,
  title,
  sections,
  primaryActionLabel,
  onPrimaryAction,
  onCloseRequest,
  disableDismiss = true,
}: AlgorithmModalBaseProps) {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isBottomReached =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 24;
    if (isBottomReached) {
      setHasScrolledToBottom(true);
    }
  };

  const handleClose = () => {
    if (disableDismiss) {
      return;
    }
    onCloseRequest?.();
  };

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          <Pressable
            style={styles.backdropTouchable}
            onPress={handleClose}
            disabled={disableDismiss}
          />
          <View style={styles.modal}>
            <TextBox
              variant="title2"
              color={theme.text}
              style={styles.modalTitle}
            >
              {title}
            </TextBox>
            <ScrollView
              ref={scrollViewRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.contentScroll}
            >
              <View style={styles.contentInner}>
                {sections.map((section) => (
                  <View key={section.heading ?? section.body.toString()}>
                    {section.heading ? (
                      <TextBox
                        variant="title4"
                        color={theme.text}
                        style={styles.sectionHeading}
                      >
                        {section.heading}
                      </TextBox>
                    ) : null}
                    {Array.isArray(section.body) ? (
                      section.body.map((line) => (
                        <TextBox
                          key={line}
                          variant="body3"
                          color={theme.textSecondary}
                          style={styles.sectionBody}
                        >
                          {line}
                        </TextBox>
                      ))
                    ) : (
                      <TextBox
                        variant="body3"
                        color={theme.textSecondary}
                        style={styles.sectionBody}
                      >
                        {section.body}
                      </TextBox>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
            <CustomButton
              title={primaryActionLabel}
              onPress={onPrimaryAction}
              disabled={!hasScrolledToBottom}
              style={[
                styles.actionButton,
                {
                  backgroundColor: hasScrolledToBottom
                    ? theme.primary
                    : theme.border,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    textAlign: 'center',
  },
  contentScroll: {
    maxHeight: 340,
  },
  contentInner: {
    gap: 16,
  },
  sectionHeading: {
    marginBottom: 4,
  },
  sectionBody: {
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButton: {
    marginVertical: 12,
  },
});

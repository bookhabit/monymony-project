import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';
import FibonacciWorkerExample from '@/components/screen/expo/thread/FibonacciWorkerExample';
import JsThreadBlocking from '@/components/screen/expo/thread/JsThreadBlocking';
import RenderExample from '@/components/screen/expo/thread/RenderExample';

const ThreadScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="스레드" showBackButton />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.content}>
          <TextBox
            variant="title1"
            color={theme.text}
            style={{ textAlign: 'center' }}
          >
            JS-UI 스레드
          </TextBox>
          {/* JS 스레드 차단 예시 */}
          {/* <JsThreadBlocking /> */}

          {/* 무거운 작업으로 인한 자식 렌더링도 무겁게 연산됌 */}
          {/* <RenderExample /> */}

          {/* 스레드 오프로드 */}
          <FibonacciWorkerExample />
        </View>
      </ScrollView>
    </View>
  );
};

export default ThreadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    gap: 12,
  },
});

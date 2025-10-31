import React, { useEffect, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Easing,
} from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

const JsThreadBlocking = () => {
  const { theme } = useTheme();

  const [count, setCount] = useState(0);
  const [isBlocking, setIsBlocking] = useState(false);
  const [rotation, setRotation] = useState(new Animated.Value(0));

  useEffect(() => {
    // 무한 회전 애니메이션 시작
    const startRotation = () => {
      rotation.setValue(0);
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true, // 네이티브 드라이버 사용!
        })
      ).start();
    };
    startRotation();
  }, []);

  const blockJsThread = () => {
    console.log('[JS Thread] Blocking started');
    setIsBlocking(true);

    const start = Date.now();
    // 3초간 JS 스레드 블로킹
    while (Date.now() - start < 3000) {
      Math.random();
    }

    setCount((prev) => prev + 1);
    setIsBlocking(false);
  };

  const interpolatedRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TextBox variant="title2" color={theme.text} style={styles.title}>
        JS 스레드 차단 vs 네이티브 애니메이션
      </TextBox>

      {/* 회전하는 네모 도형 */}
      <View style={styles.animationContainer}>
        <Animated.View
          style={[
            styles.rotatingBox,
            { backgroundColor: theme.primary },
            { transform: [{ rotate: interpolatedRotation }] },
          ]}
        />
        <TextBox
          variant="body3"
          color={theme.textSecondary}
          style={styles.animationLabel}
        >
          네이티브 애니메이션 (무한 회전)
        </TextBox>
      </View>

      {/* 차단 버튼 */}
      <View style={styles.blockContainer}>
        <CustomButton
          title={isBlocking ? 'JS 스레드 차단 중...' : 'JS 스레드 3초 차단'}
          onPress={blockJsThread}
        />
        <TextBox variant="body2" color={theme.text} style={styles.countText}>
          {`차단 실행: ${count}회`}
        </TextBox>
      </View>

      {/* 설명 */}
      <View style={[styles.infoBox, { backgroundColor: theme.surface }]}>
        <TextBox variant="body4" color={theme.text} style={styles.infoText}>
          💡 버튼을 누르면 JS 스레드가 3초간 차단되지만, 네이티브 애니메이션은
          계속 부드럽게 회전합니다!
        </TextBox>
        <TextBox
          variant="caption2"
          color={theme.textSecondary}
          style={styles.infoCaption}
        >
          * useNativeDriver: true로 설정된 애니메이션은 네이티브 스레드에서
          실행됩니다
        </TextBox>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    minHeight: 150,
  },
  rotatingBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  animationLabel: {
    marginTop: 16,
  },
  blockContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  countText: {
    marginTop: 8,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  infoText: {
    marginBottom: 8,
  },
  infoCaption: {
    fontStyle: 'italic',
  },
});

export default JsThreadBlocking;

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

export default function Test2Screen() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>테스트 스크린 2</Text>
      <Text style={styles.description}>
        두 번째 테스트 스크린입니다.{'\n'}
        간단한 카운터 기능이 포함되어 있습니다.
      </Text>

      <View style={styles.counterBox}>
        <Text style={styles.counterTitle}>🔢 카운터</Text>
        <Text style={styles.counterValue}>{count}</Text>
        <View style={styles.counterButtons}>
          <Pressable
            style={styles.counterButton}
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </Pressable>
          <Pressable
            style={styles.counterButton}
            onPress={() => setCount(count - 1)}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </Pressable>
          <Pressable
            style={[styles.counterButton, styles.resetButton]}
            onPress={() => setCount(0)}
          >
            <Text style={styles.counterButtonText}>초기화</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/test1' as any)}
      >
        <Text style={styles.buttonText}>테스트 스크린 1로 이동</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.backButton]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>뒤로 가기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e8f8',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7B3FF2',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  counterBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  counterValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7B3FF2',
    textAlign: 'center',
    marginBottom: 20,
  },
  counterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  counterButton: {
    backgroundColor: '#7B3FF2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7B3FF2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    maxWidth: 300,
  },
  backButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

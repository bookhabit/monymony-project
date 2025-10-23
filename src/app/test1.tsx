import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

export default function Test1Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>테스트 스크린 1</Text>
      <Text style={styles.description}>
        첫 번째 테스트 스크린입니다.{'\n'}
        여기서 원하는 컴포넌트를 추가할 수 있습니다.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📱 스크린 정보</Text>
        <Text style={styles.infoText}>경로: /test1</Text>
        <Text style={styles.infoText}>상태: 정상 작동</Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push('/test2')}>
        <Text style={styles.buttonText}>테스트 스크린 2로 이동</Text>
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
    backgroundColor: '#e8f4f8',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
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
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 3,
  },
  button: {
    backgroundColor: '#007AFF',
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

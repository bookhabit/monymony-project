import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 스크린</Text>
      <Text style={styles.subtitle}>테스트 스크린으로 이동해보세요</Text>

      <Link href="/test1" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>테스트 스크린 1로 이동</Text>
        </Pressable>
      </Link>

      <Link href="/test2" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>테스트 스크린 2로 이동</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

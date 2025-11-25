import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import CustomHeader from '@/components/layout/CustomHeader';

interface ReactNativeTopic {
  id: string;
  title: string;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  emoji: string;
}

const reactNativeTopics: ReactNativeTopic[] = [
  {
    id: 'navigation',
    title: '네비게이션',
    route: '/(app)/react-native-and-expo/navigation',
    icon: 'navigation',
    emoji: '🧭',
  },
  {
    id: 'expo-modules',
    title: 'Expo 모듈',
    route: '/(app)/react-native-and-expo/expo-modules',
    icon: 'extension',
    emoji: '📦',
  },
  {
    id: 'build-deploy',
    title: '빌드 & 배포',
    route: '/(app)/react-native-and-expo/build-deploy',
    icon: 'rocket-launch',
    emoji: '🚀',
  },
  {
    id: 'platform-specific',
    title: '플랫폼 특화',
    route: '/(app)/react-native-and-expo/platform-specific',
    icon: 'devices',
    emoji: '📱',
  },
  {
    id: 'thread',
    title: 'JS-UI 스레드',
    route: '/(app)/react-native-and-expo/thread',
    icon: 'yard',
    emoji: '🧵',
  },
  {
    id: 'react-native-components',
    title: 'React Native 컴포넌트',
    route: '/(app)/react-native-and-expo/react-native-components',
    icon: 'code',
    emoji: '💻',
  },
];

export default function ReactNativeAndExpoScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomHeader title="리액트 네이티브 & 엑스포" showBackButton />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TextBox variant="title2" color={theme.text} style={styles.heading}>
            리액트 네이티브 & 엑스포 주제 선택
          </TextBox>
          <TextBox
            variant="body3"
            color={theme.textSecondary}
            style={styles.subtitle}
          >
            학습하고 싶은 주제를 선택하세요
          </TextBox>

          <View style={styles.cardGrid}>
            {reactNativeTopics.map((topic) => (
              <Pressable
                key={topic.id}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => handleCardPress(topic.route)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <TextBox
                      variant="title4"
                      color={theme.text}
                      style={styles.cardEmoji}
                    >
                      {topic.emoji}
                    </TextBox>
                    <MaterialIcons
                      name={topic.icon}
                      size={24}
                      color={theme.primary}
                      style={styles.cardIcon}
                    />
                  </View>
                  <TextBox
                    variant="body2"
                    color={theme.text}
                    style={styles.cardTitle}
                  >
                    {topic.title}
                  </TextBox>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  heading: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 32,
    lineHeight: 32,
  },
  cardIcon: {
    marginLeft: 'auto',
  },
  cardTitle: {
    fontWeight: '600',
  },
});

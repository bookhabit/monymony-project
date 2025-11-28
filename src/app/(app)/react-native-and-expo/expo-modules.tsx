import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

interface ExpoCoreItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  category: string;
}

const expoCoreItems: ExpoCoreItem[] = [
  {
    id: 'fetch',
    title: 'expo/fetch',
    description: 'WinterCG 표준 Fetch API',
    route: '/(app)/react-native-and-expo/expo-core/fetch',
    icon: 'cloud-download',
    category: '네트워크',
  },
  {
    id: 'encoding',
    title: 'TextEncoder / TextDecoder',
    description: '인코딩 API',
    route: '/(app)/react-native-and-expo/expo-core/encoding',
    icon: 'code',
    category: '텍스트 인코딩',
  },
  {
    id: 'streams',
    title: 'Streams API',
    description: 'ReadableStream / WritableStream / TransformStream',
    route: '/(app)/react-native-and-expo/expo-core/streams',
    icon: 'swap-vert',
    category: '스트림',
  },
  {
    id: 'url',
    title: 'URL API',
    description: 'URL / URLSearchParams',
    route: '/(app)/react-native-and-expo/expo-core/url',
    icon: 'link',
    category: 'URL API',
  },
  {
    id: 'event-hooks',
    title: 'Event Hooks',
    description: 'useEvent / useEventListener',
    route: '/(app)/react-native-and-expo/expo-core/event-hooks',
    icon: 'event',
    category: '이벤트 시스템',
  },
  {
    id: 'shared-objects',
    title: 'SharedObject / SharedRef',
    description: 'Native 객체 공유',
    route: '/(app)/react-native-and-expo/expo-core/shared-objects',
    icon: 'share',
    category: 'Shared Native Objects',
  },

  {
    id: 'pedometer',
    title: 'Pedometer',
    description: '걸음 센서를 사용한 걸음 수 조회 및 실시간 감지',
    route: '/(app)/react-native-and-expo/expo-core/pedometer',
    icon: 'directions-walk',
    category: '센서',
  },
];

export default function ExpoModulesScreen() {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  const handleItemPress = (route: string) => {
    router.push(route as any);
  };

  const renderSection = (category: string, items: ExpoCoreItem[]) => {
    if (items.length === 0) return null;

    return (
      <View key={category} style={styles.section}>
        <TextBox
          variant="title3"
          color={theme.text}
          style={styles.sectionTitle}
        >
          {category}
        </TextBox>
        <View style={styles.itemList}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.itemCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => handleItemPress(item.route)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={theme.primary}
                  />
                  <View style={styles.cardText}>
                    <TextBox
                      variant="body2"
                      color={theme.text}
                      style={styles.cardTitle}
                    >
                      {item.title}
                    </TextBox>
                    <TextBox
                      variant="body4"
                      color={theme.textSecondary}
                      style={styles.cardDescription}
                    >
                      {item.description}
                    </TextBox>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  // 카테고리별로 그룹화
  const categories = Array.from(
    new Set(expoCoreItems.map((item) => item.category))
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[{ paddingBottom: bottom + 20 }]}
    >
      <CustomHeader title="Expo Core API" showBackButton />
      <View style={styles.content}>
        <TextBox variant="title2" color={theme.text} style={styles.heading}>
          Expo Core API
        </TextBox>
        <TextBox
          variant="body3"
          color={theme.textSecondary}
          style={styles.subtitle}
        >
          Expo 핵심 시스템 API를 테스트해보세요
        </TextBox>

        {categories.map((category) => {
          const items = expoCoreItems.filter(
            (item) => item.category === category
          );
          return renderSection(category, items);
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  heading: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  itemList: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  cardContent: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    lineHeight: 18,
  },
});

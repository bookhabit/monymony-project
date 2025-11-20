import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import { getBookById, type Book } from '@/db/readingRepository';

import TextBox from '@/components/common/TextBox';
import { CustomHeader } from '@/components/layout/CustomHeader';

const readingColors = {
  primary: '#06B6D4', // 청록색 (Cyan)
  secondary: '#0891B2', // 진한 청록색
  accent: '#22D3EE', // 밝은 청록색
  gradient1: ['#06B6D4', '#0891B2'],
  gradient2: ['#22D3EE', '#06B6D4'],
};

export default function ReadingDetailScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [params.id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const bookId = parseInt(params.id || '0', 10);
      if (bookId) {
        const result = await getBookById(bookId);
        setBook(result);
      }
    } catch (error) {
      console.error('책 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          backgroundColor={theme.background}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <CustomHeader title="독서 상세" />
        <View style={styles.loadingContainer}>
          <TextBox variant="body3" color={theme.textSecondary}>
            로딩 중...
          </TextBox>
        </View>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          backgroundColor={theme.background}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <CustomHeader title="독서 상세" />
        <View style={styles.loadingContainer}>
          <TextBox variant="body3" color={theme.textSecondary}>
            책을 찾을 수 없습니다
          </TextBox>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <CustomHeader title="독서 상세" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={readingColors.gradient1 as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bookHeader}
        >
          <TextBox variant="title3" color="#fff" style={styles.bookHeaderTitle}>
            {book.title}
          </TextBox>
        </LinearGradient>

        {/* 배운점 */}
        {book.learnedPoints.length > 0 && (
          <View
            style={[styles.fieldSection, { backgroundColor: theme.surface }]}
          >
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.fieldLabel}
            >
              배운점
            </TextBox>
            {book.learnedPoints.map((point, index) => (
              <View key={point.id} style={styles.learnedPointItem}>
                <TextBox
                  variant="body4"
                  color={theme.text}
                  style={styles.learnedPointText}
                >
                  {point.text || `배운점 ${index + 1} (비어있음)`}
                </TextBox>
              </View>
            ))}
          </View>
        )}

        {/* 기억하고 싶은 문장 */}
        {book.memorableQuote && (
          <View
            style={[styles.fieldSection, { backgroundColor: theme.surface }]}
          >
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.fieldLabel}
            >
              기억하고 싶은 문장
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.text}
              style={styles.fieldText}
            >
              {book.memorableQuote}
            </TextBox>
          </View>
        )}

        {/* 감상평(다짐) */}
        {book.review && (
          <View
            style={[styles.fieldSection, { backgroundColor: theme.surface }]}
          >
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.fieldLabel}
            >
              감상평 (다짐)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.text}
              style={styles.fieldText}
            >
              {book.review}
            </TextBox>
          </View>
        )}

        {/* 실천할 것 */}
        {book.actionItem && (
          <View
            style={[styles.fieldSection, { backgroundColor: theme.surface }]}
          >
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.fieldLabel}
            >
              이 책에서 딱 1가지만 실천할 것
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.text}
              style={styles.fieldText}
            >
              {book.actionItem}
            </TextBox>
          </View>
        )}

        {/* 수정 버튼 */}
        <Pressable
          style={[
            styles.editButton,
            { backgroundColor: readingColors.primary },
          ]}
          onPress={() => router.push(`/(app)/reading/edit?id=${book.id}`)}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <TextBox variant="button3" color="#fff" style={styles.editButtonText}>
            수정하기
          </TextBox>
        </Pressable>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookHeader: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  bookHeaderTitle: {
    color: '#fff',
  },
  fieldSection: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  fieldLabel: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  fieldText: {
    lineHeight: 24,
  },
  learnedPointItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  learnedPointText: {
    lineHeight: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 8,
    gap: 8,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    marginLeft: 4,
  },
});

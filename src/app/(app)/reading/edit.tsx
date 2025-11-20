import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';
import {
  getBookById,
  createBook,
  updateBook,
  addLearnedPoint,
  updateLearnedPoint,
  deleteLearnedPoint,
  type Book,
  type BookNote,
} from '@/db/readingRepository';

import TextBox from '@/components/common/TextBox';
import { CustomHeader } from '@/components/layout/CustomHeader';

const readingColors = {
  primary: '#06B6D4', // 청록색 (Cyan)
  secondary: '#0891B2', // 진한 청록색
  accent: '#22D3EE', // 밝은 청록색
  gradient1: ['#06B6D4', '#0891B2'],
  gradient2: ['#22D3EE', '#06B6D4'],
};

export default function ReadingEditScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [memorableQuote, setMemorableQuote] = useState('');
  const [review, setReview] = useState('');
  const [actionItem, setActionItem] = useState('');
  const [learnedPoints, setLearnedPoints] = useState<BookNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isEditMode = !!params.id;

  useEffect(() => {
    if (isEditMode) {
      loadBook();
    } else {
      // 새 책 생성 모드 - 기본 배운점 1개
      setLearnedPoints([{ id: 0, text: '', created_at: '' }]);
      setLoading(false);
    }
  }, [params.id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const bookId = parseInt(params.id || '0', 10);
      if (bookId) {
        const result = await getBookById(bookId);
        if (result) {
          setBook(result);
          setTitle(result.title);
          setMemorableQuote(result.memorableQuote);
          setReview(result.review);
          setActionItem(result.actionItem);
          setLearnedPoints(
            result.learnedPoints.length > 0
              ? result.learnedPoints
              : [{ id: 0, text: '', created_at: '' }]
          );
        }
      }
    } catch (error) {
      console.error('책 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      setSaving(true);

      if (isEditMode && book) {
        // 수정 모드
        await updateBook(book.id, {
          title,
          memorableQuote,
          review,
          actionItem,
        });

        // 기존 배운점 ID 목록
        const existingPointIds = book.learnedPoints.map((p) => p.id);
        const currentPointIds = learnedPoints
          .filter((p) => p.id > 0)
          .map((p) => p.id);

        // 삭제된 배운점 찾기
        const deletedPointIds = existingPointIds.filter(
          (id) => !currentPointIds.includes(id)
        );
        for (const pointId of deletedPointIds) {
          await deleteLearnedPoint(pointId);
        }

        // 배운점 업데이트/추가
        for (const point of learnedPoints) {
          if (point.id > 0) {
            // 기존 배운점 업데이트
            await updateLearnedPoint(point.id, point.text);
          } else if (point.text.trim()) {
            // 새 배운점 추가
            await addLearnedPoint(book.id, point.text);
          }
        }
      } else {
        // 새 책 생성
        const newBook = await createBook(title);
        await updateBook(newBook.id, {
          memorableQuote,
          review,
          actionItem,
        });

        // 배운점 추가 (기본 1개는 이미 생성됨)
        const pointsToAdd = learnedPoints.filter((p) => p.text.trim());
        if (pointsToAdd.length > 0) {
          // 기존 기본 배운점 업데이트
          const firstPoint = newBook.learnedPoints[0];
          if (firstPoint && pointsToAdd[0]) {
            await updateLearnedPoint(firstPoint.id, pointsToAdd[0].text);
          }

          // 나머지 배운점 추가
          for (let i = 1; i < pointsToAdd.length; i++) {
            await addLearnedPoint(newBook.id, pointsToAdd[i].text);
          }
        }
      }

      router.back();
    } catch (error) {
      console.error('저장 실패:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLearnedPoint = () => {
    setLearnedPoints([...learnedPoints, { id: 0, text: '', created_at: '' }]);
  };

  const handleUpdateLearnedPoint = (index: number, text: string) => {
    const updated = [...learnedPoints];
    updated[index] = { ...updated[index], text };
    setLearnedPoints(updated);
  };

  const handleDeleteLearnedPoint = async (index: number, pointId: number) => {
    if (pointId > 0) {
      await deleteLearnedPoint(pointId);
    }
    const updated = learnedPoints.filter((_, i) => i !== index);
    setLearnedPoints(
      updated.length > 0 ? updated : [{ id: 0, text: '', created_at: '' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          backgroundColor={theme.background}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <CustomHeader title={isEditMode ? '독서 기록 수정' : '독서 기록'} />
        <View style={styles.loadingContainer}>
          <TextBox variant="body3" color={theme.textSecondary}>
            로딩 중...
          </TextBox>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <CustomHeader title={isEditMode ? '독서 기록 수정' : '독서 기록'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 제목 */}
        <View
          style={[styles.fieldSection, { backgroundColor: theme.background }]}
        >
          <TextBox variant="body2" color={theme.text} style={styles.fieldLabel}>
            책 제목
          </TextBox>
          <TextInput
            style={[
              styles.titleInput,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="책 제목을 입력하세요"
            placeholderTextColor={theme.placeholder}
            value={title}
            onChangeText={setTitle}
            returnKeyType="done"
          />
        </View>

        {/* 배운점 */}
        <View
          style={[styles.fieldSection, { backgroundColor: theme.background }]}
        >
          <View style={styles.fieldHeader}>
            <TextBox
              variant="body2"
              color={theme.text}
              style={styles.fieldLabel}
            >
              배운점
            </TextBox>
            <Pressable
              onPress={handleAddLearnedPoint}
              style={styles.addPointButton}
            >
              <MaterialIcons
                name="add-circle"
                size={24}
                color={readingColors.primary}
              />
            </Pressable>
          </View>
          {learnedPoints.map((point, index) => (
            <View key={index} style={styles.learnedPointItem}>
              <TextInput
                style={[
                  styles.textArea,
                  { color: theme.text, borderColor: theme.border },
                ]}
                placeholder={`배운점 ${index + 1}`}
                placeholderTextColor={theme.placeholder}
                value={point.text}
                onChangeText={(text) => handleUpdateLearnedPoint(index, text)}
                multiline
                returnKeyType="done"
              />
              {learnedPoints.length > 1 && (
                <Pressable
                  onPress={() => handleDeleteLearnedPoint(index, point.id)}
                  style={styles.deletePointButton}
                >
                  <MaterialIcons name="close" size={20} color={theme.error} />
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* 기억하고 싶은 문장 */}
        <View
          style={[styles.fieldSection, { backgroundColor: theme.background }]}
        >
          <TextBox variant="body2" color={theme.text} style={styles.fieldLabel}>
            기억하고 싶은 문장
          </TextBox>
          <TextInput
            style={[
              styles.textArea,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="인상 깊었던 문장을 적어보세요"
            placeholderTextColor={theme.placeholder}
            value={memorableQuote}
            onChangeText={setMemorableQuote}
            multiline
            returnKeyType="done"
          />
        </View>

        {/* 감상평(다짐) */}
        <View
          style={[styles.fieldSection, { backgroundColor: theme.background }]}
        >
          <TextBox variant="body2" color={theme.text} style={styles.fieldLabel}>
            감상평 (다짐)
          </TextBox>
          <TextInput
            style={[
              styles.textArea,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="이 책을 읽고 느낀 점과 다짐을 적어보세요"
            placeholderTextColor={theme.placeholder}
            value={review}
            onChangeText={setReview}
            multiline
            returnKeyType="done"
          />
        </View>

        {/* 실천할 것 */}
        <View
          style={[styles.fieldSection, { backgroundColor: theme.background }]}
        >
          <TextBox variant="body2" color={theme.text} style={styles.fieldLabel}>
            이 책에서 딱 1가지만 실천할 것
          </TextBox>
          <TextInput
            style={[
              styles.textArea,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="이 책에서 배운 것 중 실천할 한 가지를 적어보세요"
            placeholderTextColor={theme.placeholder}
            value={actionItem}
            onChangeText={setActionItem}
            multiline
            returnKeyType="done"
          />
        </View>

        {/* 저장 버튼 */}
        <Pressable
          style={[
            styles.saveButton,
            {
              backgroundColor: title.trim()
                ? readingColors.primary
                : theme.border,
            },
          ]}
          onPress={handleSave}
          disabled={!title.trim() || saving}
        >
          <TextBox variant="button2" color="#fff">
            {saving ? '저장 중...' : '저장하기'}
          </TextBox>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
  fieldSection: {
    borderRadius: 20,
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  titleInput: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  learnedPointItem: {
    marginBottom: 16,
    position: 'relative',
  },
  addPointButton: {
    padding: 6,
  },
  deletePointButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  saveButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
});

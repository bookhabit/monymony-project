import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function DesignScreen() {
  const router = useRouter();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [selectedVariant, setSelectedVariant] = useState<string>('title1');

  const textVariants = [
    'title1',
    'title2',
    'title3',
    'title4',
    'body1',
    'body2',
    'body3',
    'body4',
    'body5',
    'body6',
    'button1',
    'button2',
    'button3',
    'button4',
    'caption1',
    'caption2',
    'caption3',
  ];

  const colorTokens = [
    { name: 'Primary', value: theme.primary },
    { name: 'Secondary', value: theme.secondary },
    { name: 'Success', value: theme.success },
    { name: 'Error', value: theme.error },
    { name: 'Warning', value: theme.warning },
    { name: 'Background', value: theme.background },
    { name: 'Surface', value: theme.surface },
    { name: 'Text', value: theme.text },
    { name: 'Text Secondary', value: theme.textSecondary },
    { name: 'Border', value: theme.border },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <TextBox variant="title1" style={styles.header} color={theme.text}>
          🎨 Design System
        </TextBox>

        {/* Theme Toggle */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            테마 전환
          </TextBox>
          <Pressable
            style={[styles.themeButton, { backgroundColor: theme.primary }]}
            onPress={toggleTheme}
          >
            <TextBox variant="button2" color="#fff">
              {isDarkMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
            </TextBox>
          </Pressable>
        </View>

        {/* Color Palette */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            색상 팔레트
          </TextBox>
          <View style={styles.colorGrid}>
            {colorTokens.map((color) => (
              <View key={color.name} style={styles.colorItem}>
                <View
                  style={[styles.colorBox, { backgroundColor: color.value }]}
                />
                <TextBox variant="caption2" color={theme.textSecondary}>
                  {color.name}
                </TextBox>
                <TextBox variant="caption3" color={theme.textSecondary}>
                  {color.value}
                </TextBox>
              </View>
            ))}
          </View>
        </View>

        {/* Typography */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            타이포그래피
          </TextBox>
          <ScrollView
            horizontal
            style={styles.variantSelector}
            showsHorizontalScrollIndicator={false}
          >
            {textVariants.map((variant) => (
              <Pressable
                key={variant}
                style={[
                  styles.variantButton,
                  {
                    backgroundColor:
                      selectedVariant === variant
                        ? theme.primary
                        : theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setSelectedVariant(variant)}
              >
                <TextBox
                  variant="caption2"
                  color={
                    selectedVariant === variant ? '#fff' : theme.textSecondary
                  }
                >
                  {variant}
                </TextBox>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.previewBox}>
            <TextBox
              variant={selectedVariant as any}
              color={theme.text}
              style={styles.previewText}
            >
              The quick brown fox jumps over the lazy dog
            </TextBox>
            <TextBox
              variant={selectedVariant as any}
              color={theme.text}
              style={styles.previewText}
            >
              안녕하세요, 디자인 시스템 테스트입니다
            </TextBox>
          </View>
        </View>

        {/* Navigation */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Pressable
            style={[styles.navButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/(app)/(tabs)/image')}
          >
            <TextBox variant="button2" color="#fff">
              이미지 테스트로 이동
            </TextBox>
          </Pressable>

          <Pressable
            style={[styles.navButton, { backgroundColor: theme.secondary }]}
            onPress={() => router.push('/(app)/(tabs)/icon')}
          >
            <TextBox variant="button2" color="#fff">
              아이콘 테스트로 이동
            </TextBox>
          </Pressable>
        </View>
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
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  themeButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  colorItem: {
    alignItems: 'center',
    width: '30%',
    gap: 4,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 4,
  },
  variantSelector: {
    marginBottom: 16,
  },
  variantButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  previewBox: {
    padding: 16,
    gap: 12,
  },
  previewText: {
    textAlign: 'left',
  },
  navButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
});

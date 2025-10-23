import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export default function DesignSystemScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <TextBox
          variant="title1"
          style={styles.sectionTitle}
          color={theme.text}
        >
          📝 디자인 시스템
        </TextBox>

        {/* Theme Toggle */}
        <Pressable
          style={[styles.themeToggle, { backgroundColor: theme.primary }]}
          onPress={toggleTheme}
        >
          <TextBox variant="button2" color="#fff">
            {isDarkMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
          </TextBox>
        </Pressable>

        {/* Theme Colors */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.label, { borderBottomColor: theme.border }]}
            color={theme.textSecondary}
          >
            Theme Colors
          </TextBox>

          <View style={styles.colorRow}>
            <View style={styles.colorItem}>
              <View
                style={[styles.colorBox, { backgroundColor: theme.primary }]}
              />
              <TextBox variant="caption3" color={theme.text}>
                Primary
              </TextBox>
            </View>
            <View style={styles.colorItem}>
              <View
                style={[styles.colorBox, { backgroundColor: theme.secondary }]}
              />
              <TextBox variant="caption3" color={theme.text}>
                Secondary
              </TextBox>
            </View>
            <View style={styles.colorItem}>
              <View
                style={[styles.colorBox, { backgroundColor: theme.success }]}
              />
              <TextBox variant="caption3" color={theme.text}>
                Success
              </TextBox>
            </View>
            <View style={styles.colorItem}>
              <View
                style={[styles.colorBox, { backgroundColor: theme.error }]}
              />
              <TextBox variant="caption3" color={theme.text}>
                Error
              </TextBox>
            </View>
            <View style={styles.colorItem}>
              <View
                style={[styles.colorBox, { backgroundColor: theme.warning }]}
              />
              <TextBox variant="caption3" color={theme.text}>
                Warning
              </TextBox>
            </View>
          </View>

          <View style={styles.colorTextRow}>
            <TextBox variant="body3" color={theme.primary}>
              ● Primary Text
            </TextBox>
            <TextBox variant="body3" color={theme.secondary}>
              ● Secondary Text
            </TextBox>
            <TextBox variant="body3" color={theme.success}>
              ● Success Text
            </TextBox>
            <TextBox variant="body3" color={theme.error}>
              ● Error Text
            </TextBox>
            <TextBox variant="body3" color={theme.warning}>
              ● Warning Text
            </TextBox>
          </View>
        </View>

        {/* Title Variants */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.label, { borderBottomColor: theme.border }]}
            color={theme.textSecondary}
          >
            Titles (BMJUA)
          </TextBox>
          <TextBox variant="title1" color={theme.text}>
            title1 - BMJUA 26px
          </TextBox>
          <TextBox variant="title2" color={theme.text}>
            title2 - BMJUA 24px
          </TextBox>
          <TextBox variant="title3" color={theme.text}>
            title3 - BMJUA 22px
          </TextBox>
          <TextBox variant="title4" color={theme.text}>
            title4 - BMJUA 20px
          </TextBox>
          <TextBox variant="title5" color={theme.text}>
            title5 - BMJUA 18px
          </TextBox>
        </View>

        {/* Body Variants */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.label, { borderBottomColor: theme.border }]}
            color={theme.textSecondary}
          >
            Body (Pretendard)
          </TextBox>
          <TextBox variant="body1" color={theme.text}>
            body1 - Pretendard Bold 17px
          </TextBox>
          <TextBox variant="body2" color={theme.text}>
            body2 - Pretendard Bold 16px
          </TextBox>
          <TextBox variant="body3" color={theme.text}>
            body3 - Pretendard Regular 15px
          </TextBox>
          <TextBox variant="body4" color={theme.text}>
            body4 - Pretendard Regular 14px
          </TextBox>
          <TextBox variant="body5" color={theme.text}>
            body5 - Pretendard Light 14px
          </TextBox>
          <TextBox variant="body6" color={theme.text}>
            body6 - Pretendard Light 13px
          </TextBox>
          <TextBox variant="body7" color={theme.text}>
            body7 - Pretendard Light 12px
          </TextBox>
        </View>

        {/* Button Variants */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.label, { borderBottomColor: theme.border }]}
            color={theme.textSecondary}
          >
            Button (Pretendard)
          </TextBox>
          <View
            style={[styles.buttonWrapper, { backgroundColor: theme.primary }]}
          >
            <TextBox variant="button1" color="#fff">
              button1 - Bold 18px
            </TextBox>
          </View>
          <View
            style={[styles.buttonWrapper, { backgroundColor: theme.primary }]}
          >
            <TextBox variant="button2" color="#fff">
              button2 - Bold 16px
            </TextBox>
          </View>
          <View
            style={[styles.buttonWrapper, { backgroundColor: theme.primary }]}
          >
            <TextBox variant="button3" color="#fff">
              button3 - Regular 14px
            </TextBox>
          </View>
          <View
            style={[styles.buttonWrapper, { backgroundColor: theme.primary }]}
          >
            <TextBox variant="button4" color="#fff">
              button4 - Regular 12px
            </TextBox>
          </View>
        </View>

        {/* Caption Variants */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.label, { borderBottomColor: theme.border }]}
            color={theme.textSecondary}
          >
            Caption (Roboto)
          </TextBox>
          <TextBox variant="caption1" color={theme.text}>
            caption1 - Roboto Bold 13px
          </TextBox>
          <TextBox variant="caption2" color={theme.text}>
            caption2 - Roboto Regular 12px
          </TextBox>
          <TextBox variant="caption3" color={theme.text}>
            caption3 - Roboto Light 12px
          </TextBox>
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
  sectionTitle: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  themeToggle: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
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
  label: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorItem: {
    alignItems: 'center',
    gap: 8,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  colorTextRow: {
    gap: 8,
  },
  buttonWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
});

import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Link } from 'expo-router';

import TextBox from '@/components/common/TextBox';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextBox variant="title1" style={styles.sectionTitle}>
          📝 TextBox 폰트 테스트
        </TextBox>

        {/* Title Variants */}
        <View style={styles.section}>
          <TextBox variant="body2" style={styles.label}>
            Titles (BMJUA)
          </TextBox>
          <TextBox variant="title1">title1 - BMJUA 26px</TextBox>
          <TextBox variant="title2">title2 - BMJUA 24px</TextBox>
          <TextBox variant="title3">title3 - BMJUA 22px</TextBox>
          <TextBox variant="title4">title4 - BMJUA 20px</TextBox>
          <TextBox variant="title5">title5 - BMJUA 18px</TextBox>
        </View>

        {/* Body Variants */}
        <View style={styles.section}>
          <TextBox variant="body2" style={styles.label}>
            Body (Pretendard)
          </TextBox>
          <TextBox variant="body1">body1 - Pretendard Bold 17px</TextBox>
          <TextBox variant="body2">body2 - Pretendard Bold 16px</TextBox>
          <TextBox variant="body3">body3 - Pretendard Regular 15px</TextBox>
          <TextBox variant="body4">body4 - Pretendard Regular 14px</TextBox>
          <TextBox variant="body5">body5 - Pretendard Light 14px</TextBox>
          <TextBox variant="body6">body6 - Pretendard Light 13px</TextBox>
          <TextBox variant="body7">body7 - Pretendard Light 12px</TextBox>
        </View>

        {/* Button Variants */}
        <View style={styles.section}>
          <TextBox variant="body2" style={styles.label}>
            Button (Pretendard)
          </TextBox>
          <View style={styles.buttonWrapper}>
            <TextBox variant="button1" style={styles.buttonText}>
              button1 - Bold 18px
            </TextBox>
          </View>
          <View style={styles.buttonWrapper}>
            <TextBox variant="button2" style={styles.buttonText}>
              button2 - Bold 16px
            </TextBox>
          </View>
          <View style={styles.buttonWrapper}>
            <TextBox variant="button3" style={styles.buttonText}>
              button3 - Regular 14px
            </TextBox>
          </View>
          <View style={styles.buttonWrapper}>
            <TextBox variant="button4" style={styles.buttonText}>
              button4 - Regular 12px
            </TextBox>
          </View>
        </View>

        {/* Caption Variants */}
        <View style={styles.section}>
          <TextBox variant="body2" style={styles.label}>
            Caption (Roboto)
          </TextBox>
          <TextBox variant="caption1">caption1 - Roboto Bold 13px</TextBox>
          <TextBox variant="caption2">caption2 - Roboto Regular 12px</TextBox>
          <TextBox variant="caption3">caption3 - Roboto Light 12px</TextBox>
        </View>

        {/* Custom Style Test */}
        <View style={styles.section}>
          <TextBox variant="body2" style={styles.label}>
            Custom Style (color prop)
          </TextBox>
          <TextBox variant="body1" color="#007AFF">
            파란색 텍스트
          </TextBox>
          <TextBox variant="title3" color="#FF3B30" style={{ fontSize: 28 }}>
            빨간색 + 큰 폰트
          </TextBox>
          <TextBox
            variant="body3"
            color="#34C759"
            style={{ fontStyle: 'italic' }}
          >
            초록색 이탤릭
          </TextBox>
          <TextBox variant="body4" color="#FF9500">
            오렌지색 (color prop 사용)
          </TextBox>
          <TextBox variant="body2" color="#AF52DE">
            보라색 (color prop 사용)
          </TextBox>
        </View>

        {/* Navigation Links */}
        <View style={styles.navigationSection}>
          <TextBox variant="title4" style={styles.navTitle}>
            테스트 화면 이동
          </TextBox>

          <Link href="/test1" asChild>
            <Pressable style={styles.navButton}>
              <TextBox variant="button2" style={styles.navButtonText}>
                테스트 스크린 1
              </TextBox>
            </Pressable>
          </Link>

          <Link href="/test2" asChild>
            <Pressable style={styles.navButton}>
              <TextBox variant="button2" style={styles.navButtonText}>
                테스트 스크린 2
              </TextBox>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
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
    color: '#666',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  buttonWrapper: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  navigationSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
  },
});

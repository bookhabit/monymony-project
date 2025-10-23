import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import {
  AvatarImage,
  CoverImage,
  OptimizedImage,
  ThumbnailImage,
} from '@/components/common/OptimizedImage';
import TextBox from '@/components/common/TextBox';

export default function Test1Screen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [imageKey, setImageKey] = useState(0);
  const [showErrorImage, setShowErrorImage] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <TextBox variant="title2" style={styles.title} color={theme.text}>
          🖼️ OptimizedImage 예제
        </TextBox>

        <TextBox
          variant="body4"
          style={styles.description}
          color={theme.textSecondary}
        >
          다양한 이미지 컴포넌트 사용 예제입니다
        </TextBox>

        {/* Avatar Images */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Avatar Images (원형)
          </TextBox>

          <View style={styles.avatarRow}>
            <View style={styles.avatarItem}>
              <AvatarImage
                source={{
                  uri: 'https://picsum.photos/200/200?random=1',
                }}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                48x48
              </TextBox>
            </View>

            <View style={styles.avatarItem}>
              <AvatarImage
                source={{
                  uri: 'https://picsum.photos/200/200?random=2',
                }}
                style={{ width: 64, height: 64, borderRadius: 32 }}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                64x64
              </TextBox>
            </View>

            <View style={styles.avatarItem}>
              <AvatarImage
                source={{
                  uri: 'https://picsum.photos/200/200?random=3',
                }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                80x80
              </TextBox>
            </View>

            <View style={styles.avatarItem}>
              <AvatarImage
                source={{
                  uri: 'https://picsum.photos/200/200?random=4',
                }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                100x100
              </TextBox>
            </View>
          </View>
        </View>

        {/* Thumbnail Images */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Thumbnail Images (16:9)
          </TextBox>

          <ThumbnailImage
            source={{
              uri: 'https://picsum.photos/800/450?random=5',
            }}
            style={{ marginBottom: 12 }}
          />

          <ThumbnailImage
            source={{
              uri: 'https://picsum.photos/800/450?random=6',
            }}
          />
        </View>

        {/* Cover Images */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Cover Images (2:1)
          </TextBox>

          <CoverImage
            source={{
              uri: 'https://picsum.photos/1000/500?random=7',
            }}
            style={{ marginBottom: 12 }}
          />

          <CoverImage
            source={{
              uri: 'https://picsum.photos/1000/500?random=8',
            }}
          />
        </View>

        {/* Progressive Loading */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Progressive Loading (점진적 로딩)
          </TextBox>

          <View style={styles.infoBox}>
            <TextBox variant="caption2" color={theme.textSecondary}>
              💡 Tip: 네트워크를 느리게 설정하면 효과가 더 명확합니다
            </TextBox>
            <TextBox variant="caption3" color={theme.textSecondary}>
              - iOS: 설정 → 개발자 → Network Link Conditioner
            </TextBox>
            <TextBox variant="caption3" color={theme.textSecondary}>
              - Android: 개발자 옵션 → 네트워크 속도 제한
            </TextBox>
          </View>

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            초대형 이미지 (5000x3000) + 블러 효과
          </TextBox>
          <OptimizedImage
            key={`progressive-1-${imageKey}`}
            source={{
              uri: `https://picsum.photos/5000/3000?random=${imageKey + 200}`,
            }}
            thumbnailSource={`https://picsum.photos/50/30?random=${imageKey + 200}`}
            blurRadius={50}
            aspectRatio={5 / 3}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            대형 이미지 (3000x2000) + 중간 블러
          </TextBox>
          <OptimizedImage
            key={`progressive-2-${imageKey}`}
            source={{
              uri: `https://picsum.photos/3000/2000?random=${imageKey + 201}`,
            }}
            thumbnailSource={`https://picsum.photos/50/33?random=${imageKey + 201}`}
            blurRadius={30}
            aspectRatio={3 / 2}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            블러 없이 (즉시 전환)
          </TextBox>
          <OptimizedImage
            key={`progressive-3-${imageKey}`}
            source={{
              uri: `https://picsum.photos/2000/1500?random=${imageKey + 202}`,
            }}
            thumbnailSource={`https://picsum.photos/50/37?random=${imageKey + 202}`}
            blurRadius={0}
            aspectRatio={4 / 3}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <Pressable
            style={[styles.controlButton, { backgroundColor: theme.warning }]}
            onPress={() => setImageKey((prev) => prev + 1)}
          >
            <TextBox variant="button3" color="#fff">
              🔄 Progressive Loading 다시 보기
            </TextBox>
          </Pressable>
        </View>

        {/* Custom Aspect Ratio */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Custom Aspect Ratio
          </TextBox>

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            Square (1:1)
          </TextBox>
          <OptimizedImage
            source={{
              uri: 'https://picsum.photos/600/600?random=9',
            }}
            aspectRatio={1}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            Portrait (3:4)
          </TextBox>
          <OptimizedImage
            source={{
              uri: 'https://picsum.photos/600/800?random=10',
            }}
            aspectRatio={3 / 4}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            Ultra Wide (21:9)
          </TextBox>
          <OptimizedImage
            source={{
              uri: 'https://picsum.photos/1400/600?random=11',
            }}
            aspectRatio={21 / 9}
            style={{ width: '100%' }}
          />
        </View>

        {/* Loading State Test */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Loading State Test (로딩 상태)
          </TextBox>

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            큰 이미지 로드 중 - Skeleton 표시됨
          </TextBox>

          <OptimizedImage
            key={`loading-${imageKey}`}
            source={{
              uri: `https://picsum.photos/2000/1500?random=${imageKey}`,
            }}
            aspectRatio={4 / 3}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <Pressable
            style={[styles.controlButton, { backgroundColor: theme.secondary }]}
            onPress={() => setImageKey((prev) => prev + 1)}
          >
            <TextBox variant="button3" color="#fff">
              🔄 새 이미지 로드 (로딩 상태 보기)
            </TextBox>
          </Pressable>

          <TextBox
            variant="caption2"
            style={[styles.label, { marginTop: 16 }]}
            color={theme.textSecondary}
          >
            Placeholder 없이 로드 (showPlaceholder=false)
          </TextBox>

          <OptimizedImage
            key={`no-placeholder-${imageKey}`}
            source={{
              uri: `https://picsum.photos/800/600?random=${imageKey + 100}`,
            }}
            aspectRatio={4 / 3}
            style={{ width: '100%' }}
            showPlaceholder={false}
          />
        </View>

        {/* Error State */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Error State (에러 상태)
          </TextBox>

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            기본 에러 메시지
          </TextBox>

          <OptimizedImage
            source={{
              uri: 'https://invalid-url-example.com/image.jpg',
            }}
            aspectRatio={16 / 9}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            커스텀 에러 컴포넌트
          </TextBox>

          <OptimizedImage
            source={{
              uri: 'https://invalid-url-example-custom.com/image.jpg',
            }}
            aspectRatio={16 / 9}
            style={{ width: '100%', marginBottom: 16 }}
            errorComponent={
              <View style={styles.customError}>
                <TextBox variant="body5" color={theme.error}>
                  ❌ 커스텀 에러 메시지
                </TextBox>
                <TextBox variant="caption3" color={theme.textSecondary}>
                  이미지를 불러올 수 없습니다
                </TextBox>
              </View>
            }
          />

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            에러 상태 토글 테스트
          </TextBox>

          <OptimizedImage
            key={`error-toggle-${showErrorImage}`}
            source={{
              uri: showErrorImage
                ? 'https://invalid-url-test.com/error.jpg'
                : `https://picsum.photos/800/450?random=${Date.now()}`,
            }}
            aspectRatio={16 / 9}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <Pressable
            style={[
              styles.controlButton,
              { backgroundColor: showErrorImage ? theme.success : theme.error },
            ]}
            onPress={() => setShowErrorImage(!showErrorImage)}
          >
            <TextBox variant="button3" color="#fff">
              {showErrorImage ? '✅ 정상 이미지 보기' : '❌ 에러 발생시키기'}
            </TextBox>
          </Pressable>
        </View>

        {/* Navigation */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/test2')}
          >
            <TextBox variant="button2" color="#fff">
              테스트 스크린 2로 이동
            </TextBox>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: theme.textSecondary }]}
            onPress={() => router.back()}
          >
            <TextBox variant="button2" color="#fff">
              뒤로 가기
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
  title: {
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
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
  label: {
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    gap: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  avatarItem: {
    alignItems: 'center',
    gap: 8,
  },
  customError: {
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonItem: {
    flex: 1,
  },
  comparisonLabel: {
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
});

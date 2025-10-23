import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import LocalIcon from '@/components/common/LocalIcon';
import TextBox from '@/components/common/TextBox';
import {
  LocalIconButton,
  MaterialIconButton,
} from '@/components/common/button';

export default function Test2Screen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [iconSize, setIconSize] = useState(24);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <TextBox variant="title2" style={styles.title} color={theme.text}>
          🎨 SVG & Icon 테스트
        </TextBox>

        <TextBox
          variant="body4"
          style={styles.description}
          color={theme.textSecondary}
        >
          로컬 SVG와 Expo Icons 사용 예제입니다
        </TextBox>

        {/* Icon Size Control */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            아이콘 크기 조절
          </TextBox>

          <View style={styles.sizeControl}>
            <Pressable
              style={[styles.sizeButton, { backgroundColor: theme.primary }]}
              onPress={() => setIconSize(Math.max(16, iconSize - 8))}
            >
              <TextBox variant="button4" color="#fff">
                작게
              </TextBox>
            </Pressable>

            <View style={styles.sizeDisplay}>
              <TextBox variant="body3" color={theme.text}>
                {iconSize}px
              </TextBox>
            </View>

            <Pressable
              style={[styles.sizeButton, { backgroundColor: theme.primary }]}
              onPress={() => setIconSize(Math.min(100, iconSize + 8))}
            >
              <TextBox variant="button4" color="#fff">
                크게
              </TextBox>
            </Pressable>
          </View>
        </View>

        {/* Local SVG Icons */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Local SVG Icons
          </TextBox>

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            react-native-svg로 로드된 로컬 SVG 파일
          </TextBox>

          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <LocalIcon
                  name="CloseIcon"
                  width={iconSize}
                  height={iconSize}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                Close
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <LocalIcon name="LeftIcon" width={iconSize} height={iconSize} />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                Left
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <LocalIcon
                  name="RightIcon"
                  width={iconSize}
                  height={iconSize}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                Right
              </TextBox>
            </View>
          </View>
        </View>

        {/* Material Icons - Common */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Material Icons - Common
          </TextBox>

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            @expo/vector-icons의 MaterialIcons
          </TextBox>

          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons name="home" size={iconSize} color={theme.text} />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                home
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="settings"
                  size={iconSize}
                  color={theme.text}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                settings
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="favorite"
                  size={iconSize}
                  color={theme.error}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                favorite
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="search"
                  size={iconSize}
                  color={theme.text}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                search
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={iconSize}
                  color={theme.text}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                person
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="notifications"
                  size={iconSize}
                  color={theme.warning}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                notifications
              </TextBox>
            </View>
          </View>
        </View>

        {/* Material Icons - Actions */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Material Icons - Actions
          </TextBox>

          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="add"
                  size={iconSize}
                  color={theme.success}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                add
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="edit"
                  size={iconSize}
                  color={theme.primary}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                edit
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="delete"
                  size={iconSize}
                  color={theme.error}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                delete
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="share"
                  size={iconSize}
                  color={theme.text}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                share
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="download"
                  size={iconSize}
                  color={theme.text}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                download
              </TextBox>
            </View>

            <View style={styles.iconItem}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <MaterialIcons
                  name="upload"
                  size={iconSize}
                  color={theme.text}
                />
              </View>
              <TextBox variant="caption3" color={theme.textSecondary}>
                upload
              </TextBox>
            </View>
          </View>
        </View>

        {/* IconButton Examples */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            IconButton 컴포넌트 예시
          </TextBox>

          <TextBox
            variant="caption2"
            style={styles.label}
            color={theme.textSecondary}
          >
            MaterialIconButton - variant 별 예시
          </TextBox>

          <View style={styles.buttonRow}>
            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="home"
                variant="default"
                size={iconSize}
                onPress={() => console.log('Home - default')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                default
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="favorite"
                variant="filled"
                size={iconSize}
                onPress={() => console.log('Favorite - filled')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                filled
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="settings"
                variant="outlined"
                size={iconSize}
                onPress={() => console.log('Settings - outlined')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                outlined
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="search"
                variant="ghost"
                size={iconSize}
                onPress={() => console.log('Search - ghost')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                ghost
              </TextBox>
            </View>
          </View>

          <TextBox
            variant="caption2"
            style={[styles.label, { marginTop: 24 }]}
            color={theme.textSecondary}
          >
            LocalIconButton - variant 별 예시
          </TextBox>

          <View style={styles.buttonRow}>
            <View style={styles.buttonItem}>
              <LocalIconButton
                icon="CloseIcon"
                variant="default"
                size={iconSize}
                onPress={() => console.log('Close - default')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                default
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <LocalIconButton
                icon="LeftIcon"
                variant="filled"
                size={iconSize}
                onPress={() => console.log('Left - filled')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                filled
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <LocalIconButton
                icon="RightIcon"
                variant="outlined"
                size={iconSize}
                onPress={() => console.log('Right - outlined')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                outlined
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <LocalIconButton
                icon="CloseIcon"
                variant="ghost"
                size={iconSize}
                onPress={() => console.log('Close - ghost')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                ghost
              </TextBox>
            </View>
          </View>

          <TextBox
            variant="caption2"
            style={[styles.label, { marginTop: 24 }]}
            color={theme.textSecondary}
          >
            색상 커스터마이징
          </TextBox>

          <View style={styles.buttonRow}>
            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="favorite"
                variant="ghost"
                color={theme.error}
                size={iconSize}
                onPress={() => console.log('Heart')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                error
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="check-circle"
                variant="ghost"
                color={theme.success}
                size={iconSize}
                onPress={() => console.log('Check')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                success
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="notifications"
                variant="ghost"
                color={theme.warning}
                size={iconSize}
                onPress={() => console.log('Notification')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                warning
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="info"
                variant="ghost"
                color={theme.primary}
                size={iconSize}
                onPress={() => console.log('Info')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                primary
              </TextBox>
            </View>
          </View>

          <TextBox
            variant="caption2"
            style={[styles.label, { marginTop: 24 }]}
            color={theme.textSecondary}
          >
            Disabled 상태
          </TextBox>

          <View style={styles.buttonRow}>
            <View style={styles.buttonItem}>
              <MaterialIconButton
                icon="edit"
                variant="filled"
                disabled={true}
                size={iconSize}
                onPress={() => console.log('Should not fire')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                disabled
              </TextBox>
            </View>

            <View style={styles.buttonItem}>
              <LocalIconButton
                icon="CloseIcon"
                variant="outlined"
                disabled={true}
                size={iconSize}
                onPress={() => console.log('Should not fire')}
              />
              <TextBox variant="caption3" color={theme.textSecondary}>
                disabled
              </TextBox>
            </View>
          </View>
        </View>

        {/* Icon with Text Examples */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <TextBox
            variant="body2"
            style={[styles.sectionTitle, { borderBottomColor: theme.border }]}
            color={theme.text}
          >
            Icons with Text (실제 사용 예시)
          </TextBox>

          <Pressable
            style={[styles.exampleButton, { backgroundColor: theme.primary }]}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <TextBox variant="button3" color="#fff">
              새 항목 추가
            </TextBox>
          </Pressable>

          <Pressable
            style={[styles.exampleButton, { backgroundColor: theme.success }]}
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <TextBox variant="button3" color="#fff">
              완료
            </TextBox>
          </Pressable>

          <Pressable
            style={[styles.exampleButton, { backgroundColor: theme.error }]}
          >
            <MaterialIcons name="delete" size={20} color="#fff" />
            <TextBox variant="button3" color="#fff">
              삭제
            </TextBox>
          </Pressable>

          <View
            style={[
              styles.exampleButton,
              { backgroundColor: 'transparent', borderColor: theme.border },
              styles.outlineButton,
            ]}
          >
            <LocalIcon name="LeftIcon" width={20} height={20} />
            <TextBox variant="button3" color={theme.text}>
              이전 페이지
            </TextBox>
          </View>
        </View>

        {/* Navigation */}
        <View style={[styles.section, { backgroundColor: theme.background }]}>
          <Pressable
            style={[styles.navButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/test1')}
          >
            <TextBox variant="button2" color="#fff">
              테스트 스크린 1로 이동
            </TextBox>
          </Pressable>

          <Pressable
            style={[styles.navButton, { backgroundColor: theme.textSecondary }]}
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
    marginBottom: 16,
  },
  sizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sizeDisplay: {
    minWidth: 60,
    alignItems: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  iconItem: {
    alignItems: 'center',
    gap: 8,
    width: '30%',
  },
  iconBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-around',
  },
  buttonItem: {
    alignItems: 'center',
    gap: 8,
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
  },
  outlineButton: {
    borderWidth: 1,
  },
  navButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
});

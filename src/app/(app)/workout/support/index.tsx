import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import Constants from 'expo-constants';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';
import CustomHeader from '@/components/layout/CustomHeader';

import { useMemoEntries } from '@/hooks/notes/useMemoEntries';

import { formatDate } from '@/utils/routine';

const BUG_REPORT_EMAIL = 'support@monymony.app';
const REQUEST_EMAIL = 'support@monymony.app';

const SupportScreen = () => {
  const { theme } = useTheme();
  const {
    entries: memoEntries,
    latestEntry,
    loading: memoLoading,
    refresh: refreshMemo,
  } = useMemoEntries();

  const [bugDescription, setBugDescription] = useState('');
  const [sendingBug, setSendingBug] = useState(false);
  const [requestItems, setRequestItems] = useState<string[]>(['']);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [memoPickerVisible, setMemoPickerVisible] = useState(false);
  const [memoTargetIndex, setMemoTargetIndex] = useState<number | null>(null);

  const expoConfig = Constants.expoConfig;

  const deviceInfo = useMemo(() => {
    const appVersion =
      expoConfig?.version ??
      (Platform.OS === 'ios'
        ? expoConfig?.ios?.buildNumber
        : expoConfig?.android?.version) ??
      'unknown';

    const buildNumber =
      Platform.OS === 'ios'
        ? (expoConfig?.ios?.buildNumber ?? 'unknown')
        : expoConfig?.android?.versionCode
          ? String(expoConfig.android.versionCode)
          : (expoConfig?.android?.version ?? 'unknown');

    const runtimeConfig = expoConfig?.runtimeVersion;
    const runtimeVersion =
      typeof runtimeConfig === 'string'
        ? runtimeConfig
        : runtimeConfig?.policy
          ? `policy:${runtimeConfig.policy}`
          : 'unknown';

    return {
      platform: Platform.OS,
      deviceName: Constants.deviceName ?? 'Unknown Device',
      systemVersion: Constants.systemVersion ?? String(Platform.Version),
      appVersion,
      buildNumber,
      runtimeVersion,
    };
  }, [expoConfig]);

  const handleSendBugReport = async () => {
    const trimmed = bugDescription.trim();
    if (!trimmed) {
      Alert.alert('입력 필요', '버그 내용을 입력해주세요.');
      return;
    }

    const now = new Date();
    const subject = `[버그 신고] ${formatDate(now)}`;
    const body = `플랫폼: ${deviceInfo.platform}
디바이스: ${deviceInfo.deviceName}
OS 버전: ${deviceInfo.systemVersion}
앱 버전: ${deviceInfo.appVersion}
빌드 번호: ${deviceInfo.buildNumber}
런타임 버전: ${deviceInfo.runtimeVersion}
작성 일시: ${now.toLocaleString('ko-KR')}

버그 내용:
${trimmed}`;

    const url = `mailto:${BUG_REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      setSendingBug(true);
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          '메일 앱 확인',
          '메일 앱을 열 수 없습니다. 메일 계정을 설정했는지 확인해주세요.'
        );
        return;
      }
      await Linking.openURL(url);
    } catch (err) {
      console.error('❌ 버그 리포트 전송 실패:', err);
      Alert.alert('전송 실패', '메일 앱을 여는 데 실패했습니다.');
    } finally {
      setSendingBug(false);
    }
  };

  const handleAddRequestItem = () => {
    setRequestItems((prev) => [...prev, '']);
  };

  const handleChangeRequestItem = (index: number, value: string) => {
    setRequestItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRemoveRequestItem = (index: number) => {
    setRequestItems((prev) => {
      if (prev.length === 1) {
        return [''];
      }
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const handleFillRequestsFromMemo = () => {
    const memoContent = latestEntry?.content?.trim();
    if (!memoContent) {
      Alert.alert('메모 없음', '최근 저장된 메모가 없습니다.');
      return;
    }

    setRequestItems((prev) => {
      const firstEmpty = prev.findIndex((item) => !item.trim());
      if (firstEmpty >= 0) {
        const next = [...prev];
        next[firstEmpty] = memoContent;
        return next;
      }
      return [...prev, memoContent];
    });
  };

  const findFirstEmptyRequest = (items: string[]) =>
    items.findIndex((item) => !item.trim());

  const openMemoPicker = (index?: number) => {
    const targetIndex =
      typeof index === 'number' && index >= 0
        ? index
        : (() => {
            const firstEmpty = findFirstEmptyRequest(requestItems);
            if (firstEmpty >= 0) {
              return firstEmpty;
            }
            return requestItems.length;
          })();
    setMemoTargetIndex(targetIndex);
    setMemoPickerVisible(true);
  };

  const closeMemoPicker = () => {
    setMemoPickerVisible(false);
    setMemoTargetIndex(null);
  };

  const applyMemoToRequest = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      closeMemoPicker();
      return;
    }

    setRequestItems((prev) => {
      const next = [...prev];
      let target = memoTargetIndex ?? findFirstEmptyRequest(prev);
      if (target == null || target < 0) {
        target = prev.length > 0 ? prev.length - 1 : 0;
      }
      if (target >= next.length) {
        next.push(trimmed);
      } else {
        next[target] = trimmed;
      }
      return next;
    });
    closeMemoPicker();
  };

  const handleSendRequestMail = async () => {
    const trimmedItems = requestItems
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (trimmedItems.length === 0) {
      Alert.alert('입력 필요', '보낼 요청사항을 하나 이상 입력해주세요.');
      return;
    }

    const now = new Date();
    const subject = `[요청사항] ${formatDate(now)}`;
    const requestBody = trimmedItems
      .map((item, index) => `${index + 1}. ${item}`)
      .join('\n');

    const memoSection = latestEntry?.content?.trim()
      ? `\n\n참고 메모 (${new Date(latestEntry.created_at).toLocaleString('ko-KR')})\n${latestEntry.content.trim()}`
      : '';

    const body = `보낸 일시: ${now.toLocaleString('ko-KR')}\n\n요청 내용:\n${requestBody}${memoSection}`;
    const url = `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      setSendingRequest(true);
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          '메일 앱 확인',
          '메일 앱을 열 수 없습니다. 메일 계정을 설정했는지 확인해주세요.'
        );
        return;
      }
      await Linking.openURL(url);
    } catch (err) {
      console.error('❌ 요청 메일 전송 실패:', err);
      Alert.alert('전송 실패', '메일 앱을 여는 데 실패했습니다.');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.workoutBg }]}>
      <CustomHeader title="문의하기" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <TextBox variant="title3" color={theme.text}>
            버그 리포트
          </TextBox>

          <View
            style={[
              styles.infoBox,
              { borderColor: theme.border, backgroundColor: theme.background },
            ]}
          >
            <MaterialIcons
              name="bug-report"
              size={20}
              color={theme.accentOrange}
              style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
              <TextBox variant="body3" color={theme.text}>
                앱 정보
              </TextBox>
              <TextBox variant="caption2" color={theme.textSecondary}>
                플랫폼: {deviceInfo.platform} / 디바이스:{' '}
                {deviceInfo.deviceName}
              </TextBox>
              <TextBox variant="caption2" color={theme.textSecondary}>
                OS: {deviceInfo.systemVersion} / 앱 버전:{' '}
                {deviceInfo.appVersion}
              </TextBox>
              <TextBox variant="caption2" color={theme.textSecondary}>
                빌드: {deviceInfo.buildNumber} / 런타임:{' '}
                {deviceInfo.runtimeVersion}
              </TextBox>
            </View>
          </View>

          <View>
            <TextBox variant="body3" color={theme.text} style={styles.label}>
              버그 내용
            </TextBox>
            <View
              style={[
                styles.textAreaWrapper,
                { borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            >
              <TextInput
                value={bugDescription}
                onChangeText={setBugDescription}
                placeholder="발생한 문제와 상황을 자세히 적어주세요"
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
                style={[styles.textArea, { color: theme.text }]}
              />
            </View>
          </View>

          <CustomButton
            title="버그 리포트 메일 보내기"
            onPress={handleSendBugReport}
            loading={sendingBug}
            disabled={sendingBug}
            fullWidth
            variant="secondary"
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <TextBox variant="title3" color={theme.text}>
            요청사항 보내기
          </TextBox>

          <View style={styles.inlineRow}>
            <CustomButton
              title="요청 추가"
              onPress={handleAddRequestItem}
              variant="outline"
              size="small"
            />
            <CustomButton
              title="최근 메모 불러오기"
              onPress={handleFillRequestsFromMemo}
              size="small"
              variant="ghost"
            />
            <CustomButton
              title="메모 선택"
              onPress={() => openMemoPicker()}
              size="small"
              variant="ghost"
            />
          </View>

          <View style={styles.requestList}>
            {requestItems.map((item, index) => (
              <View key={`request-${index}`} style={styles.requestItemWrapper}>
                <TextBox
                  variant="body3"
                  color={theme.text}
                  style={styles.label}
                >
                  요청 {index + 1}
                </TextBox>
                <View
                  style={[
                    styles.textAreaWrapper,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                    },
                  ]}
                >
                  <TextInput
                    value={item}
                    onChangeText={(value) =>
                      handleChangeRequestItem(index, value)
                    }
                    placeholder="보내고 싶은 요청을 입력하세요"
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    textAlignVertical="top"
                    style={[styles.textArea, { color: theme.text }]}
                  />
                  {requestItems.length > 1 && (
                    <Pressable
                      onPress={() => handleRemoveRequestItem(index)}
                      style={styles.removeButton}
                      accessibilityRole="button"
                      accessibilityLabel={`요청 ${index + 1} 삭제`}
                    >
                      <MaterialIcons
                        name="close"
                        size={18}
                        color={theme.textSecondary}
                      />
                    </Pressable>
                  )}
                </View>
                <View style={styles.requestActions}>
                  <CustomButton
                    title="메모 선택"
                    size="small"
                    variant="outline"
                    onPress={() => openMemoPicker(index)}
                  />
                </View>
              </View>
            ))}
          </View>

          <CustomButton
            title="요청사항 메일 보내기"
            onPress={handleSendRequestMail}
            loading={sendingRequest}
            disabled={sendingRequest}
            fullWidth
            variant="primary"
          />
        </View>
      </ScrollView>

      <Modal
        visible={memoPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={closeMemoPicker}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            <View style={styles.modalHeader}>
              <TextBox variant="title3" color={theme.text}>
                메모 선택
              </TextBox>
              <Pressable
                onPress={closeMemoPicker}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons
                  name="close"
                  size={22}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>

            {memoLoading ? (
              <View style={styles.modalLoader}>
                <ActivityIndicator size="small" color={theme.primary} />
                <TextBox variant="body3" color={theme.textSecondary}>
                  메모를 불러오는 중...
                </TextBox>
              </View>
            ) : memoEntries.length === 0 ? (
              <View style={styles.modalEmpty}>
                <MaterialIcons
                  name="note-alt"
                  size={32}
                  color={theme.textSecondary}
                />
                <TextBox
                  variant="body3"
                  color={theme.textSecondary}
                  style={styles.centerText}
                >
                  저장된 메모가 없습니다.
                </TextBox>
                <CustomButton
                  title="새로고침"
                  variant="outline"
                  onPress={refreshMemo}
                />
              </View>
            ) : (
              <ScrollView
                style={styles.memoList}
                contentContainerStyle={styles.memoListContent}
              >
                {memoEntries.map((entry) => (
                  <Pressable
                    key={entry.id}
                    onPress={() => applyMemoToRequest(entry.content)}
                    style={[
                      styles.memoItem,
                      {
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                  >
                    <TextBox
                      variant="caption2"
                      color={theme.textSecondary}
                      style={styles.memoItemDate}
                    >
                      {new Date(entry.created_at).toLocaleString('ko-KR')}
                    </TextBox>
                    <TextBox variant="body2" color={theme.text}>
                      {entry.content}
                    </TextBox>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            <CustomButton
              title="닫기"
              variant="outline"
              onPress={closeMemoPicker}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  infoBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  label: {
    marginBottom: 8,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  requestList: {
    gap: 20,
  },
  requestItemWrapper: {
    gap: 8,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  textArea: {
    minHeight: 120,
    fontSize: 15,
    lineHeight: 22,
    width: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLoader: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  modalEmpty: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  memoList: {
    maxHeight: 320,
  },
  memoListContent: {
    gap: 12,
  },
  memoItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  memoItemDate: {
    textAlign: 'right',
  },
  centerText: {
    textAlign: 'center',
  },
});

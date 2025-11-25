import { useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';
import { CustomButton } from '@/components/common/button';

interface ListItem {
  id: string;
  title: string;
  description?: string;
}

export default function FlatListScreen() {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeExample, setActiveExample] = useState<string | null>(null);
  const [data, setData] = useState<ListItem[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      title: `아이템 ${i + 1}`,
      description: `설명 ${i + 1}`,
    }))
  );
  const [horizontalData] = useState<ListItem[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: `h-item-${i}`,
      title: `카드 ${i + 1}`,
    }))
  );
  const [gridData] = useState<ListItem[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: `grid-${i}`,
      title: `그리드 ${i + 1}`,
    }))
  );
  const [viewableItems, setViewableItems] = useState<string[]>([]);
  const [endReachedCount, setEndReachedCount] = useState(0);

  const examples = [
    { id: 'basic', title: '기본' },
    { id: 'horizontal', title: '가로 스크롤' },
    { id: 'numColumns', title: '다중 컬럼' },
    { id: 'headerFooter', title: '헤더/푸터' },
    { id: 'empty', title: '빈 리스트' },
    { id: 'separator', title: '구분선' },
    { id: 'refresh', title: 'Pull-to-refresh' },
    { id: 'endReached', title: '무한스크롤' },
    { id: 'scrollToIndex', title: 'scrollToIndex' },
    { id: 'viewableItems', title: '가시성 감지' },
    { id: 'getItemLayout', title: 'getItemLayout' },
    { id: 'extraData', title: 'extraData' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { paddingBottom: bottom + 20 }]}>
        {/* 예제 선택 버튼 (가로 스크롤) */}
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <TextBox
            variant="title4"
            color={theme.text}
            style={styles.sectionTitle}
          >
            예제 선택
          </TextBox>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonScrollContainer}
          >
            {examples.map((example) => (
              <CustomButton
                key={example.id}
                title={example.title}
                onPress={() =>
                  setActiveExample(
                    activeExample === example.id ? null : example.id
                  )
                }
                variant={activeExample === example.id ? 'primary' : 'outline'}
                size="small"
                style={styles.exampleButton}
              />
            ))}
          </ScrollView>
        </View>

        {/* 기본 FlatList 예제 */}
        {activeExample === 'basic' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              1. 기본 FlatList
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              data, renderItem, keyExtractor 필수
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data.slice(0, 10)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      { backgroundColor: theme.primary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
              />
            </View>
          </View>
        )}

        {/* horizontal FlatList 예제 */}
        {activeExample === 'horizontal' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              2. Horizontal FlatList (가로 스크롤)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              horizontal={true}로 가로 스크롤 활성화
            </TextBox>
            <FlatList
              data={horizontalData}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.horizontalItem,
                    { backgroundColor: theme.secondary + '40' },
                  ]}
                >
                  <TextBox variant="body2" color={theme.text}>
                    {item.title}
                  </TextBox>
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalContent}
            />
          </View>
        )}

        {/* numColumns 예제 */}
        {activeExample === 'numColumns' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              3. numColumns (다중 컬럼)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              numColumns로 그리드 레이아웃 생성
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={gridData}
                numColumns={2}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.gridItem,
                      { backgroundColor: theme.primary + '30' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                columnWrapperStyle={styles.columnWrapper}
              />
            </View>
          </View>
        )}

        {/* ListHeaderComponent / ListFooterComponent 예제 */}
        {activeExample === 'headerFooter' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              4. ListHeaderComponent / ListFooterComponent
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              리스트 상단/하단에 컴포넌트 추가
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data.slice(0, 5)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      { backgroundColor: theme.primary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                ListHeaderComponent={
                  <View
                    style={[
                      styles.headerFooter,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <TextBox variant="body2" color="#FFFFFF">
                      헤더 컴포넌트
                    </TextBox>
                  </View>
                }
                ListFooterComponent={
                  <View
                    style={[
                      styles.headerFooter,
                      { backgroundColor: theme.secondary },
                    ]}
                  >
                    <TextBox variant="body2" color="#FFFFFF">
                      푸터 컴포넌트
                    </TextBox>
                  </View>
                }
              />
            </View>
          </View>
        )}

        {/* ListEmptyComponent 예제 */}
        {activeExample === 'empty' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              5. ListEmptyComponent
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              리스트가 비었을 때 표시할 컴포넌트
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={[]}
                renderItem={() => null}
                keyExtractor={(item: ListItem) => item.id}
                style={styles.flatList}
                ListEmptyComponent={
                  <View
                    style={[
                      styles.emptyComponent,
                      { backgroundColor: theme.border + '40' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.textSecondary}>
                      리스트가 비어있습니다
                    </TextBox>
                  </View>
                }
              />
            </View>
          </View>
        )}

        {/* ItemSeparatorComponent 예제 */}
        {activeExample === 'separator' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              6. ItemSeparatorComponent
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              아이템 사이 구분선 추가
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data.slice(0, 5)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      { backgroundColor: theme.primary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                ItemSeparatorComponent={() => (
                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: theme.border },
                    ]}
                  />
                )}
              />
            </View>
          </View>
        )}

        {/* onRefresh / refreshing 예제 */}
        {activeExample === 'refresh' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              7. onRefresh (Pull-to-refresh)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              아래로 당겨서 새로고침
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data.slice(0, 8)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      { backgroundColor: theme.secondary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  setTimeout(() => {
                    setRefreshing(false);
                  }, 2000);
                }}
              />
            </View>
          </View>
        )}

        {/* onEndReached (인피니트 스크롤) 예제 */}
        {activeExample === 'endReached' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              8. onEndReached (인피니트 스크롤)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              스크롤 끝 도달 시 호출 (무한 스크롤)
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      { backgroundColor: theme.primary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                onEndReached={() => {
                  setEndReachedCount((prev) => prev + 1);
                }}
                onEndReachedThreshold={0.5}
              />
            </View>
            <TextBox
              variant="body4"
              color={theme.primary}
              style={styles.statusText}
            >
              끝 도달 횟수: {endReachedCount}
            </TextBox>
          </View>
        )}

        {/* scrollToIndex / scrollToEnd 메서드 예제 */}
        {activeExample === 'scrollToIndex' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              9. scrollToIndex / scrollToEnd 메서드
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              ref를 사용하여 프로그래밍 방식으로 스크롤 제어
            </TextBox>
            <View style={styles.buttonRow}>
              <CustomButton
                title="맨 위로"
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                  });
                }}
                variant="outline"
                size="small"
              />
              <CustomButton
                title="5번째로"
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index: 4,
                    animated: true,
                  });
                }}
                variant="outline"
                size="small"
              />
              <CustomButton
                title="맨 아래로"
                onPress={() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }}
                variant="outline"
                size="small"
              />
            </View>
            <View style={styles.listContainer}>
              <FlatList
                ref={flatListRef}
                data={data.slice(0, 10)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      { backgroundColor: theme.secondary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                getItemLayout={(_, index) => ({
                  length: 60,
                  offset: 60 * index,
                  index,
                })}
              />
            </View>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.infoText}
            >
              getItemLayout을 사용하면 scrollToIndex가 더 정확하게 동작합니다
            </TextBox>
          </View>
        )}

        {/* onViewableItemsChanged 예제 */}
        {activeExample === 'viewableItems' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              10. onViewableItemsChanged (아이템 가시성)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              보이는 아이템 변화 감지
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data.slice(0, 10)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: viewableItems.includes(item.id)
                          ? theme.primary + '40'
                          : theme.primary + '20',
                      },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                onViewableItemsChanged={({ viewableItems: items }) => {
                  setViewableItems(items.map((item) => item.item.id));
                }}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 50,
                }}
              />
            </View>
            <TextBox
              variant="body4"
              color={theme.primary}
              style={styles.statusText}
            >
              보이는 아이템: {viewableItems.join(', ') || '없음'}
            </TextBox>
          </View>
        )}

        {/* getItemLayout (성능 최적화) 예제 */}
        {activeExample === 'getItemLayout' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              11. getItemLayout (성능 최적화)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              고정 크기 아이템의 경우 성능 최적화 가능
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data.slice(0, 15)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.fixedItem,
                      { backgroundColor: theme.secondary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title} (고정 높이: 80px)
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                getItemLayout={(_, index) => ({
                  length: 80,
                  offset: 80 * index,
                  index,
                })}
              />
            </View>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.infoText}
            >
              getItemLayout으로 고정 크기 아이템의 offset을 미리 계산
            </TextBox>
          </View>
        )}

        {/* extraData 예제 */}
        {activeExample === 'extraData' && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <TextBox
              variant="title4"
              color={theme.text}
              style={styles.sectionTitle}
            >
              12. extraData (외부 상태 감지)
            </TextBox>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.description}
            >
              PureComponent인 FlatList가 외부 상태 변화를 감지하게 함
            </TextBox>
            <View style={styles.listContainer}>
              <FlatList
                data={data.slice(0, 5)}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.listItem,
                      { backgroundColor: theme.primary + '20' },
                    ]}
                  >
                    <TextBox variant="body2" color={theme.text}>
                      {item.title}
                    </TextBox>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.flatList}
                extraData={refreshing}
              />
            </View>
            <TextBox
              variant="body4"
              color={theme.textSecondary}
              style={styles.infoText}
            >
              extraData가 변경되면 FlatList가 리렌더링됩니다
            </TextBox>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  heading: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    flex: 1,
  },
  buttonScrollContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  exampleButton: {
    marginRight: 8,
  },
  description: {
    marginBottom: 12,
    marginTop: 4,
  },
  listContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  flatList: {
    flex: 1,
  },
  listItem: {
    padding: 16,
    borderRadius: 8,
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 8,
  },
  horizontalItem: {
    width: 150,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  horizontalContent: {
    paddingHorizontal: 16,
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerFooter: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  emptyComponent: {
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  separator: {
    height: 1,
    marginVertical: 4,
  },
  statusText: {
    marginTop: 8,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  fixedItem: {
    padding: 16,
    borderRadius: 8,
    height: 80,
    justifyContent: 'center',
    marginBottom: 8,
  },
  tipsContainer: {
    gap: 8,
  },
  tipItem: {
    marginBottom: 4,
    lineHeight: 20,
  },
});

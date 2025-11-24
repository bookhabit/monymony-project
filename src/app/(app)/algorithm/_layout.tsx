import { Stack } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import CustomHeader from '@/components/layout/CustomHeader';

/**
 * Algorithm Sub-route Layout
 * 알고리즘 하위 주제들 (스택, 큐, 트리 등)
 */
export default function AlgorithmLayout() {
  const { theme } = useTheme();

  // 스크린별 제목 매핑
  const screenTitles: Record<string, string> = {
    index: '알고리즘',
    'time-space': '시간 · 공간 복잡도',
    numbers: '숫자',
    strings: '문자열',
    arrays: '배열',
    objects: '객체',
    'memory-management': '메모리 관리',
    recursion: '재귀',
    sets: '집합',
    search: '검색',
    sorting: '정렬',
    hash: '해시',
    stack: '스택',
    queue: '큐',
    'linked-list': '연결 리스트',
    caching: '캐싱',
    tree: '트리',
    heap: '힙',
    graph: '그래프',
    'advanced-strings': '고급 문자열',
    'dynamic-programming': '동적 프로그래밍',
    'bit-manipulation': '비트 조작',
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        animation: 'slide_from_right',
        presentation: 'card',
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      {Object.entries(screenTitles).map(([name, title]) => (
        <Stack.Screen
          key={name}
          name={name}
          options={{
            header: () => <CustomHeader title={title} showBackButton />,
          }}
        />
      ))}
    </Stack>
  );
}

import { useColorScheme } from 'react-native';

import { ThemeProvider, useTheme } from '@/context/ThemeProvider';
import { renderHook, act, render, screen } from '@testing-library/react-native';

import TextBox from '@/components/common/TextBox';

import { lightTheme, darkTheme } from '@/constants/colors';

// 디버깅용 헬퍼 함수
const debugElement = (element: any, label: string) => {
  console.log(`\n=== ${label} ===`);
  console.log('props:', element?.props);
  console.log('==================\n');
};

/**
 * useTheme,ThemeProvider 훅 테스트
 *
 * Given-When-Then 패턴을 사용한 한글 테스트 케이스
 */
describe('useTheme 기본 기능', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('테마 객체와 다크모드 상태를 반환해야 한다', () => {
    // Given: ThemeProvider로 감싸진 컴포넌트
    // When: useTheme 훅 사용
    const { result } = renderHook(() => useTheme(), { wrapper });

    // Then: theme 객체와 isDarkMode boolean이 반환되어야 함
    expect(result.current.theme).toBeDefined();
    expect(typeof result.current.isDarkMode).toBe('boolean');
  });

  it('toggleTheme을 호출하면 다크모드가 토글되어야 한다', () => {
    // Given: 초기 다크모드 상태
    const { result } = renderHook(() => useTheme(), { wrapper });
    const initialMode = result.current.isDarkMode;

    // When: toggleTheme 호출
    act(() => {
      result.current.toggleTheme();
    });

    // Then: 다크모드 상태가 반대로 변경되어야 함
    expect(result.current.isDarkMode).toBe(!initialMode);
  });
});

describe('다크모드 테마 테스트', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('useColorScheme()으로 시스템 테마 색상이 초깃값인 지 확인', () => {
    // Given: useColorScheme()으로 시스템 테마 색상 가져오기
    // 테스트 환경에서는 기본적으로 'light'를 반환
    const { result } = renderHook(() => useTheme(), { wrapper });

    // When: useColorScheme()으로 시스템 테마 색상 가져오기
    const colorScheme = useColorScheme();
    console.log('테스트 컴포넌트 colorScheme', colorScheme);

    // Then: 시스템 테마 색상이 초깃값인 지 확인
    expect(result.current.isDarkMode).toBe(colorScheme === 'dark');
  });
});

describe('실제 컴포넌트에서 테마 색상 테스트', () => {
  const TestComponent = () => {
    const { theme } = useTheme();
    return <TextBox color={theme.primary}>테마 색상 텍스트</TextBox>;
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('다크모드일 때 TextBox에 darkTheme.primary 색상이 적용되어야 한다', async () => {
    // Given: 다크모드 상태로 설정
    const { result } = renderHook(() => useTheme(), { wrapper });
    // console.log('테스트 컴포넌트 result', result.current);

    // When: 다크모드로 토글
    await act(() => {
      result.current.toggleTheme();
    });
    // console.log('토글 후 테스트 컴포넌트 result', result.current);

    // Then: 다크모드 상태 확인
    expect(result.current.isDarkMode).toBe(true);
    expect(result.current.theme.primary).toBe(darkTheme.primary);
  });

  it('라이트모드일 때 TextBox에 lightTheme.primary 색상이 적용되어야 한다', () => {
    // Given: 라이트모드 상태로 설정
    const { result } = renderHook(() => useTheme(), { wrapper });

    // When: 라이트모드로 토글 (다크모드가 아닌 상태로)
    if (result.current.isDarkMode) {
      console.log('다크모드일 경우에만 라이트 모드로 전환');
      act(() => {
        result.current.toggleTheme();
      });
    }

    // Then: 라이트모드 상태 확인
    expect(result.current.isDarkMode).toBe(false);
    expect(result.current.theme.primary).toBe(lightTheme.primary);

    // When: TextBox 렌더링
    render(<TestComponent />, { wrapper });
    const textElement = screen.getByText('테마 색상 텍스트');
    debugElement(textElement, '라이트모드 textElement');

    // Then: 라이트모드 primary 색상이 적용되어야 함
    expect(textElement.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          color: lightTheme.primary, // '#007AFF'
        }),
      ])
    );
  });
});

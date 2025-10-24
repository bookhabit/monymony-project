import React from 'react';

import { CustomButton } from '@/components/common/button/CustomButton';

import { fireEvent, render, screen } from '../../../utils/test-utils';

/**
 * CustomButton 컴포넌트 테스트
 *
 * Given-When-Then 패턴을 사용한 한글 테스트 케이스
 */
describe('CustomButton 렌더링', () => {
  it('제목이 올바르게 표시되어야 한다', () => {
    // Given: "테스트 버튼" 제목을 가진 버튼
    const title = '테스트 버튼';

    // When: 렌더링
    render(<CustomButton title={title} onPress={jest.fn()} />);

    // Then: "테스트 버튼" 텍스트가 보여야 함
    expect(screen.getByText(title)).toBeTruthy();
  });

  it('로딩 상태일 때 ActivityIndicator가 표시되어야 한다', () => {
    // Given: loading=true인 버튼
    const title = '로딩 버튼';

    // When: 렌더링
    const { getByTestId } = render(
      <CustomButton title={title} loading testID="loading-button" />
    );

    // Then: ActivityIndicator가 보여야 함
    expect(getByTestId('loading-button')).toBeTruthy();
  });

  it('비활성화 상태일 때 버튼이 비활성화되어야 한다', () => {
    // Given: disabled=true인 버튼
    // When: 렌더링
    // Then: 버튼이 비활성화 상태여야 함
  });
});

describe('CustomButton 상호작용', () => {
  it('버튼을 누르면 onPress가 호출되어야 한다', () => {
    // Given: onPress 핸들러가 있는 버튼
    const onPressMock = jest.fn();
    const title = '클릭 버튼';

    // When: 버튼을 누름
    render(<CustomButton title={title} onPress={onPressMock} />);
    const button = screen.getByText(title);
    fireEvent.press(button);

    // Then: onPress가 1번 호출되어야 함
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('비활성화된 버튼을 눌러도 onPress가 호출되지 않아야 한다', () => {
    // Given: disabled=true인 버튼
    const onPressMock = jest.fn();
    const title = '비활성화 버튼';

    // When: 버튼을 누름
    render(<CustomButton title={title} onPress={onPressMock} disabled />);
    const button = screen.getByText(title);
    fireEvent.press(button);

    // Then: onPress가 호출되지 않아야 함
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('로딩 중인 버튼을 눌러도 onPress가 호출되지 않아야 한다', () => {
    // Given: loading=true인 버튼
    const onPressMock = jest.fn();
    const title = '로딩 버튼';

    // When: 버튼을 누름
    const { getByTestId } = render(
      <CustomButton
        title={title}
        onPress={onPressMock}
        loading
        testID="loading-btn"
      />
    );
    const button = getByTestId('loading-btn');
    fireEvent.press(button);

    // Then: onPress가 호출되지 않아야 함
    expect(onPressMock).not.toHaveBeenCalled();
  });
});

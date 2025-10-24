import React from 'react';

import TextBox from '@/components/common/TextBox';

import { FONTS } from '@/constants/fonts';

import { render, screen } from '../../utils/test-utils';

/**
 * TextBox 컴포넌트 테스트
 *
 * Given-When-Then 패턴을 사용한 한글 테스트 케이스
 */
describe('TextBox 기본 기능 테스트', () => {
  it('텍스트가 올바르게 표시되어야 한다', () => {
    // Given: "안녕하세요" 텍스트를 가진 TextBox
    const text = '안녕하세요';

    // When: 렌더링
    render(<TextBox>{text}</TextBox>);

    // Then: "안녕하세요" 텍스트가 보여야 함
    expect(screen.getByText(text)).toBeTruthy();
  });

  it('TextBox의 color prop이 적용되어야 한다', () => {
    // Given: color="#FF0000"인 TextBox
    const text = '빨간색 텍스트';
    const testColor = '#FF0000';

    // When: 렌더링
    const { getByText } = render(<TextBox color={testColor}>{text}</TextBox>);
    const textElement = getByText(text);
    // console.log('textElement', textElement.props);

    // Then: testColor 텍스트가 보여야 함
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toMatchObject(
      expect.arrayContaining([expect.objectContaining({ color: testColor })])
    );
  });
});

describe('TextBox variant 스타일 테스트', () => {
  it('title1 variant일 때 BMJUA 폰트와 26px 크기가 적용되어야 한다', () => {
    // Given: variant="title1"인 TextBox
    const text = '제목 텍스트';

    // When: 렌더링
    const { getByText } = render(<TextBox variant="title1">{text}</TextBox>);
    const textElement = getByText(text);
    // console.log('textElement', textElement.props);

    // Then: BMJUA 폰트와 26px 크기가 적용되어야 함
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 26,
          fontFamily: FONTS.BMJUA,
        }),
      ])
    );
  });
  it('body1 variant일 때 Pretendard Bold 폰트와 17px 크기가 적용되어야 한다', () => {
    // Given: variant="body1"인 TextBox
    const text = '본문 텍스트';

    // When: 렌더링
    const { getByText } = render(<TextBox variant="body1">{text}</TextBox>);
    const textElement = getByText(text);

    // Then: Pretendard Bold 폰트와 17px 크기가 적용되어야 함
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 17,
          fontFamily: 'Pretendard-Bold',
        }),
      ])
    );
  });

  it('caption1 variant일 때 Roboto Bold 폰트와 13px 크기가 적용되어야 한다', () => {
    // Given: variant="caption1"인 TextBox
    const text = '캡션 텍스트';

    // When: 렌더링
    const { getByText } = render(<TextBox variant="caption1">{text}</TextBox>);
    const textElement = getByText(text);

    // Then: Roboto Bold 폰트와 13px 크기가 적용되어야 함
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 13,
          fontFamily: 'Roboto-Bold',
        }),
      ])
    );
  });

  it('button1 variant일 때 Pretendard Bold 폰트와 18px 크기가 적용되어야 한다', () => {
    // Given: variant="button1"인 TextBox
    const text = '버튼 텍스트';

    // When: 렌더링
    const { getByText } = render(<TextBox variant="button1">{text}</TextBox>);
    const textElement = getByText(text);

    // Then: Pretendard Bold 폰트와 18px 크기가 적용되어야 함
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 18,
          fontFamily: 'Pretendard-Bold',
        }),
      ])
    );
  });
});

import React from 'react';

import { renderRouter } from 'expo-router/testing-library';

import NestedProductDetailScreen from '@/app/(app)/react-native-and-expo/products/[category]/[productId]';

import { render, screen } from '../../utils/test-utils';

// expo-router의 useLocalSearchParams를 모킹
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(),
}));

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams;

describe('중첩 동적 라우팅 - Category별 Product 상세 페이지', () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReset();
  });

  it('중첩 상품 상세 페이지가 렌더링되어야 한다', () => {
    // Given: category와 productId 파라미터
    mockUseLocalSearchParams.mockReturnValue({
      category: 'electronics',
      productId: 'iphone-15',
    });

    // When: 렌더링
    render(<NestedProductDetailScreen />);

    // Then: 중첩 상품 상세 페이지 타이틀이 표시되어야 함
    expect(screen.getByText('중첩 상품 상세')).toBeTruthy();
  });

  it('전달된 category와 productId 파라미터가 모두 표시되어야 한다', () => {
    // Given: category와 productId
    mockUseLocalSearchParams.mockReturnValue({
      category: 'electronics',
      productId: 'iphone-15',
    });

    // When: 렌더링
    render(<NestedProductDetailScreen />);

    // Then: 두 파라미터가 모두 표시되어야 함
    expect(screen.getByText('카테고리: electronics')).toBeTruthy();
    expect(screen.getByText('상품 ID: iphone-15')).toBeTruthy();
  });

  it('중첩 동적 라우팅 Path 정보가 표시되어야 한다', () => {
    // Given: category와 productId 파라미터
    mockUseLocalSearchParams.mockReturnValue({
      category: 'clothing',
      productId: 'shirt-001',
    });

    // When: 렌더링
    render(<NestedProductDetailScreen />);

    // Then: Path 정보가 표시되어야 함
    expect(
      screen.getByText('Path: /products/[category]/[productId]')
    ).toBeTruthy();
  });

  it('다른 카테고리와 상품으로도 렌더링이 되어야 한다', () => {
    // Given: 다른 카테고리와 상품
    mockUseLocalSearchParams.mockReturnValue({
      category: 'books',
      productId: 'harry-potter-1',
    });

    // When: 렌더링
    render(<NestedProductDetailScreen />);

    // Then: 새로운 파라미터가 표시되어야 함
    expect(screen.getByText('카테고리: books')).toBeTruthy();
    expect(screen.getByText('상품 ID: harry-potter-1')).toBeTruthy();
  });
});

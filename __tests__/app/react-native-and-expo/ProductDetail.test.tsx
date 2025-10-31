import React from 'react';

import ProductDetailScreen from '@/app/(app)/react-native-and-expo/product/[productId]';

import { render, screen } from '../../utils/test-utils';

// expo-router의 useLocalSearchParams를 모킹
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(),
}));

const mockUseLocalSearchParams = require('expo-router').useLocalSearchParams;

describe('동적 라우팅 - Product 상세 페이지', () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReset();
  });

  it('상품 상세 페이지가 렌더링되어야 한다', () => {
    // Given: productId 파라미터
    mockUseLocalSearchParams.mockReturnValue({ productId: '123' });

    // When: 렌더링
    render(<ProductDetailScreen />);

    // Then: 상품 상세 페이지 타이틀이 표시되어야 함
    expect(screen.getByText('상품 상세')).toBeTruthy();
  });

  it('전달된 productId 파라미터가 표시되어야 한다', () => {
    // Given: productId=456
    mockUseLocalSearchParams.mockReturnValue({ productId: '456' });

    // When: 렌더링
    render(<ProductDetailScreen />);

    // Then: "456" 파라미터가 표시되어야 함
    expect(screen.getByText('받은 파라미터: 456')).toBeTruthy();
    expect(screen.getByText('상품 ID: 456')).toBeTruthy();
  });

  it('동적 라우팅 Path 정보가 표시되어야 한다', () => {
    // Given: productId 파라미터
    mockUseLocalSearchParams.mockReturnValue({ productId: '789' });

    // When: 렌더링
    render(<ProductDetailScreen />);

    // Then: Path 정보가 표시되어야 함
    expect(screen.getByText('Path: /product/[productId]')).toBeTruthy();
  });
});

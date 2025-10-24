import React, { ReactElement } from 'react';

import { ThemeProvider } from '@/context/ThemeProvider';
import { render, RenderOptions } from '@testing-library/react-native';

/**
 * Custom render function with providers
 *
 * 모든 테스트에서 필요한 Provider들을 자동으로 감싸줍니다.
 */
interface AllProvidersProps {
  children: React.ReactNode;
}

const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };

/**
 * Test utilities
 */

/**
 * 비동기 작업 대기 (애니메이션, setTimeout 등)
 */
export const wait = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Router
 */
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
};

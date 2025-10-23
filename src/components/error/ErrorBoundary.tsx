import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary
 *
 * - 에러 감지: 컴포넌트 렌더링 중 에러 발생 시 자동으로 적용
 * - Fallback UI: 에러 발생 시 대체 UI 제공
 * - 에러 복구: 다시 시도 기능
 */

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 에러가 발생하면 상태 업데이트
    console.log('🎨 ErrorBoundary: 에러 감지됨', error.message);
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    console.error('🎨 ErrorBoundary caught an error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  resetError = () => {
    console.log('🎨 ErrorBoundary: 에러 리셋');
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      console.log('🎨 ErrorBoundary: Fallback UI 렌더링');
      return this.props.fallback(this.state.error, this.resetError);
    }

    return this.props.children;
  }
}

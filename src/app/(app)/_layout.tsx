import { Redirect, Slot } from 'expo-router';

import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorFallback } from '@/components/error/ErrorFallback';

/**
 * App Layout (Protected Route)
 *
 * - ErrorBoundary: 전체 앱을 보호
 * - 인증 체크: isAuthenticated가 false면 로그인 페이지로 리다이렉트
 * - 보호된 라우트 가드: 딥링크로 진입, 인증상태 변경
 */
export default function AppLayout() {
  // TODO: 실제 인증 상태 관리 시스템 연결 필요
  // 현재는 하드코딩으로 true (항상 인증된 상태)
  const isAuthenticated = true;

  console.log('AppLayout isAuthenticated:', isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <ErrorFallback error={error} resetError={retry} />
      )}
    >
      <Slot />
    </ErrorBoundary>
  );
}

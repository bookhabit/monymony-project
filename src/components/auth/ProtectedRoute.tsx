import { ReactNode } from 'react';

import { Redirect } from 'expo-router';

interface ProtectedRouteProps {
  guard: boolean;
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Protected Route 컴포넌트
 *
 * - guard가 true일 때만 children 렌더링
 * - guard가 false일 때 redirectTo로 리다이렉트
 */
export function ProtectedRoute({
  guard,
  children,
  redirectTo = '/(auth)/login',
}: ProtectedRouteProps) {
  if (!guard) {
    return <Redirect href={redirectTo as any} />;
  }

  return <>{children}</>;
}

import { Redirect, Slot } from 'expo-router';

/**
 * Auth Layout
 *
 * - 인증 체크: isAuthenticated가 true면 메인 앱으로 리다이렉트
 */
export default function AuthLayout() {
  // TODO: 실제 인증 상태 관리 시스템 연결 필요
  // 현재는 하드코딩으로 true (항상 인증된 상태)
  const isAuthenticated = true;

  console.log('AuthLayout isAuthenticated:', isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/design" />;
  }

  return <Slot />;
}

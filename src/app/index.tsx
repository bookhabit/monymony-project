import { Redirect } from 'expo-router';

/**
 * Index Route
 *
 * - 앱 진입점
 * - (app) 또는 (auth)로 자동 리다이렉트
 * - 최초 진입 라우팅 리다이렉트
 */
export default function Index() {
  // TODO: 실제 인증 상태 관리 시스템 연결 필요
  // 현재는 하드코딩으로 true (항상 인증된 상태)
  const isAuthenticated = true;

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/design" />;
  }

  return <Redirect href="/(auth)/login" />;
}

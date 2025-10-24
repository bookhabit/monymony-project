# 🎯 Monymony

React Native + Expo 기반 모바일 애플리케이션

## 📋 목차

- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [Git 브랜치 전략](#-git-브랜치-전략)
- [Commit Convention](#-commit-convention)

---

## 🛠 기술 스택

### Core

- **React Native** 0.81.5
- **React** 19.1.0
- **Expo** ~54.0.19
- **TypeScript** ~5.9.2

### Navigation & Routing

- **Expo Router** ~6.0.13 (파일 기반 라우팅)
- **React Navigation** 7.x

### UI & Animation

- **React Native Reanimated** ~4.1.1
- **React Native Gesture Handler** ~2.28.0
- **Expo Symbols** (iOS SF Symbols 지원)

### Development Tools

- **ESLint** 9.25.0 (with expo config)
- **Prettier** (코드 포맷팅)

---

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd monymony
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
# 일반 실행
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web

# expo go vs development build
npm start 시 s (switch) 를 통해 expo go 또는 development build로 확인 가능합니다.

development build 또는 release.apk  필요 시
메일 남겨주시면 eas 계정을 공유해드리겠습니다.

```

## 📁 프로젝트 구조

---

## 💻 개발 가이드

### 주요 기능

### 스크립트

| 명령어                  | 설명                    |
| ----------------------- | ----------------------- |
| `npm start`             | Expo 개발 서버 시작     |
| `npm run ios`           | iOS 시뮬레이터 실행     |
| `npm run android`       | Android 에뮬레이터 실행 |
| `npm run web`           | 웹 브라우저 실행        |
| `npm run lint`          | ESLint 검사             |
| `npm run reset-project` | 프로젝트 초기화         |

---

## 📝 테스트 케이스 작성 가이드

### Given-When-Then 패턴

한글 테스트 케이스를 사용하여 가독성과 의사소통을 향상시킵니다.

```typescript
it('제목이 올바르게 표시되어야 한다', () => {
  // Given: 테스트 준비
  const title = '테스트 버튼';

  // When: 실행
  render(<CustomButton title={title} />);

  // Then: 검증
  expect(screen.getByText(title)).toBeTruthy();
});
```

## 🌿 Git 브랜치 전략

### 브랜치 구조

```
main              # 배포용
└── develop        # 개발 통합 브랜치
    ├── feature/...   # 기능 단위 브랜치
    ├── fix/...        # 버그 수정
    ├── chore/...      # 세팅, 설정 변경
    └── test/...       # 테스트 환경 세팅
```

### 브랜치 네이밍 규칙

| 목적      | 형식               | 예시                      |
| --------- | ------------------ | ------------------------- |
| 기능 추가 | `feature/{기능명}` | `feature/psy-test-flow`   |
| 버그 수정 | `fix/{이슈요약}`   | `fix/splash-timing-issue` |
| 설정/환경 | `chore/{내용}`     | `chore/eas-build-setup`   |
| 테스트    | `test/{대상}`      | `test/e2e-detox`          |

### 워크플로우

1. **새 브랜치 생성**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   ```

2. **작업 후 커밋**

   ```bash
   git add .
   git commit -m "feat(auth): add zustand persist store"
   ```

3. **원격 저장소에 푸시**

   ```bash
   git push origin feature/new-feature
   ```

4. **Pull Request 생성**
   - `develop` 브랜치로 PR 생성
   - 코드 리뷰 후 병합

5. **배포 준비**
   ```bash
   # develop → main 병합 (릴리스)
   git checkout main
   git merge develop
   git tag v1.0.0
   git push origin main --tags
   ```

---

## 📝 Commit Convention

### 기본 형태

```
<type>(<scope>): <subject>
```

### Type 목록

| Type         | 설명                  | 예시                                             |
| ------------ | --------------------- | ------------------------------------------------ |
| **feat**     | 새로운 기능 추가      | `feat(auth): add zustand persist store`          |
| **fix**      | 버그 수정             | `fix(ui): splash image not showing on dark mode` |
| **chore**    | 빌드, 설정, 패키지 등 | `chore(eslint): add react-hooks plugin`          |
| **refactor** | 리팩터링              | `refactor(theme): simplify useTheme hook`        |
| **test**     | 테스트 관련 코드      | `test(jest): add unit test for PsyTestList`      |
| **docs**     | 문서 수정             | `docs(readme): update project setup guide`       |
| **style**    | 코드 스타일 변경      | `style(prettier): apply formatting rules`        |
| **perf**     | 성능 개선             | `perf(api): optimize query prefetch`             |

### Scope 가이드

프로젝트 모듈/영역별로 scope 지정:

- `auth` - 인증/로그인 관련
- `ui` - UI 컴포넌트
- `api` - API 통신
- `store` - 상태 관리
- `navigation` - 라우팅/네비게이션
- `theme` - 테마/스타일
- `test` - 테스트 코드

### 커밋 예시

```bash
# 기능 추가
feat(auth): add persist storage with zustand
feat(navigation): add bottom tab navigator

# 환경 설정
chore(env): add .env and expo-constants setup
chore(deps): upgrade expo to 54.0.19

# 버그 수정
fix(ui): darkTheme color not applied on splash
fix(navigation): back button not working on Android

# 리팩터링
refactor(test): move test setup to separate branch
refactor(hooks): optimize useTheme performance

# 테스트
test(e2e): add login flow with detox
test(unit): add test for authentication logic

# 문서
docs(readme): add git workflow guide
docs(api): update API endpoint documentation

# 스타일
style(prettier): apply formatting rules
style(eslint): fix import order
```

### 커밋 메시지 작성 팁

✅ **Good**

```bash
feat(auth): add biometric authentication support
fix(navigation): resolve screen flicker on route change
chore(deps): update react-native to 0.81.5
```

❌ **Bad**

```bash
update code
fix bug
WIP
```

### 다중 작업시 커밋 분리

```bash
# 여러 작업은 별도 커밋으로 분리
git add src/components/Button.tsx
git commit -m "feat(ui): add Button component"

git add src/hooks/useAuth.ts
git commit -m "feat(auth): add useAuth hook"
```

---

## 📱 화면 구성

### 현재 구현된 화면

---

## 🔧 환경 설정

### 필수 요구사항

- **Node.js** 18.x 이상
- **npm** 또는 **yarn**
- **iOS 개발**: Xcode 15+ (macOS)
- **Android 개발**: Android Studio

### Expo Go 앱

개발 중인 앱을 실제 디바이스에서 테스트:

1. [Expo Go](https://expo.dev/client) 앱 설치 (iOS/Android)
2. `npm start` 실행
3. QR 코드 스캔

---

## 📋 버전 관리 스크립트 사용법

🔧 수동 버전 관리

# 버전만 증가 (1.0.0 → 1.0.1)

node version-manager.js --v

# 빌드 번호만 증가 (1 → 2)

node version-manager.js --b

# 런타임 버전만 증가 (1.0.0 → 1.0.1)

node version-manager.js --r

# 모든 버전 증가 (버전, 런타임, 빌드번호)

node version-manager.js --a

🚀 자동 버전업 + 커밋

# 모든 버전 증가 + 자동 커밋

npm run version-up

## 버전업 결과 확인

1. versionInfo.json 변경
2. app.config.js 자동 반영

## 🚀 배포

### EAS Build (Expo Application Services)

#### 📱 다른 PC에서 EAS 설정하기

```bash
# 1. EAS CLI 설치
npm install -g @expo/eas-cli

# 2. EAS 로그인 (팀 계정)
npx eas login
# → hyunjin_l 계정으로 로그인

# 3. 프로젝트 클론
git clone <repository-url>
cd monymony
npm install

# 4. EAS 프로젝트 연결
npx eas init
# → 기존 프로젝트에 연결
```

#### 🔧 빌드 명령어

```bash
# Android 빌드
npx eas build --platform android --profile preview

# iOS 빌드
npx eas build --platform ios --profile preview

# 프로덕션 빌드
npx eas build --platform android --profile production
```

#### ⚠️ 주의사항

- **계정 공유**: `hyunjin_l` 계정 정보 공유 필요
- **권한 관리**: EAS 대시보드에서 팀원 권한 설정
- **GitHub**: Repository 접근 권한 부여

## 🔄 OTA 업데이트 테스트

### 📱 테스트 방법

#### 1️⃣ Release 빌드 생성

```bash
# Android Preview 빌드
npm run build:android:preview

# 또는 Production 빌드
npm run build:android:production
```

#### 2️⃣ 디바이스에 APK 설치

```bash
# 빌드된 APK를 디바이스에 설치
adb install -r android-release.apk
qrcode로 expo 프로젝트에서 설치 가능합니다.
```

#### 3️⃣ 코드 변경 후 업데이트 발행

```bash
# 코드 변경 후
npm run update:preview

# 또는 Production 채널
npm run update:production
```

#### 4️⃣ 앱에서 업데이트 확인

- 앱 실행 후 "업데이트 확인" 버튼 클릭
- 업데이트 모달이 나타나는지 확인
- 업데이트 후 앱이 재시작되는지 확인

### 🔧 OTA 업데이트 특징

#### ✅ 가능한 업데이트

- **JavaScript 코드**: React Native 컴포넌트, 로직
- **이미지/폰트**: assets 폴더의 정적 파일
- **설정 파일**: app.config.js 변경사항

#### ❌ 불가능한 업데이트

- **네이티브 코드**: iOS/Android 네이티브 모듈
- **의존성 변경**: package.json의 네이티브 모듈
- **권한 변경**: Info.plist, AndroidManifest.xml

### 🎯 테스트 시나리오

#### 📱 기본 테스트

1. **Release 빌드 설치**: Preview APK 설치
2. **코드 변경**: UI 텍스트나 색상 변경
3. **업데이트 발행**: `npm run update:preview`
4. **앱에서 확인**: 업데이트 모달 및 적용 확인

#### 🔄 고급 테스트

1. **자동 업데이트**: 앱 시작 시 자동 확인
2. **수동 업데이트**: 사용자가 직접 확인
3. **롤백 테스트**: 문제 발생 시 이전 버전 복구

### ⚠️ 주의사항

- **Release 빌드만**: Development 빌드에서는 OTA 비활성화
- **네트워크 필요**: 인터넷 연결 필수
- **버전 호환성**: runtimeVersion 일치 필요

### 🔄 업데이트 정책

#### **OTA 업데이트 (expo-updates)**

- **자동 확인**: 앱 시작 시 자동으로 확인
- **자동 다운로드**: 업데이트 발견 시 자동 다운로드
- **자동 재시작**: 다운로드 완료 후 자동 재시작
- **모달 표시**: 업데이트 진행 중 로딩 모달 표시

#### **스토어 업데이트 (react-native-version-check)**

- **앱스토어 배포 후**: 앱스토어에 앱이 배포되어야 작동
- **현재 상태**: 개발 단계이므로 비활성화
- **활성화 시점**: 앱스토어 배포 후 주석 해제

#### **개발 환경**

- **개발 모드**: 모든 업데이트 확인 비활성화
- **Release 빌드**: OTA 업데이트만 활성화
- **프로덕션**: OTA + 스토어 업데이트 모두 활성화

---

## 📞 문의 및 기여

- **Issues**: 버그 리포트 및 기능 제안
- **Pull Requests**: 코드 기여 환영

---

## 📄 라이선스

Private Project

/**
 * version-manager.js 테스트
 *
 * 각 명령어별로 versionInfo.json과 네이티브 파일들이 올바르게 업데이트되는지 테스트
 */
import * as fs from 'fs';
import * as path from 'path';

import {
  VersionUpdater,
  FileHelper,
  updateAndroidBuildGradle,
  updateIOSProjectPbxproj,
  updateIOSInfoPlist,
  OptionChecker,
} from '../version-manager';

describe('Version Manager', () => {
  const testDir = path.join(__dirname, '../');
  const versionInfoPath = path.join(testDir, 'versionInfo.json');
  const androidBuildGradlePath = path.join(testDir, 'android/app/build.gradle');
  const iosInfoPlistPath = path.join(testDir, 'ios/monymony/Info.plist');
  const iosProjectPbxprojPath = path.join(
    testDir,
    'ios/monymony.xcodeproj/project.pbxproj'
  );

  // 백업 파일 경로
  const backupVersionInfoPath = path.join(__dirname, 'backup-versionInfo.json');
  const backupAndroidBuildGradlePath = path.join(
    __dirname,
    'backup-build.gradle'
  );
  const backupIosInfoPlistPath = path.join(__dirname, 'backup-Info.plist');
  const backupIosProjectPbxprojPath = path.join(
    __dirname,
    'backup-project.pbxproj'
  );

  let originalVersionInfo: any;
  let originalAndroidBuildGradle: string;
  let originalIosInfoPlist: string;
  let originalIosProjectPbxproj: string;

  beforeAll(() => {
    // 원본 파일 백업
    if (fs.existsSync(versionInfoPath)) {
      originalVersionInfo = JSON.parse(
        fs.readFileSync(versionInfoPath, 'utf8')
      );
      fs.writeFileSync(
        backupVersionInfoPath,
        JSON.stringify(originalVersionInfo, null, 2)
      );
    }

    if (fs.existsSync(androidBuildGradlePath)) {
      originalAndroidBuildGradle = fs.readFileSync(
        androidBuildGradlePath,
        'utf8'
      );
      fs.writeFileSync(
        backupAndroidBuildGradlePath,
        originalAndroidBuildGradle
      );
    }

    if (fs.existsSync(iosInfoPlistPath)) {
      originalIosInfoPlist = fs.readFileSync(iosInfoPlistPath, 'utf8');
      fs.writeFileSync(backupIosInfoPlistPath, originalIosInfoPlist);
    }

    if (fs.existsSync(iosProjectPbxprojPath)) {
      originalIosProjectPbxproj = fs.readFileSync(
        iosProjectPbxprojPath,
        'utf8'
      );
      fs.writeFileSync(backupIosProjectPbxprojPath, originalIosProjectPbxproj);
    }
  });

  beforeEach(() => {
    // 각 테스트 전에 원본 파일 복원
    if (fs.existsSync(backupVersionInfoPath)) {
      fs.copyFileSync(backupVersionInfoPath, versionInfoPath);
    }
    if (fs.existsSync(backupAndroidBuildGradlePath)) {
      fs.copyFileSync(backupAndroidBuildGradlePath, androidBuildGradlePath);
    }
    if (fs.existsSync(backupIosInfoPlistPath)) {
      fs.copyFileSync(backupIosInfoPlistPath, iosInfoPlistPath);
    }
    if (fs.existsSync(backupIosProjectPbxprojPath)) {
      fs.copyFileSync(backupIosProjectPbxprojPath, iosProjectPbxprojPath);
    }
  });

  afterAll(() => {
    // 원본 파일 복원
    if (fs.existsSync(backupVersionInfoPath)) {
      fs.copyFileSync(backupVersionInfoPath, versionInfoPath);
    }
    if (fs.existsSync(backupAndroidBuildGradlePath)) {
      fs.copyFileSync(backupAndroidBuildGradlePath, androidBuildGradlePath);
    }
    if (fs.existsSync(backupIosInfoPlistPath)) {
      fs.copyFileSync(backupIosInfoPlistPath, iosInfoPlistPath);
    }
    if (fs.existsSync(backupIosProjectPbxprojPath)) {
      fs.copyFileSync(backupIosProjectPbxprojPath, iosProjectPbxprojPath);
    }

    // 백업 파일 정리
    [
      backupVersionInfoPath,
      backupAndroidBuildGradlePath,
      backupIosInfoPlistPath,
      backupIosProjectPbxprojPath,
    ].forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  });

  // Helper 함수들
  const getVersionInfo = () => {
    return JSON.parse(fs.readFileSync(versionInfoPath, 'utf8'));
  };

  const getAndroidVersionName = () => {
    const content = fs.readFileSync(androidBuildGradlePath, 'utf8');
    const match = content.match(/versionName\s+"(\d+\.\d+\.\d+)"/);
    return match ? match[1] : null;
  };

  const getAndroidVersionCode = () => {
    const content = fs.readFileSync(androidBuildGradlePath, 'utf8');
    const match = content.match(/versionCode\s+(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const getIOSShortVersion = () => {
    const content = fs.readFileSync(iosInfoPlistPath, 'utf8');
    const match = content.match(
      /<key>CFBundleShortVersionString<\/key>\s*<string>(\d+\.\d+\.\d+)<\/string>/
    );
    return match ? match[1] : null;
  };

  const getIOSBuildNumber = () => {
    const content = fs.readFileSync(iosInfoPlistPath, 'utf8');
    const match = content.match(
      /<key>CFBundleVersion<\/key>\s*<string>(\d+)<\/string>/
    );
    return match ? parseInt(match[1], 10) : null;
  };

  const getIOSMarketingVersion = () => {
    const content = fs.readFileSync(iosProjectPbxprojPath, 'utf8');
    const match = content.match(/MARKETING_VERSION = (\d+\.\d+\.\d+);/);
    return match ? match[1] : null;
  };

  const getIOSCurrentProjectVersion = () => {
    const content = fs.readFileSync(iosProjectPbxprojPath, 'utf8');
    const matches = content.match(/CURRENT_PROJECT_VERSION = (\d+);/g);
    if (matches && matches.length > 0) {
      const firstMatch = matches[0].match(/CURRENT_PROJECT_VERSION = (\d+);/);
      return firstMatch ? parseInt(firstMatch[1], 10) : null;
    }
    return null;
  };

  // 직접 함수 호출을 위한 헬퍼 함수들
  const executeVersionUpdate = async (args: string[]) => {
    // OptionChecker의 argv를 설정
    OptionChecker.argv = args;

    // VersionInfo 로드
    const versionInfo = await FileHelper.readVersionInfo();

    // 버전 업데이트 로직
    if (OptionChecker.isAll()) {
      VersionUpdater.incrementAndroidVersion(versionInfo);
      VersionUpdater.incrementAndroidVersionCode(versionInfo);
      VersionUpdater.incrementIOSVersion(versionInfo);
      VersionUpdater.resetIOSBuildNumber(versionInfo);
    } else if (OptionChecker.isAndroidBuild()) {
      VersionUpdater.incrementAndroidVersionCode(versionInfo);
    } else if (OptionChecker.isIOSBuild()) {
      VersionUpdater.incrementIOSBuildNumber(versionInfo);
    } else if (OptionChecker.isAndroid()) {
      VersionUpdater.incrementAndroidVersion(versionInfo);
      VersionUpdater.incrementAndroidVersionCode(versionInfo);
    } else if (OptionChecker.isIOS()) {
      VersionUpdater.incrementIOSVersion(versionInfo);
      VersionUpdater.resetIOSBuildNumber(versionInfo);
    } else if (OptionChecker.isRuntime()) {
      VersionUpdater.incrementRuntimeVersion(versionInfo);
    }

    // VersionInfo.json 저장
    await FileHelper.writeVersionInfo(versionInfo);

    // Android 파일 업데이트
    if (!OptionChecker.shouldSkipAndroid()) {
      const isBuildOnly = OptionChecker.isAndroidBuild();
      await updateAndroidBuildGradle(versionInfo, isBuildOnly);
    }

    // iOS 파일 업데이트
    if (!OptionChecker.shouldSkipIOS()) {
      const isBuildOnly = OptionChecker.isIOSBuild();
      await updateIOSProjectPbxproj(versionInfo, isBuildOnly);
      await updateIOSInfoPlist(versionInfo, isBuildOnly);
    }
  };

  describe('version-up (--all)', () => {
    it('Android와 iOS 버전을 동시에 증가시킴 - VersionInfo의 ANDROID_VERSION, IOS_VERSION 갱신 및 android/build.gradle의 versionName 증가, ios/Info.plist 및 project.pbxproj의 CFBundleShortVersionString, MARKETING_VERSION 증가', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();

      await executeVersionUpdate(['--all']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSMarketingVersion();

      // VersionInfo.json 확인
      expect(after.ANDROID_VERSION).not.toBe(before.ANDROID_VERSION);
      expect(after.IOS_VERSION).not.toBe(before.IOS_VERSION);
      expect(after.ANDROID_VERSION_CODE).toBe(before.ANDROID_VERSION_CODE + 1);
      expect(after.IOS_BUILD_NUMBER).toBe(1);

      // Android build.gradle 확인 - versionName 증가
      expect(afterAndroidVersion).toBe(after.ANDROID_VERSION);
      expect(afterAndroidVersion).not.toBe(beforeAndroidVersion);

      // iOS 파일 확인 - CFBundleShortVersionString, MARKETING_VERSION 증가
      expect(afterIOSVersion).toBe(after.IOS_VERSION);
      expect(afterIOSVersion).not.toBe(beforeIOSVersion);
    });
  });

  describe('version-up:android (--android)', () => {
    it('Android 버전만 증가시킴 - VersionInfo의 ANDROID_VERSION만 증가 및 android/build.gradle의 versionName 증가', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();
      const beforeRuntimeVersion = before.RUNTIME_VERSION;

      await executeVersionUpdate(['--android']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSShortVersion();

      // VersionInfo.json 확인 - ANDROID_VERSION만 증가
      expect(after.ANDROID_VERSION).not.toBe(before.ANDROID_VERSION);
      expect(after.IOS_VERSION).toBe(before.IOS_VERSION); // iOS는 변경되지 않음
      expect(after.RUNTIME_VERSION).toBe(beforeRuntimeVersion); // Runtime은 변경되지 않음
      expect(after.ANDROID_VERSION_CODE).toBe(before.ANDROID_VERSION_CODE + 1);

      // Android build.gradle 확인 - versionName 증가
      expect(afterAndroidVersion).toBe(after.ANDROID_VERSION);
      expect(afterAndroidVersion).not.toBe(beforeAndroidVersion);

      // iOS는 변경되지 않음
      expect(afterIOSVersion).toBe(beforeIOSVersion);
    });
  });

  describe('version-up:ios (--ios)', () => {
    it('iOS 버전만 증가시킴 - VersionInfo의 IOS_VERSION만 증가 및 ios/Info.plist의 CFBundleShortVersionString 증가, ios/project.pbxproj의 MARKETING_VERSION 증가', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();
      const beforeRuntimeVersion = before.RUNTIME_VERSION;

      await executeVersionUpdate(['--ios']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSMarketingVersion();

      // VersionInfo.json 확인 - IOS_VERSION만 증가
      expect(after.IOS_VERSION).not.toBe(before.IOS_VERSION);
      expect(after.ANDROID_VERSION).toBe(before.ANDROID_VERSION); // Android는 변경되지 않음
      expect(after.RUNTIME_VERSION).toBe(beforeRuntimeVersion); // Runtime은 변경되지 않음
      expect(after.IOS_BUILD_NUMBER).toBe(1);

      // iOS Info.plist 확인 - CFBundleShortVersionString 증가
      const afterIOSShortVersion = getIOSShortVersion();
      expect(afterIOSShortVersion).toBe(after.IOS_VERSION);
      expect(afterIOSShortVersion).not.toBe(beforeIOSVersion);

      // iOS project.pbxproj 확인 - MARKETING_VERSION 증가
      expect(afterIOSVersion).toBe(after.IOS_VERSION);
      expect(afterIOSVersion).not.toBe(beforeIOSVersion);

      // Android는 변경되지 않음
      expect(afterAndroidVersion).toBe(beforeAndroidVersion);
    });
  });

  describe('version-up:runtime (--runtime)', () => {
    it('JS 런타임 버전만 증가시킴 - VersionInfo의 RUNTIME_VERSION만 증가, Android/iOS 네이티브 버전에는 영향 없음', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();

      await executeVersionUpdate(['--runtime']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSShortVersion();

      // VersionInfo.json 확인 - RUNTIME_VERSION만 증가
      expect(after.RUNTIME_VERSION).not.toBe(before.RUNTIME_VERSION);
      expect(after.ANDROID_VERSION).toBe(before.ANDROID_VERSION);
      expect(after.IOS_VERSION).toBe(before.IOS_VERSION);

      // 네이티브 파일들은 변경되지 않음
      expect(afterAndroidVersion).toBe(beforeAndroidVersion);
      expect(afterIOSVersion).toBe(beforeIOSVersion);
    });
  });

  describe('version-up:native (--all + --runtime)', () => {
    it('Android + iOS + Runtime 전체 버전 증가 - VersionInfo의 ANDROID_VERSION, IOS_VERSION, RUNTIME_VERSION 모두 증가 및 android/build.gradle, ios/Info.plist, project.pbxproj 버전 동시 반영', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();
      const beforeRuntimeVersion = before.RUNTIME_VERSION;

      await executeVersionUpdate(['--all']);
      await executeVersionUpdate(['--runtime']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSMarketingVersion();

      // VersionInfo.json 확인 - ANDROID_VERSION, IOS_VERSION, RUNTIME_VERSION 모두 증가
      expect(after.ANDROID_VERSION).not.toBe(before.ANDROID_VERSION);
      expect(after.IOS_VERSION).not.toBe(before.IOS_VERSION);
      expect(after.RUNTIME_VERSION).not.toBe(beforeRuntimeVersion);
      expect(after.ANDROID_VERSION_CODE).toBe(before.ANDROID_VERSION_CODE + 1);
      expect(after.IOS_BUILD_NUMBER).toBe(1);

      // 네이티브 파일 확인 - android/build.gradle, ios/Info.plist, project.pbxproj 버전 동시 반영
      expect(afterAndroidVersion).toBe(after.ANDROID_VERSION);
      expect(afterIOSVersion).toBe(after.IOS_VERSION);
    });
  });

  describe('version-up:native:android (--android + --runtime)', () => {
    it('Android + Runtime 버전 증가 - VersionInfo의 ANDROID_VERSION, RUNTIME_VERSION 증가 및 android/build.gradle의 versionName 증가', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();
      const beforeRuntimeVersion = before.RUNTIME_VERSION;

      await executeVersionUpdate(['--android']);
      await executeVersionUpdate(['--runtime']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSShortVersion();

      // VersionInfo.json 확인 - ANDROID_VERSION, RUNTIME_VERSION 증가
      expect(after.ANDROID_VERSION).not.toBe(before.ANDROID_VERSION);
      expect(after.RUNTIME_VERSION).not.toBe(beforeRuntimeVersion);
      expect(after.IOS_VERSION).toBe(before.IOS_VERSION); // iOS는 변경되지 않음
      expect(after.ANDROID_VERSION_CODE).toBe(before.ANDROID_VERSION_CODE + 1);

      // Android build.gradle 확인 - versionName 증가
      expect(afterAndroidVersion).toBe(after.ANDROID_VERSION);

      // iOS는 변경되지 않음
      expect(afterIOSVersion).toBe(beforeIOSVersion);
    });
  });

  describe('version-up:native:ios (--ios + --runtime)', () => {
    it('iOS + Runtime 버전 증가 - VersionInfo의 IOS_VERSION, RUNTIME_VERSION 증가 및 ios/Info.plist의 CFBundleShortVersionString 증가, ios/project.pbxproj의 MARKETING_VERSION 증가', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();
      const beforeRuntimeVersion = before.RUNTIME_VERSION;

      await executeVersionUpdate(['--ios']);
      await executeVersionUpdate(['--runtime']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSMarketingVersion();

      // VersionInfo.json 확인 - IOS_VERSION, RUNTIME_VERSION 증가
      expect(after.IOS_VERSION).not.toBe(before.IOS_VERSION);
      expect(after.RUNTIME_VERSION).not.toBe(beforeRuntimeVersion);
      expect(after.ANDROID_VERSION).toBe(before.ANDROID_VERSION); // Android는 변경되지 않음
      expect(after.IOS_BUILD_NUMBER).toBe(1);

      // iOS Info.plist 확인 - CFBundleShortVersionString 증가
      const afterIOSShortVersion = getIOSShortVersion();
      expect(afterIOSShortVersion).toBe(after.IOS_VERSION);

      // iOS project.pbxproj 확인 - MARKETING_VERSION 증가
      expect(afterIOSVersion).toBe(after.IOS_VERSION);

      // Android는 변경되지 않음
      expect(afterAndroidVersion).toBe(beforeAndroidVersion);
    });
  });

  describe('build-number-up:android (--android-build)', () => {
    it('Android 빌드번호(versionCode)만 증가 - VersionInfo의 ANDROID_VERSION_CODE 증가 및 android/build.gradle의 versionCode 증가, 버전(versionName)은 그대로 유지', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeAndroidVersionCode = getAndroidVersionCode();
      const beforeIOSVersion = getIOSShortVersion();

      // null 체크
      expect(beforeAndroidVersionCode).not.toBeNull();
      if (beforeAndroidVersionCode === null) return;

      await executeVersionUpdate(['--android-build']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterAndroidVersionCode = getAndroidVersionCode();
      const afterIOSVersion = getIOSShortVersion();

      // VersionInfo.json 확인 - ANDROID_VERSION_CODE만 증가
      expect(after.ANDROID_VERSION_CODE).toBe(before.ANDROID_VERSION_CODE + 1);
      expect(after.ANDROID_VERSION).toBe(before.ANDROID_VERSION); // 버전은 변경되지 않음
      expect(after.IOS_VERSION).toBe(before.IOS_VERSION);

      // Android build.gradle 확인 - versionCode 증가, versionName은 유지
      expect(afterAndroidVersionCode).not.toBeNull();
      if (afterAndroidVersionCode !== null) {
        expect(afterAndroidVersionCode).toBe(after.ANDROID_VERSION_CODE);
        expect(afterAndroidVersionCode).toBe(beforeAndroidVersionCode + 1);
      }
      expect(afterAndroidVersion).toBe(beforeAndroidVersion); // versionName은 변경되지 않음

      // iOS는 변경되지 않음
      expect(afterIOSVersion).toBe(beforeIOSVersion);
    });
  });

  describe('build-number-up:ios (--ios-build)', () => {
    it('iOS 빌드번호(CFBundleVersion)만 증가 - VersionInfo의 IOS_BUILD_NUMBER 증가 및 ios/Info.plist와 project.pbxproj의 CFBundleVersion, CURRENT_PROJECT_VERSION 증가, 버전(CFBundleShortVersionString)은 그대로 유지', async () => {
      const before = getVersionInfo();
      const beforeAndroidVersion = getAndroidVersionName();
      const beforeIOSVersion = getIOSShortVersion();
      const beforeIOSBuildNumber = getIOSBuildNumber();
      const beforeIOSCurrentProjectVersion = getIOSCurrentProjectVersion();

      // null 체크
      expect(beforeIOSBuildNumber).not.toBeNull();
      expect(beforeIOSCurrentProjectVersion).not.toBeNull();
      if (
        beforeIOSBuildNumber === null ||
        beforeIOSCurrentProjectVersion === null
      )
        return;

      await executeVersionUpdate(['--ios-build']);

      const after = getVersionInfo();
      const afterAndroidVersion = getAndroidVersionName();
      const afterIOSVersion = getIOSShortVersion();
      const afterIOSBuildNumber = getIOSBuildNumber();
      const afterIOSCurrentProjectVersion = getIOSCurrentProjectVersion();

      // VersionInfo.json 확인 - IOS_BUILD_NUMBER만 증가
      expect(after.IOS_BUILD_NUMBER).toBe(before.IOS_BUILD_NUMBER + 1);
      expect(after.IOS_VERSION).toBe(before.IOS_VERSION); // 버전은 변경되지 않음
      expect(after.ANDROID_VERSION).toBe(before.ANDROID_VERSION);

      // iOS Info.plist 확인 - CFBundleVersion 증가, CFBundleShortVersionString은 유지
      expect(afterIOSBuildNumber).not.toBeNull();
      if (afterIOSBuildNumber !== null) {
        expect(afterIOSBuildNumber).toBe(after.IOS_BUILD_NUMBER);
        expect(afterIOSBuildNumber).toBe(beforeIOSBuildNumber + 1);
      }
      expect(afterIOSVersion).toBe(beforeIOSVersion); // CFBundleShortVersionString은 변경되지 않음

      // iOS project.pbxproj 확인 - CURRENT_PROJECT_VERSION 증가
      expect(afterIOSCurrentProjectVersion).not.toBeNull();
      if (afterIOSCurrentProjectVersion !== null) {
        expect(afterIOSCurrentProjectVersion).toBe(
          beforeIOSCurrentProjectVersion + 1
        );
      }

      // Android는 변경되지 않음
      expect(afterAndroidVersion).toBe(beforeAndroidVersion);
    });
  });

  describe('버전 증가 로직', () => {
    it('패치 버전이 올바르게 증가해야 함 (1.0.0 -> 1.0.1)', () => {
      const testVersion = '1.0.0';
      const versionParts = testVersion.split('.');
      const newPatch = parseInt(versionParts[2], 10) + 1;
      const expectedVersion = `${versionParts[0]}.${versionParts[1]}.${newPatch}`;

      expect(expectedVersion).toBe('1.0.1');
    });

    it('버전 1.0.9 -> 1.0.10 처리가 올바르게 되어야 함', () => {
      const testVersion = '1.0.9';
      const versionParts = testVersion.split('.');
      const newPatch = parseInt(versionParts[2], 10) + 1;
      const expectedVersion = `${versionParts[0]}.${versionParts[1]}.${newPatch}`;

      expect(expectedVersion).toBe('1.0.10');
    });

    it('버전이 증가할 때 빌드 번호도 증가해야 함', () => {
      const versionInfo = {
        ANDROID_VERSION: '1.0.0',
        ANDROID_VERSION_CODE: 5,
        IOS_VERSION: '1.0.0',
        IOS_BUILD_NUMBER: 3,
      };

      // 버전 증가 시뮬레이션
      versionInfo.ANDROID_VERSION = versionInfo.ANDROID_VERSION.replace(
        /(\d+.\d+.\d+)/g,
        (match: string, version: string) => {
          const parts = version.split('.');
          return `${parts[0]}.${parts[1]}.${parseInt(parts[2], 10) + 1}`;
        }
      );

      // 빌드 번호 증가/리셋 정책
      versionInfo.ANDROID_VERSION_CODE += 1;
      versionInfo.IOS_BUILD_NUMBER = 1;

      expect(versionInfo.ANDROID_VERSION).toBe('1.0.1');
      expect(versionInfo.ANDROID_VERSION_CODE).toBe(6);
      expect(versionInfo.IOS_BUILD_NUMBER).toBe(1);
    });
  });
});

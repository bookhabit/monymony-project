const fs = require('fs').promises;
const path = require('path');

// 파일 경로 상수
const PATHS = {
  versionInfo: path.join(__dirname, 'versionInfo.json'),
  androidBuildGradle: path.join(__dirname, 'android/app/build.gradle'),
  iosInfoPlist: path.join(__dirname, 'ios/monymony/Info.plist'),
  iosProjectPbxproj: path.join(
    __dirname,
    'ios/monymony.xcodeproj/project.pbxproj'
  ),
};

// 정규식 패턴 상수
const PATTERNS = {
  version: /(\d+\.\d+\.\d+)/g,
  androidVersionName: /versionName\s+"(\d+\.\d+\.\d+)"/g,
  androidVersionCode: /versionCode\s+(\d+)/g,
  iosMarketingVersion: /MARKETING_VERSION\s*=\s*(\d+\.\d+\.\d+);/g,
  iosCurrentProjectVersion: /CURRENT_PROJECT_VERSION\s*=\s*(\d+);/g,
  iosBundleVersion: /<key>CFBundleVersion<\/key>\s*<string>(\d+)<\/string>/g,
  iosShortVersion:
    /<key>CFBundleShortVersionString<\/key>\s*<string>(\d+\.\d+\.\d+)<\/string>/g,
};

/**
 * 버전 문자열의 패치 버전을 증가시킴
 * @param {string} version - "1.0.0" 형식의 버전 문자열
 * @returns {string} 증가된 버전 문자열
 */
function incrementPatchVersion(version) {
  return version.replace(PATTERNS.version, (match, versionStr) => {
    const parts = versionStr.split('.');
    const patch = parseInt(parts[2], 10) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  });
}

/**
 * VersionInfo 객체를 업데이트하는 함수들
 */
const VersionUpdater = {
  incrementAndroidVersion(versionInfo) {
    versionInfo.ANDROID_VERSION = incrementPatchVersion(
      versionInfo.ANDROID_VERSION
    );
  },

  incrementIOSVersion(versionInfo) {
    versionInfo.IOS_VERSION = incrementPatchVersion(versionInfo.IOS_VERSION);
  },

  incrementRuntimeVersion(versionInfo) {
    versionInfo.RUNTIME_VERSION = incrementPatchVersion(
      versionInfo.RUNTIME_VERSION
    );
  },

  incrementAndroidVersionCode(versionInfo) {
    versionInfo.ANDROID_VERSION_CODE += 1;
  },

  incrementIOSBuildNumber(versionInfo) {
    versionInfo.IOS_BUILD_NUMBER += 1;
  },

  resetIOSBuildNumber(versionInfo) {
    versionInfo.IOS_BUILD_NUMBER = 1;
  },
};

/**
 * 파일 읽기/쓰기 헬퍼
 */
const FileHelper = {
  async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`❌ 파일 읽기 실패: ${filePath}`, error.message);
      throw error;
    }
  },

  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      console.error(`❌ 파일 쓰기 실패: ${filePath}`, error.message);
      throw error;
    }
  },

  async readVersionInfo() {
    const content = await this.readFile(PATHS.versionInfo);
    return JSON.parse(content);
  },

  async writeVersionInfo(versionInfo) {
    await this.writeFile(
      PATHS.versionInfo,
      JSON.stringify(versionInfo, null, 2)
    );
  },
};

/**
 * Android build.gradle 파일 업데이트
 */
async function updateAndroidBuildGradle(versionInfo, isBuildOnly = false) {
  const content = await FileHelper.readFile(PATHS.androidBuildGradle);

  // versionCode 업데이트
  let updated = content.replace(
    PATTERNS.androidVersionCode,
    `versionCode ${versionInfo.ANDROID_VERSION_CODE}`
  );

  // versionName 업데이트 (빌드 번호만 올릴 때는 제외)
  if (!isBuildOnly) {
    updated = updated.replace(
      PATTERNS.androidVersionName,
      `versionName "${versionInfo.ANDROID_VERSION}"`
    );
  }

  await FileHelper.writeFile(PATHS.androidBuildGradle, updated);
}

/**
 * iOS project.pbxproj 파일 업데이트
 */
async function updateIOSProjectPbxproj(versionInfo, isBuildOnly = false) {
  const content = await FileHelper.readFile(PATHS.iosProjectPbxproj);

  // CURRENT_PROJECT_VERSION 업데이트
  let updated = content.replace(
    PATTERNS.iosCurrentProjectVersion,
    `CURRENT_PROJECT_VERSION = ${versionInfo.IOS_BUILD_NUMBER};`
  );

  // MARKETING_VERSION 업데이트 (빌드 번호만 올릴 때는 제외)
  if (!isBuildOnly) {
    updated = updated.replace(
      PATTERNS.iosMarketingVersion,
      `MARKETING_VERSION = ${versionInfo.IOS_VERSION};`
    );
  }

  await FileHelper.writeFile(PATHS.iosProjectPbxproj, updated);
}

/**
 * iOS Info.plist 파일 업데이트
 */
async function updateIOSInfoPlist(versionInfo, isBuildOnly = false) {
  const content = await FileHelper.readFile(PATHS.iosInfoPlist);

  // CFBundleVersion 업데이트
  let updated = content.replace(
    PATTERNS.iosBundleVersion,
    `<key>CFBundleVersion</key>\n\t<string>${versionInfo.IOS_BUILD_NUMBER}</string>`
  );

  // CFBundleShortVersionString 업데이트 (빌드 번호만 올릴 때는 제외)
  if (!isBuildOnly) {
    updated = updated.replace(
      PATTERNS.iosShortVersion,
      `<key>CFBundleShortVersionString</key>\n\t<string>${versionInfo.IOS_VERSION}</string>`
    );
  }

  await FileHelper.writeFile(PATHS.iosInfoPlist, updated);
}

/**
 * 명령어 옵션 체크 헬퍼
 */
const OptionChecker = {
  isAll() {
    return this.argv.length === 0 || this.has('--a', '--all');
  },

  isAndroid() {
    return this.has('--android');
  },

  isIOS() {
    return this.has('--ios');
  },

  isAndroidBuild() {
    return this.has('--android-build', '--android:build');
  },

  isIOSBuild() {
    return this.has('--ios-build', '--ios:build');
  },

  isRuntime() {
    return this.has('--runtime', '--r');
  },

  shouldSkipAndroid() {
    return this.isIOS() || this.isIOSBuild();
  },

  shouldSkipIOS() {
    return this.isAndroid() || this.isAndroidBuild();
  },

  has(...options) {
    return options.some((opt) => this.argv.includes(opt));
  },

  argv: process.argv.slice(2),
};

/**
 * 메인 실행 로직
 */
async function main() {
  try {
    // VersionInfo 로드
    const versionInfo = await FileHelper.readVersionInfo();
    console.log('📦 현재 버전 정보:', versionInfo);

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
    console.log('✅ VersionInfo.json 업데이트 완료');

    // Android 파일 업데이트
    if (!OptionChecker.shouldSkipAndroid()) {
      const isBuildOnly = OptionChecker.isAndroidBuild();
      await updateAndroidBuildGradle(versionInfo, isBuildOnly);
      console.log(
        isBuildOnly
          ? '✅ Android build number (versionCode) 업데이트 완료'
          : '✅ Android version 업데이트 완료'
      );
    }

    // iOS 파일 업데이트
    if (!OptionChecker.shouldSkipIOS()) {
      const isBuildOnly = OptionChecker.isIOSBuild();
      await updateIOSProjectPbxproj(versionInfo, isBuildOnly);
      await updateIOSInfoPlist(versionInfo, isBuildOnly);
      console.log(
        isBuildOnly
          ? '✅ iOS build number (CURRENT_PROJECT_VERSION & CFBundleVersion) 업데이트 완료'
          : '✅ iOS version 업데이트 완료'
      );
    }

    console.log('🎉 모든 버전 업데이트 완료!');
  } catch (error) {
    console.error('❌ 버전 업데이트 실패:', error.message);
    process.exit(1);
  }
}

// 직접 실행 시에만 main() 실행
if (require.main === module) {
  main();
}

// 테스트를 위해 함수들 export
module.exports = {
  incrementPatchVersion,
  VersionUpdater,
  FileHelper,
  OptionChecker,
  updateAndroidBuildGradle,
  updateIOSProjectPbxproj,
  updateIOSInfoPlist,
  PATHS,
  PATTERNS,
};

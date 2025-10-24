const fs = require('fs');
const argv = process.argv ?? [];
const versionInfo = require('./versionInfo');

console.log('versionInfo : ', versionInfo);

function incrementVersion() {
  versionInfo.VERSION = versionInfo.VERSION.replace(
    /(\d+.\d+.\d+)/g,
    (match, version) => {
      const versionParts = version.split('.');
      const newVersion = versionParts
        .map((part, index) => {
          if (index === versionParts.length - 1) {
            return parseInt(part, 10) + 1;
          }
          return part;
        })
        .join('.');
      return newVersion;
    }
  );
}

function incrementRuntimeVersion() {
  versionInfo.RUNTIME_VERSION = versionInfo.RUNTIME_VERSION.replace(
    /(\d+.\d+.\d+)/g,
    (match, version) => {
      const versionParts = version.split('.');
      const newVersion = versionParts
        .map((part, index) => {
          if (index === versionParts.length - 1) {
            return parseInt(part, 10) + 1;
          }
          return part;
        })
        .join('.');
      return newVersion;
    }
  );
}

function incrementBuildNumber() {
  versionInfo.BUILD_NUMBER = versionInfo.BUILD_NUMBER + 1;
}

if (argv.length === 0 || argv.includes('--a') || argv.includes('--all')) {
  incrementVersion();
  incrementRuntimeVersion();
  incrementBuildNumber();
} else if (argv.includes('--v') || argv.includes('--version')) {
  incrementVersion();
} else if (argv.includes('--r') || argv.includes('--runtime-version')) {
  incrementRuntimeVersion();
} else if (argv.includes('--b') || argv.includes('--build-number')) {
  incrementBuildNumber();
}

const versionInfoFilePath = './versionInfo.json';
fs.readFile(versionInfoFilePath, 'utf8', (err, versionInfoData) => {
  if (err) {
    console.error(err);
    return;
  }
  fs.writeFile(
    versionInfoFilePath,
    JSON.stringify(versionInfo, null, 2),
    'utf8',
    (_err) => {
      if (_err) {
        console.error(_err);
        return;
      }
      console.log('Version info incremented successfully!');
    }
  );
});

const iosProjectFilePath = './ios/apptemplate.xcodeproj/project.pbxproj';
fs.readFile(iosProjectFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const versionRegex = /MARKETING_VERSION = (\d+\.\d+);/g;
  const buildNumber = /CURRENT_PROJECT_VERSION = (\d+);/g;
  const updatedData = data
    .replace(versionRegex, `MARKETING_VERSION = ${versionInfo.VERSION};`)
    .replace(
      buildNumber,
      `CURRENT_PROJECT_VERSION = ${versionInfo.BUILD_NUMBER};`
    );

  fs.writeFile(iosProjectFilePath, updatedData, 'utf8', (_err) => {
    if (_err) {
      console.error(_err);
      return;
    }
    console.log('Project version incremented successfully!');
  });
});

const androidFilePath = './android/app/build.gradle';
fs.readFile(androidFilePath, 'utf8', (err, androidData) => {
  if (err) {
    console.error(err);
    return;
  }

  const versionRegex = /versionName "(\d+.\d+.\d+)"/g;
  const buildNumber = /versionCode (\d+)/g;
  const updatedAndroidData = androidData
    .replace(versionRegex, `versionName "${versionInfo.VERSION}"`)
    .replace(buildNumber, `versionCode ${versionInfo.BUILD_NUMBER}`);

  fs.writeFile(androidFilePath, updatedAndroidData, 'utf8', (_err) => {
    if (_err) {
      console.error(_err);
      return;
    }
    console.log('Android version incremented successfully!');
  });
});

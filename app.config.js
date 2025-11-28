const versionInfo = require('./versionInfo.json');

export default {
  expo: {
    name: 'monymony',
    slug: 'monymony',
    platforms: ['ios', 'android'],
    version: versionInfo.ANDROID_VERSION,
    runtimeVersion: versionInfo.RUNTIME_VERSION,
    appVersionSource: 'local',
    orientation: 'portrait',
    icon: 'src/assets/images/ic_launcher.png',
    scheme: 'monymony',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'com.hyunjin-l.monymony',
      supportsTablet: true,
      buildNumber: String(versionInfo.IOS_BUILD_NUMBER),
      version: versionInfo.IOS_VERSION,
    },
    android: {
      package: 'com.hyunjin_l.monymony',
      adaptiveIcon: {
        foregroundImage: './src/assets/images/ic_launcher.png',
        backgroundColor: '#ffffff', // 아이콘 배경색 (필요시 변경)
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      versionCode: versionInfo.ANDROID_VERSION_CODE,
      version: versionInfo.ANDROID_VERSION,
    },
    web: {
      output: 'static',
      favicon: 'src/assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: 'src/assets/images/ic_launcher.png',
          backgroundColor: '#ffffff', // 스플래시 배경색 (필요시 변경)
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
      'expo-font',
      [
        'expo-notifications',
        {
          icon: './src/assets/images/ic_launcher.png',
          color: '#007AFF',
          sounds: [],
        },
      ],
      [
        'expo-calendar',
        {
          calendarPermission: 'The app needs to access your calendar.',
          remindersPermission: 'The app needs to access your reminders.',
        },
      ],
      [
        'expo-audio',
        {
          microphonePermission:
            'Allow $(PRODUCT_NAME) to access your microphone.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: '067668ac-deee-418a-8f2b-29eed40da930',
      },
    },
    updates: {
      url: 'https://u.expo.dev/067668ac-deee-418a-8f2b-29eed40da930',
    },
  },
};

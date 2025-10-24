const versionInfo = require('./versionInfo.json');

export default {
  expo: {
    name: 'monymony',
    slug: 'monymony',
    version: versionInfo.VERSION,
    runtimeVersion: versionInfo.RUNTIME_VERSION,
    orientation: 'portrait',
    icon: 'src/assets/images/icon.png',
    scheme: 'monymony',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier: 'com.hyunjin-l.monymony',
      supportsTablet: true,
      buildNumber: String(versionInfo.BUILD_NUMBER),
    },
    android: {
      package: 'com.hyunjin_l.monymony',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './src/assets/images/icon.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      versionCode: versionInfo.BUILD_NUMBER,
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
          image: 'src/assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-font',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};

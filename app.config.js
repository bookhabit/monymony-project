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
      requireFullScreen: true,
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
      permissions: [
        'INTERNET',
        'SYSTEM_ALERT_WINDOW',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'READ_PHONE_STATE',
        'FOREGROUND_SERVICE',
        'POST_NOTIFICATIONS',
        'READ_CALENDAR',
        'WRITE_CALENDAR',
        'WRITE_SETTINGS',
        'RECORD_AUDIO',
        'VIBRATE',
        'READ_CONTACTS',
        'WRITE_CONTACTS',
        'CAMERA',
        'READ_MEDIA_IMAGES',
        'READ_MEDIA_VIDEO',
        'READ_MEDIA_AUDIO',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'READ_MEDIA_IMAGES',
        'READ_MEDIA_VIDEO',
        'READ_MEDIA_AUDIO',
      ],
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
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
          microphonePermission:
            'Allow $(PRODUCT_NAME) to access your microphone',
          recordAudioAndroid: true,
        },
      ],
      [
        'expo-contacts',
        {
          contactsPermission: 'Allow $(PRODUCT_NAME) to access your contacts.',
        },
      ],
      [
        'expo-sensors',
        {
          motionPermission:
            'Allow $(PRODUCT_NAME) to access your device motion.',
        },
      ],
      [
        'expo-document-picker',
        {
          iCloudContainerEnvironment: 'Production',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you share them with your friends.',
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID.',
        },
      ],
      ['expo-localization'],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
      [
        'expo-maps',
        {
          requestLocationPermission: true,
          locationPermission: 'Allow $(PRODUCT_NAME) to use your location',
        },
      ],
      [
        'expo-media-library',
        {
          photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
          savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
          isAccessMediaLocationEnabled: true,
          granularPermissions: ['audio', 'photo'],
        },
      ],
      [
        'expo-navigation-bar',
        {
          backgroundColor: '#0f172a',
          barStyle: 'light',
          borderColor: '#1f2937',
          visibility: 'visible',
          behavior: 'inset-swipe',
          position: 'relative',
        },
      ],
      [
        'expo-screen-orientation',
        {
          initialOrientation: 'DEFAULT',
        },
      ],
      [
        'expo-secure-store',
        {
          configureAndroidBackup: true,
          faceIDPermission:
            'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
        },
      ],
      [
        'expo-tracking-transparency',
        {
          userTrackingPermission:
            'This identifier will be used to deliver personalized ads to you.',
        },
      ],
      [
        'expo-video',
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
      [
        'expo-web-browser',
        {
          experimentalLauncherActivity: true,
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

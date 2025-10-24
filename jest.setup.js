import '@testing-library/react-native/extend-expect';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useLocalSearchParams: jest.fn(),
  Redirect: jest.fn(),
  Stack: jest.fn(),
  Tabs: jest.fn(),
  Slot: jest.fn(),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  loadAsync: jest.fn(),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialIcons: ({ name, size, color, ...props }) =>
      React.createElement('MaterialIcons', { testID: name, ...props }),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
}));

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    })
  ),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: ({ children }) => children,
    Circle: 'Circle',
    Rect: 'Rect',
    Path: 'Path',
    G: 'G',
  };
});

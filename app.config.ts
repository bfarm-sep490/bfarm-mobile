import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'bfarm-mobile',
  slug: 'bfarm-mobile',
  owner: 'lee-inc',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'bfarm-mobile',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './src/assets/images/splash.png',
    resizeMode: 'contain',
  },
  assetBundlePatterns: ['**/*'],
  extra: {
    eas: {
      projectId: '51bd1635-4238-4edc-9e36-f7f61161f594',
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.bfarmx.app',
  },
  android: {
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.bfarmx.app',
  },
  web: {
    bundler: 'metro',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you share them with your friends.',
      },
    ],
    'expo-font',
    'expo-router',
    'expo-localization',
    'expo-secure-store',
    'react-native-bottom-tabs',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          newArchEnabled: true,
        },
        android: {
          newArchEnabled: true,
        },
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
};

export default config;

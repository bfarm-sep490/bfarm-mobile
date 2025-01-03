/* global process */

/** @type {Detox.DetoxConfig} */
module.exports = {
  logger: {
    level: process.env.CI ? 'debug' : undefined,
  },
  testRunner: {
    $0: 'jest',
    args: {
      config: 'e2e/jest.config.js',
      _: ['e2e'],
    },
  },
  artifacts: {
    plugins: {
      log: process.env.CI ? 'failing' : undefined,
      screenshot: 'failing',
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      build:
        // Replace `expobase` with your app's name (check out the folder name in `ios/`)
        'xcodebuild -workspace ios/expobase.xcworkspace -scheme expobase -configuration Debug -sdk iphonesimulator -arch x86_64 -derivedDataPath ios/build',
      // Points to the app's .app file generated by `npm run e2e:ios:debug:build`
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/expobase.app',
    },
    'ios.release': {
      type: 'ios.app',
      build:
        // Replace `expobase` with your app's name (check out the folder name in `ios/`)
        'xcodebuild -workspace ios/expobase.xcworkspace -scheme expobase -configuration Release -sdk iphonesimulator -arch x86_64 -derivedDataPath ios/build',
      // Points to the app's .app file generated by `npm run e2e:ios:build`
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/expobase.app',
    },
    'android.debug': {
      type: 'android.apk',
      build:
        'cd android && ./gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug && cd ..',
      // Points to the app's APK file generated by `npm run e2e:android:debug:build`
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
    },
    'android.release': {
      type: 'android.apk',
      build:
        'cd android && ./gradlew :app:assembleRelease :app:assembleAndroidTest -DtestBuildType=release && cd ..',
      // Points to the app's APK file generated by `npm run e2e:android:build`
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        // Emulator name can be found by running `emulator -list-avds`
        avdName: 'Pixel_4_API_33',
      },
    },
  },
  configurations: {
    'ios.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};

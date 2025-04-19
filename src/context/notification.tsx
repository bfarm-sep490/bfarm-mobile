import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useRef,
} from 'react';

import { Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, initializeApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  deleteToken,
} from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

try {
  getApp();
} catch {
  initializeApp({
    apiKey: 'AIzaSyDTdClmhDSwVV1kCzDUP20BASRC5fn2xMo',
    authDomain: 'blcap-sep490.firebaseapp.com',
    databaseURL: 'https://blcap-sep490.firebaseio.com',
    projectId: 'blcap-sep490',
    storageBucket: 'blcap-sep490.appspot.com',
    messagingSenderId: '1032682814172',
    appId: '1:1032682814172:android:329abb2eb698a78d4a1219',
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  deviceToken: string | null;
  requestPermission: () => Promise<boolean>;
  refreshToken: () => Promise<string | null>;
  removeToken: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType>({
  deviceToken: null,
  requestPermission: async () => false,
  refreshToken: async () => null,
  removeToken: async () => {},
});

export const useNotification = () => useContext(NotificationContext);

const showForegroundNotification = async (remoteMessage: any) => {
  try {
    if (remoteMessage?.notification) {
      await Notifications.presentNotificationAsync({
        sound: 'default',
        title: remoteMessage.notification.title || 'New Notification',
        body: remoteMessage.notification.body || 'You have a new message.',
        data: remoteMessage.data || {},
      });
    }
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const PermissionsAndroid = require('react-native').PermissionsAndroid;
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } else {
      // For iOS
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: false,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: true,
        },
      });
      return status === 'granted';
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const messaging = getMessaging();

  const unsubscribeRefs = useRef({
    onMessage: () => {},
    onOpen: () => {},
    tokenRefresh: () => {},
  });

  const getFCMToken = async (): Promise<string | null> => {
    try {
      const fcmToken = await getToken(messaging);
      if (fcmToken) {
        setDeviceToken(fcmToken);
        console.log('FCM Token:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        return fcmToken;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
    return null;
  };

  const removeFCMToken = async (): Promise<void> => {
    try {
      if (deviceToken) {
        await deleteToken(messaging);
      }

      await AsyncStorage.removeItem('fcmToken');

      setDeviceToken(null);

      unsubscribeRefs.current.onMessage();
      unsubscribeRefs.current.onOpen();
      unsubscribeRefs.current.tokenRefresh();

      setupFirebaseListeners();
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  };

  const setupFirebaseListeners = () => {
    unsubscribeRefs.current.onMessage();
    unsubscribeRefs.current.onOpen();
    unsubscribeRefs.current.tokenRefresh();

    unsubscribeRefs.current.onMessage = onMessage(
      messaging,
      async remoteMessage => {
        await showForegroundNotification(remoteMessage);
      },
    );

    unsubscribeRefs.current.onOpen = messaging.onNotificationOpenedApp(
      remoteMessage => {},
    );

    messaging.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
      }
    });

    messaging.setBackgroundMessageHandler(async remoteMessage => {});

    unsubscribeRefs.current.tokenRefresh = onTokenRefresh(messaging, token => {
      setDeviceToken(token);
      AsyncStorage.setItem('fcmToken', token).catch(error => {
        console.error('Error saving refreshed token:', error);
      });
    });
  };

  const initNotifications = async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      setPermissionGranted(hasPermission);

      if (!hasPermission) {
        return;
      }
      try {
        const storedToken = await AsyncStorage.getItem('fcmToken');
        if (storedToken) {
          setDeviceToken(storedToken);
          const currentToken = await getToken(messaging);
          if (currentToken !== storedToken) {
            setDeviceToken(currentToken);
            await AsyncStorage.setItem('fcmToken', currentToken);
          }
        } else {
          await getFCMToken();
        }
      } catch (error) {
        await getFCMToken();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  useEffect(() => {
    initNotifications();
    setupFirebaseListeners();

    return () => {
      unsubscribeRefs.current.onMessage();
      unsubscribeRefs.current.onOpen();
      unsubscribeRefs.current.tokenRefresh();
    };
  }, []);

  const contextValue: NotificationContextType = {
    deviceToken,
    requestPermission: async () => {
      const granted = await requestNotificationPermission();
      setPermissionGranted(granted);
      if (granted) {
        await getFCMToken();
      }
      return granted;
    },
    refreshToken: getFCMToken,
    removeToken: removeFCMToken,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

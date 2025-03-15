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
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
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
      console.log('📩 Displaying foreground notification:', remoteMessage);
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

  const unsubscribeRefs = useRef({
    onMessage: () => {},
    onOpen: () => {},
    tokenRefresh: () => {},
  });

  const getFCMToken = async (): Promise<string | null> => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('✅ FCM Token:', fcmToken);
        setDeviceToken(fcmToken);
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
      // Delete the token from Firebase
      if (deviceToken) {
        await messaging().deleteToken();
        console.log('🗑️ FCM Token deleted from Firebase');
      }

      // Clear from local storage
      await AsyncStorage.removeItem('fcmToken');

      // Update state
      setDeviceToken(null);

      // Unsubscribe from all Firebase listeners
      unsubscribeRefs.current.onMessage();
      unsubscribeRefs.current.onOpen();
      unsubscribeRefs.current.tokenRefresh();

      console.log('🔌 Unsubscribed from all Firebase listeners');
      console.log('🗑️ FCM Token removed from storage and state');

      // Setup subscriptions again with empty listeners
      setupFirebaseListeners();
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  };

  const setupFirebaseListeners = () => {
    // Unsubscribe from any existing listeners before setting up new ones
    unsubscribeRefs.current.onMessage();
    unsubscribeRefs.current.onOpen();
    unsubscribeRefs.current.tokenRefresh();

    // Set up new listeners
    unsubscribeRefs.current.onMessage = messaging().onMessage(
      async remoteMessage => {
        console.log('📩 Received foreground notification:', remoteMessage);
        await showForegroundNotification(remoteMessage);
      },
    );

    unsubscribeRefs.current.onOpen = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('📬 App opened from notification:', remoteMessage);
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '📬 App opened from quit state by notification:',
            remoteMessage,
          );
        }
      });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📥 Received background notification:', remoteMessage);
    });

    unsubscribeRefs.current.tokenRefresh = messaging().onTokenRefresh(token => {
      console.log('🔄 FCM token refreshed:', token);
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
        console.warn('Notification permissions not granted');
        return;
      }
      try {
        const storedToken = await AsyncStorage.getItem('fcmToken');
        if (storedToken) {
          console.log('🔄 Found token in storage:', storedToken);
          setDeviceToken(storedToken);
          const currentToken = await messaging().getToken();
          if (currentToken !== storedToken) {
            console.log('🔄 Token changed, updating...');
            setDeviceToken(currentToken);
            await AsyncStorage.setItem('fcmToken', currentToken);
          }
        } else {
          await getFCMToken();
        }
      } catch (error) {
        console.error('Error retrieving stored token:', error);
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
      // Clean up all listeners when component unmounts
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

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
import { useQueryClient, UseMutationResult } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import { NotificationServices } from '@/services/api/notifications/notificationService';
import { useNotification as useNotificationApi } from '@/services/api/notifications/useNotification';

import { useSession } from './ctx';

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

export type NotificationContextType = {
  deviceToken: string | null;
  permissionGranted: boolean;
  requestNotificationPermission: () => Promise<boolean>;
  saveDeviceTokenMutation: UseMutationResult<
    unknown,
    Error,
    { userId: number; token: string },
    unknown
  >;
  requestPermission: () => Promise<boolean>;
  refreshToken: () => Promise<string | null>;
  removeToken: () => Promise<void>;
};

export const NotificationContext = createContext<NotificationContextType>({
  deviceToken: null,
  permissionGranted: false,
  requestNotificationPermission: async () => false,
  saveDeviceTokenMutation: {} as UseMutationResult<
    unknown,
    Error,
    { userId: number; token: string },
    unknown
  >,
  requestPermission: async () => false,
  refreshToken: async () => null,
  removeToken: async () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

const showForegroundNotification = async (
  remoteMessage: any,
  queryClient: any,
) => {
  try {
    if (remoteMessage?.notification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          sound: 'default',
          title: remoteMessage.notification.title || 'New Notification',
          body: remoteMessage.notification.body || 'You have a new message.',
          data: remoteMessage.data || {},
        },
        trigger: null,
      });

      // Invalidate the correct query key
      queryClient.invalidateQueries({ queryKey: ['fetchAllNotification'] });
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
          allowSound: false,
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
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { saveDeviceTokenMutation } = useNotificationApi();

  // Add effect to refresh token when user changes
  useEffect(() => {
    if (user?.id && permissionGranted) {
      getFCMToken();
    }
  }, [user?.id, permissionGranted]);

  const unsubscribeRefs = useRef({
    onMessage: () => {},
    onOpen: () => {},
    tokenRefresh: () => {},
  });

  const saveDeviceTokenToServer = async (token: string) => {
    try {
      if (user?.id) {
        await saveDeviceTokenMutation.mutateAsync({ userId: user.id, token });
      }
    } catch (error) {
      console.error('Error saving device token to server:', error);
    }
  };

  const getFCMToken = async (): Promise<string | null> => {
    try {
      const fcmToken = await getToken(messaging);
      if (fcmToken) {
        setDeviceToken(fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        await saveDeviceTokenToServer(fcmToken);
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
        if (user?.id) {
          await NotificationServices.saveDeviceToken(user.id, '');
        }
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
        await showForegroundNotification(remoteMessage, queryClient);
      },
    );

    unsubscribeRefs.current.onOpen = messaging.onNotificationOpenedApp(
      async remoteMessage => {
        if (remoteMessage) {
          // Invalidate queries when notification is opened
          queryClient.invalidateQueries({ queryKey: ['fetchAllNotification'] });
        }
      },
    );

    messaging.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        // Invalidate queries when app is opened from notification
        queryClient.invalidateQueries({ queryKey: ['fetchAllNotification'] });
      }
    });

    messaging.setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
        // Invalidate queries when notification is received in background
        queryClient.invalidateQueries({ queryKey: ['fetchAllNotification'] });
      }
    });

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
    permissionGranted,
    requestNotificationPermission: async () => {
      const granted = await requestNotificationPermission();
      setPermissionGranted(granted);
      if (granted) {
        await getFCMToken();
      }
      return granted;
    },
    saveDeviceTokenMutation,
    requestPermission: async () => requestNotificationPermission(),
    refreshToken: async () => getFCMToken(),
    removeToken: async () => removeFCMToken(),
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

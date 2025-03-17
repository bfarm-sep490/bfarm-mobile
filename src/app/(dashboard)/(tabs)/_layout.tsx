import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import {
  homeActiveIcon,
  homeIcon,
  notificationActiveIcon,
  notificationIcon,
  problemActiveIcon,
  problemIcon,
  taskActiveIcon,
  taskIcon,
  todoActiveIcon,
  todoIcon,
} from '@/assets/svg';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: 'green',
      })}
    >
      <Tabs.Screen
        name='home/index'
        options={{
          title: t('home:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? homeActiveIcon : homeIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='problem/index'
        options={{
          title: t('problem:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? problemActiveIcon : problemIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='farmer-tasks/index'
        options={{
          title: t('farmerTask:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? taskActiveIcon : taskIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='farmer-tasks/[id]/index'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='todo/index'
        options={{
          title: t('todo:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? todoActiveIcon : todoIcon}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='notification/index'
        options={{
          title: t('notification:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? notificationActiveIcon : notificationIcon}
            />
          ),
        }}
      />
    </Tabs>
  );
}

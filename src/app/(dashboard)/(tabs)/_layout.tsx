import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import {
  homeActiveIcon,
  homeIcon,
  profileActiveIcon,
  profileIcon,
} from '@/assets/svg';
import {
  harvesting_icon_bw,
  harvesting_icon_colored,
} from '@/assets/svg/harvesting-tasks';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={() => ({
        headerShown: false,
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
        name='news/index'
        options={{
          title: t('profile:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? profileActiveIcon : profileIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='todo/index'
        options={{
          title: t('profile:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? profileActiveIcon : profileIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile/index'
        options={{
          title: t('profile:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? profileActiveIcon : profileIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='harvesting_tasks/index'
        options={{
          title: t('harvesting_tasks:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? harvesting_icon_colored : harvesting_icon_bw}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import {
  homeActiveIcon,
  homeIcon,
  problemActiveIcon,
  problemIcon,
  taskActiveIcon,
  taskIcon,
  todoActiveIcon,
  todoIcon,
} from '@/assets/svg';
import TabBar from '@/components/tab-bar';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tabs.Screen
        name='home/index'
        options={{
          headerShown: false,
          title: t('home:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? homeActiveIcon : homeIcon}
            />
          ),
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />
      <Tabs.Screen
        name='todo/index'
        options={{
          headerShown: false,
          title: t('todo:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? todoActiveIcon : todoIcon}
            />
          ),
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />

      <Tabs.Screen
        name='farmer-tasks/index'
        options={{
          headerShown: false,
          title: t('farmerTask:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? taskActiveIcon : taskIcon}
            />
          ),
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />
      <Tabs.Screen
        name='farmer-tasks/[id]/index'
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name='problem/index'
        options={{
          headerShown: false,
          title: t('problem:title'),
          tabBarIcon: ({ focused }) => (
            <SvgXml
              height={24}
              width={24}
              xml={focused ? problemActiveIcon : problemIcon}
            />
          ),
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />

      <Tabs.Screen
        name='problem/[id]/index'
        options={{
          headerShown: false,
          href: null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name='problem/create/index'
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
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
          title: 'Trang chủ',
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
          title: 'Lịch trình',
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
          title: 'Công việc',
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
          title: 'Vấn đề',
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

import { Tabs } from 'expo-router';

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
      <Tabs.Screen
        name='notification/index'
        options={{
          headerShown: false,
          title: 'Thông báo',
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />
    </Tabs>
  );
}

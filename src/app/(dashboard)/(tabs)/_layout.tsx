import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

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
          title: t('layout:tabs:home'),
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />
      <Tabs.Screen
        name='todo/index'
        options={{
          headerShown: false,
          title: t('layout:tabs:todo'),
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />

      <Tabs.Screen
        name='farmer-tasks/index'
        options={{
          headerShown: false,
          title: t('layout:tabs:farmerTasks'),
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
          title: t('layout:tabs:problem'),
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
          title: t('layout:tabs:notification'),
          tabBarStyle: {
            display: 'flex',
          },
        }}
      />
    </Tabs>
  );
}

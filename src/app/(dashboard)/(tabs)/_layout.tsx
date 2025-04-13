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
    <Tabs tabBar={props => <TabBar {...props} />}>
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
        name='problem/[id]/index'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='problem/create/index'
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
    </Tabs>
  );
}

import React from 'react';

import { StyleSheet } from 'react-native';

import { NavigationState, Route } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useSession } from '@/context/ctx';
import { useNotification } from '@/services/api/notifications/useNotification';

import TabBarButton from './tab-bar-button';

const TabBar = ({
  state,
  descriptors,
  navigation,
}: {
  state: NavigationState;
  descriptors: any;
  navigation: any;
}) => {
  const { user } = useSession();
  const { useFetchAllByUserIdQuery } = useNotification();
  const query = user?.id ? useFetchAllByUserIdQuery(user.id) : null;
  const notifications = query?.data?.data ?? [];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const primaryColor = '#0891b2';
  const greyColor = '#737373';

  // Check if current route is a detail page
  const isDetailPage =
    state.routes[state.index].name.includes('[id]') ||
    state.routes[state.index].name.includes('create');

  // If it's a detail page, don't render the tab bar
  if (isDetailPage) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.tabbar}>
      {state.routes.map((route: Route<string>, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (
          ['_sitemap', '+not-found'].includes(route.name) ||
          route.name.includes('[id]') ||
          route.name.includes('create')
        )
          return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label}
            badgeCount={route.name === 'notification/index' ? unreadCount : 0}
          />
        );

        // return (
        //   <TouchableOpacity
        //     key={route.name}
        //     style={styles.tabbarItem}
        //     accessibilityRole="button"
        //     accessibilityState={isFocused ? { selected: true } : {}}
        //     accessibilityLabel={options.tabBarAccessibilityLabel}
        //     testID={options.tabBarTestID}
        //     onPress={onPress}
        //     onLongPress={onLongPress}
        //   >
        //     {
        //         icons[route.name]({
        //             color: isFocused? primaryColor: greyColor
        //         })
        //     }
        //     <Text style={{
        //         color: isFocused ? primaryColor : greyColor,
        //         fontSize: 11
        //     }}>
        //       {label}
        //     </Text>
        //   </TouchableOpacity>
        // );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: 'green',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 5,
  },
});

export default TabBar;

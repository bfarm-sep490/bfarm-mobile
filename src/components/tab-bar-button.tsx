import React, { useEffect } from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
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
import { Text } from '@/components/ui/text';

interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  onPress: () => void;
  onLongPress: () => void;
  badgeCount?: number;
}

const getIcon = (routeName: string, focused: boolean) => {
  switch (routeName) {
    case 'home/index':
      return focused ? homeActiveIcon : homeIcon;
    case 'problem/index':
      return focused ? problemActiveIcon : problemIcon;
    case 'farmer-tasks/index':
      return focused ? taskActiveIcon : taskIcon;
    case 'todo/index':
      return focused ? todoActiveIcon : todoIcon;
    case 'notification/index':
      return focused ? notificationActiveIcon : notificationIcon;
    default:
      return null;
  }
};

const TabBarButton = (props: TabBarButtonProps) => {
  const { isFocused, label, routeName, color, badgeCount = 0 } = props;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 12,
      stiffness: 100,
    });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, -5]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [0.7, 1]);
    const translateY = interpolate(scale.value, [0, 1], [5, 0]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const icon = getIcon(routeName, isFocused);

  return (
    <Pressable {...props} style={styles.container}>
      <View>
        <Animated.View style={[animatedIconStyle]}>
          {icon && <SvgXml height={24} width={24} xml={icon} />}
        </Animated.View>
        {badgeCount > 0 && routeName === 'notification/index' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>

      <Animated.Text style={[styles.label, { color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TabBarButton;

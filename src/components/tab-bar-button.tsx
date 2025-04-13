import React, { useEffect } from 'react';

import { Pressable, StyleSheet } from 'react-native';

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
  problemActiveIcon,
  problemIcon,
  taskActiveIcon,
  taskIcon,
  todoActiveIcon,
  todoIcon,
} from '@/assets/svg';

interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  onPress: () => void;
  onLongPress: () => void;
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
    default:
      return null;
  }
};

const TabBarButton = (props: TabBarButtonProps) => {
  const { isFocused, label, routeName, color } = props;

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
      <Animated.View style={[animatedIconStyle]}>
        {icon && <SvgXml height={24} width={24} xml={icon} />}
      </Animated.View>

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
});

export default TabBarButton;

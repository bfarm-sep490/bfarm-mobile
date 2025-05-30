import { useEffect } from 'react';

import type { DimensionValue, ViewProps } from 'react-native';
import { View, StyleSheet, useColorScheme } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  height?: DimensionValue;
  loading?: boolean;
  width?: DimensionValue;
} & ViewProps;

const FROM = 0.2;
const TO = 1;

function SkeletonLoader({
  children,
  height = 24,
  loading = false,
  width = '100%',
  ...props
}: Props) {
  const opacity = useSharedValue(FROM);
  const colorScheme = useColorScheme() ?? 'light';

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (loading) {
      opacity.value = withRepeat(withTiming(TO, { duration: 800 }), -1, true);
    } else {
      opacity.value = FROM;
    }
  }, [loading]);

  return (
    <View
      {...props}
      style={[{ minHeight: height, minWidth: width }, props.style]}
    >
      {loading ? (
        <Animated.View
          style={[
            animatedStyles,
            styles.skeleton,
            colorScheme === 'dark' && styles.skeletonDark,
            {
              height,
              width,
            },
            props.style,
          ]}
          testID='skeleton-loader'
        />
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonDark: {
    backgroundColor: '#374151',
  },
});

export default SkeletonLoader;

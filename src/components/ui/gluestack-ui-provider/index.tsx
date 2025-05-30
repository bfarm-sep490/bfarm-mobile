import React from 'react';

import { ColorSchemeName, useColorScheme, View, ViewProps } from 'react-native';

import { colorScheme as colorSchemeNW } from 'nativewind';
import ToastManager from 'toastify-react-native/components/ToastManager';

import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';

import { config } from './config';

type ModeType = 'light' | 'dark' | 'system';

const getColorSchemeName = (
  colorScheme: ColorSchemeName,
  mode: ModeType,
): 'light' | 'dark' => {
  if (mode === 'system') {
    return colorScheme ?? 'light';
  }
  return mode;
};

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: 'light' | 'dark' | 'system';
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const colorScheme = useColorScheme();

  const colorSchemeName = getColorSchemeName(colorScheme, mode);

  colorSchemeNW.set(mode);

  return (
    <View
      style={[
        config[colorSchemeName],
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
    >
      <ToastManager />
      <OverlayProvider>{props.children}</OverlayProvider>
    </View>
  );
}

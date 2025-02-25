'use client';
import React from 'react';

import { ImageBackground as RNImageBackground } from 'react-native';

import { tva } from '@gluestack-ui/nativewind-utils/tva';

const imageBackgroundStyle = tva({});

export const ImageBackground = React.forwardRef<
  React.ElementRef<typeof RNImageBackground>,
  React.ComponentProps<typeof RNImageBackground>
>(({ className, ...props }, ref) => {
  return (
    <RNImageBackground
      className={imageBackgroundStyle({
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

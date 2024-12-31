'use client';
import React from 'react';

import { cssInterop } from 'nativewind';

import { Overlay } from '@gluestack-ui/overlay';

cssInterop(Overlay, { className: 'style' });

export const Portal = React.forwardRef<
  React.ElementRef<typeof Overlay>,
  React.ComponentProps<typeof Overlay>
>(({ ...props }: React.ComponentProps<typeof Overlay>, ref) => {
  return <Overlay {...props} ref={ref} />;
});

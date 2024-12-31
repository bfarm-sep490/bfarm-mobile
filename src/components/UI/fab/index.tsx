'use client';
import React from 'react';

import { Pressable, Text } from 'react-native';

import { cssInterop } from 'nativewind';

import { createFab } from '@gluestack-ui/fab';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';

const SCOPE = 'FAB';
const Root = withStyleContext(Pressable, SCOPE);
const UIFab = createFab({
  Root,
  Label: Text,
  Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

const fabStyle = tva({
  base: 'group/fab disabled:pointer-events-all absolute z-20 flex-row items-center justify-center rounded-full bg-primary-500 p-4 shadow-hard-2 hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 data-[focus=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-indicator-info',
  variants: {
    size: {
      sm: 'px-2.5 py-2.5',
      md: 'px-3 py-3',
      lg: 'px-4 py-4',
    },
    placement: {
      'top right': 'right-4 top-4',
      'top left': 'left-4 top-4',
      'bottom right': 'bottom-4 right-4',
      'bottom left': 'bottom-4 left-4',
      'top center': 'top-4 self-center',
      'bottom center': 'bottom-4 self-center',
    },
  },
});

const fabLabelStyle = tva({
  base: 'font-body tracking-md mx-2 text-left font-normal text-typography-50',
  variants: {
    isTruncated: {
      true: '',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      '2xs': 'text-2xs',
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
    sub: {
      true: 'text-xs',
    },
    italic: {
      true: 'italic',
    },
    highlight: {
      true: 'bg-yellow-500',
    },
  },
  parentVariants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
});

const fabIconStyle = tva({
  base: 'fill-none text-typography-50',
  variants: {
    size: {
      '2xs': 'h-3 w-3',
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-[18px] w-[18px]',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    },
  },
});

type IFabProps = Omit<React.ComponentPropsWithoutRef<typeof UIFab>, 'context'> &
  VariantProps<typeof fabStyle>;

const Fab = React.forwardRef<React.ElementRef<typeof UIFab>, IFabProps>(
  ({ size = 'md', placement = 'bottom right', className, ...props }, ref) => {
    return (
      <UIFab
        ref={ref}
        {...props}
        className={fabStyle({ size, placement, class: className })}
        context={{ size }}
      />
    );
  },
);

type IFabLabelProps = React.ComponentPropsWithoutRef<typeof UIFab.Label> &
  VariantProps<typeof fabLabelStyle>;

const FabLabel = React.forwardRef<
  React.ElementRef<typeof UIFab.Label>,
  IFabLabelProps
>(
  (
    {
      size,
      isTruncated = false,
      bold = false,
      underline = false,
      strikeThrough = false,
      className,
      ...props
    },
    ref,
  ) => {
    const { size: parentSize } = useStyleContext(SCOPE);
    return (
      <UIFab.Label
        ref={ref}
        {...props}
        className={fabLabelStyle({
          parentVariants: {
            size: parentSize,
          },
          size,
          isTruncated,
          bold,
          underline,
          strikeThrough,
          class: className,
        })}
      />
    );
  },
);

type IFabIconProps = React.ComponentPropsWithoutRef<typeof UIFab.Icon> &
  VariantProps<typeof fabIconStyle> & {
    height?: number;
    width?: number;
  };

const FabIcon = React.forwardRef<
  React.ElementRef<typeof UIFab.Icon>,
  IFabIconProps
>(({ size, className, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return (
      <UIFab.Icon
        ref={ref}
        {...props}
        className={fabIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIFab.Icon
        ref={ref}
        {...props}
        className={fabIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIFab.Icon
      ref={ref}
      {...props}
      className={fabIconStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
    />
  );
});

Fab.displayName = 'Fab';
FabLabel.displayName = 'FabLabel';
FabIcon.displayName = 'FabIcon';

export { Fab, FabLabel, FabIcon };
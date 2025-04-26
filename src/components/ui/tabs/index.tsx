import React from 'react';

import { Pressable, View } from 'react-native';

import { tva } from '@gluestack-ui/nativewind-utils/tva';

import { HStack } from '../hstack';
import { Text } from '../text';

const tabsStyle = tva({
  base: 'flex-row items-center justify-center space-x-2',
});

const tabStyle = tva({
  base: 'rounded-lg px-4 py-2',
  variants: {
    isActive: {
      true: 'bg-primary-100',
      false: 'bg-transparent',
    },
  },
});

const tabTextStyle = tva({
  base: 'text-sm font-medium',
  variants: {
    isActive: {
      true: 'text-primary-600',
      false: 'text-typography-500',
    },
  },
});

type TabItem = {
  label: string;
  value: string;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const Tabs = ({ items, value, onChange, className }: TabsProps) => {
  return (
    <HStack className={tabsStyle({ class: className })}>
      {items.map(item => (
        <Pressable
          key={item.value}
          onPress={() => onChange(item.value)}
          className={tabStyle({ isActive: value === item.value })}
        >
          <Text className={tabTextStyle({ isActive: value === item.value })}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
};

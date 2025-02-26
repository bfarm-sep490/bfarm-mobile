import React from 'react';

import { Pressable } from 'react-native';

import { useRouter } from 'expo-router';
import { Bell, ChevronLeft, Settings } from 'lucide-react-native';

import { HStack, Text } from '@/components/ui';

interface MobileHeaderProps {
  title: string;
  showNotifications?: boolean;
  onSettingsPress?: () => void;
  onNotificationPress?: () => void;
}

const MobileHeader = ({
  title,
  showNotifications = true,
  onSettingsPress,
  onNotificationPress,
}: MobileHeaderProps) => {
  const router = useRouter();

  return (
    <HStack
      className='fixed top-0 z-50 w-full items-center justify-between bg-white px-4 py-3 shadow-sm'
      space='md'
    >
      <HStack className='flex-1 items-center' space='sm'>
        <Pressable
          onPress={() => router.back()}
          className='rounded-full p-2 transition-colors hover:bg-gray-100 active:bg-gray-200'
        >
          <ChevronLeft className='text-gray-700' size={24} />
        </Pressable>
        <Text className='flex-1 truncate text-xl font-semibold text-gray-800'>
          {title}
        </Text>
      </HStack>

      <HStack className='items-center' space='md'>
        {showNotifications && (
          <Pressable
            onPress={onNotificationPress}
            className='rounded-full p-2 transition-colors hover:bg-gray-100 active:bg-gray-200'
          >
            <Bell className='text-gray-700' size={20} />
          </Pressable>
        )}
        <Pressable
          onPress={onSettingsPress}
          className='rounded-full p-2 transition-colors hover:bg-gray-100 active:bg-gray-200'
        >
          <Settings className='text-gray-700' size={20} />
        </Pressable>
      </HStack>
    </HStack>
  );
};

export default MobileHeader;

import React, { useState } from 'react';

import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  NewspaperIcon,
  type LucideIcon,
} from 'lucide-react-native';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import { Divider, Spinner } from '@/components/ui';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import {
  ChevronLeftIcon,
  DownloadIcon,
  Icon,
  MenuIcon,
  SearchIcon,
} from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { useNotification } from '@/services/api/notifications/useNotification';

const MainContent = () => {
  const { user } = useSession();
  const { useFetchAllByUserIdQuery } = useNotification();
  const query = user?.id ? useFetchAllByUserIdQuery(user.id) : null;
  const { data, isLoading, isError, error } = query || {};
  const notifications = data?.data || [];
  const handleRefresh = () => {
    query?.refetch();
  };
  console.log(error);

  return (
    <VStack
      className='mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6'
      space='2xl'
    >
      <HStack space='2xl' className='h-full w-full flex-1'>
        <ScrollView
          className='max-w-[900px] flex-1 md:mb-2'
          contentContainerStyle={{
            paddingBottom: isWeb ? 0 : 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <VStack className='items-center justify-center py-10'>
              <Spinner size='large' color='$primary600' />
              <Text className='mt-4 text-center text-typography-500'>
                Đang tải dữ liệu...
              </Text>
            </VStack>
          )}
          {isError && (
            <HStack space='2xl' className='h-full w-full flex-1'>
              <VStack className='flex-1 items-center justify-center py-10'>
                <Box className='bg-danger-100 mb-4 rounded-full p-4'>
                  <Icon
                    as={AlertCircle}
                    size='xl'
                    className='text-danger-600'
                  />
                </Box>
                <Text className='text-center text-typography-500'>
                  Có lỗi xảy ra khi tải dữ liệu
                </Text>
                <Button className='mt-4' onPress={handleRefresh}>
                  <ButtonText>Thử lại</ButtonText>
                </Button>
              </VStack>
            </HStack>
          )}
          {!isError && (
            <VStack className='w-full' space='2xl'>
              {notifications.map((item, index) => {
                return (
                  <VStack key={index}>
                    <VStack className='p-3' space='md'>
                      <VStack
                        className={'flex-row items-center justify-between'}
                      >
                        <Heading size='md'>{item.title}</Heading>
                        <Text className='text-sm'>
                          {dayjs(item.created_date).format('hh:mm DD/MM/YYYY')}
                        </Text>
                      </VStack>
                      <Text className='line-clamp-2'>{item.message}</Text>
                    </VStack>
                    <Divider />
                  </VStack>
                );
              })}
            </VStack>
          )}
        </ScrollView>
      </HStack>
    </VStack>
  );
};
const Notification = () => {
  const { user } = useSession();
  const { useFetchAllByUserIdQuery } = useNotification();
  const query = user?.id ? useFetchAllByUserIdQuery(user.id) : null;
  const { data, isLoading, isError, error } = query || {};
  const notifications = data?.data || [];
  const handleRefresh = () => {
    query?.refetch();
  };
  return (
    <SafeAreaView className='h-full w-full bg-background-0'>
      <Box className='px-4 py-4'>
        <HStack className='items-center justify-between'>
          <HStack space='md' className='items-center'>
            <Heading size='lg'>Thông báo</Heading>
          </HStack>
        </HStack>
      </Box>
      <Divider />
      <MainContent />
    </SafeAreaView>
  );
};

export default Notification;

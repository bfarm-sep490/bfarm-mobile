import React, { useState } from 'react';

import { TouchableOpacity } from 'react-native';

import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  NewspaperIcon,
  RefreshCw,
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

type NotificationCardProps = {
  id: number;
  title: string;
  message: string;
  created_date: string;
};
const NotificationCard = ({
  id,
  title,
  message,
  created_date,
}: NotificationCardProps) => {
  return (
    <VStack key={`message_${id}`} className='bg-white p-4' space='md'>
      <VStack className='flex-row items-center justify-between'>
        <Heading size='md' className='font-bold text-primary-600'>
          {title}
        </Heading>
        <Text className='text-sm text-gray-500'>
          <Icon as={Calendar} size='xs' className='text-typography-500' />{' '}
          {dayjs(created_date).format('hh:mm DD/MM/YYYY')}
        </Text>
      </VStack>
      <Text className='line-clamp-3 text-gray-600'>{message}</Text>
      <Divider />
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
          <HStack space='md' className='flex-row items-center justify-between'>
            <Heading size='lg'>Thông báo</Heading>
          </HStack>
          <TouchableOpacity onPress={handleRefresh}>
            <Icon as={RefreshCw} size='lg' />
          </TouchableOpacity>
        </HStack>
      </Box>
      <Divider />
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
                <Icon as={AlertCircle} size='xl' className='text-danger-600' />
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
        {!isError && notifications.length > 0 && (
          <VStack className='w-full' space='2xl'>
            {notifications.map((item, index) => {
              return (
                <NotificationCard
                  key={`message_${item.id}_${index}`}
                  id={item?.id}
                  title={item?.title}
                  message={item?.message ?? ''}
                  created_date={item?.created_date}
                />
              );
            })}
          </VStack>
        )}
        {!isLoading && !isError && notifications?.length === 0 && (
          <VStack className='w-full items-center justify-center'>
            <Icon as={AlertTriangle} size='lg' className='mb-2 text-gray-500' />
            <Text className='text-center text-sm text-gray-600'>
              Không có dữ liệu
            </Text>
          </VStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;

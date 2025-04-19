import React, { useCallback, useState } from 'react';

import { RefreshControl } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react-native';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spinner } from '@/components/ui/spinner';
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
    <Box className='mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white'>
      <VStack className='p-4' space='md'>
        <HStack className='items-center justify-between'>
          <Heading size='md' className='font-bold text-primary-600'>
            {title}
          </Heading>
          <HStack space='xs' className='items-center'>
            <Icon as={Calendar} size='xs' className='text-typography-500' />
            <Text className='text-sm text-typography-500'>
              {dayjs(created_date).format('hh:mm DD/MM/YYYY')}
            </Text>
          </HStack>
        </HStack>
        <Text className='text-typography-600'>{message}</Text>
      </VStack>
    </Box>
  );
};

const Notification = () => {
  const router = useRouter();
  const { user } = useSession();
  const { useFetchAllByUserIdQuery } = useNotification();
  const query = user?.id ? useFetchAllByUserIdQuery(user.id) : null;
  const { data, isLoading, isError, error } = query || {};
  const notifications = data?.data || [];
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await query?.refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [query]);

  const handleBack = () => {
    router.back();
  };

  const renderEmptyState = () => (
    <VStack className='items-center justify-center py-10'>
      <Box className='mb-4 rounded-full bg-warning-100 p-4'>
        <Icon as={AlertTriangle} size='xl' className='text-warning-600' />
      </Box>
      <Text className='text-center text-typography-500'>
        Không có thông báo nào
      </Text>
    </VStack>
  );

  const renderErrorState = () => (
    <VStack className='items-center justify-center py-10'>
      <Box className='bg-danger-100 mb-4 rounded-full p-4'>
        <Icon as={AlertCircle} size='xl' className='text-danger-600' />
      </Box>
      <Text className='mb-4 text-center text-typography-500'>
        Có lỗi xảy ra khi tải dữ liệu
      </Text>
      <Button onPress={handleRefresh}>
        <ButtonText>Thử lại</ButtonText>
      </Button>
    </VStack>
  );

  const renderLoadingState = () => (
    <VStack className='items-center justify-center py-10'>
      <Box className='mb-4 rounded-full bg-primary-100 p-4'>
        <Spinner size='large' color='$primary600' />
      </Box>
      <Text className='text-center text-typography-500'>
        Đang tải dữ liệu...
      </Text>
    </VStack>
  );

  return (
    <SafeAreaView className='h-full w-full bg-background-0'>
      <Box className='px-4 py-4'>
        <HStack className='items-center space-x-4'>
          <Pressable
            onPress={handleBack}
            className='rounded-full bg-primary-50 p-2'
          >
            <Icon as={ChevronLeft} size='lg' className='text-primary-600' />
          </Pressable>
          <Heading size='lg'>Thông báo</Heading>
        </HStack>
      </Box>

      <Box className='flex-1 px-4'>
        {isLoading ? (
          renderLoadingState()
        ) : isError ? (
          renderErrorState()
        ) : notifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlashList
            data={notifications}
            renderItem={({ item }) => (
              <NotificationCard
                id={item.id}
                title={item.title}
                message={item.message ?? ''}
                created_date={item.created_date}
              />
            )}
            estimatedItemSize={120}
            keyExtractor={item => `notification_${item.id}`}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#4F46E5']}
                tintColor='#4F46E5'
                progressViewOffset={20}
              />
            }
            contentContainerStyle={{
              paddingBottom: isWeb ? 0 : 140,
            }}
          />
        )}
      </Box>
    </SafeAreaView>
  );
};

export default Notification;

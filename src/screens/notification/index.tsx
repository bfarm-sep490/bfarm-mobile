import React, { useCallback, useState } from 'react';

import { RefreshControl } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  Clock,
  MoreHorizontal,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import { Pressable } from '@/components/ui';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spinner } from '@/components/ui/spinner';
import { Tabs } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { useNotification } from '@/services/api/notifications/useNotification';

import { formatRelativeTime } from '../../utils/formatTime';

type NotificationCardProps = {
  id: number;
  title: string;
  message: string;
  created_date: string;
  is_read: boolean;
  image?: string;
  onPress: () => void;
};

const NotificationCard = ({
  id,
  title,
  message,
  created_date,
  is_read,
  image,
  onPress,
}: NotificationCardProps) => {
  const { t } = useTranslation();
  const [showFullMessage, setShowFullMessage] = useState(false);

  return (
    <Pressable onPress={onPress}>
      <Box
        className={`mb-1 overflow-hidden ${is_read ? 'bg-white' : 'bg-primary-50'}`}
      >
        <HStack className='p-3' space='md'>
          {image ? (
            <Image
              source={{ uri: image }}
              className='h-12 w-12 rounded-full'
              alt={title}
            />
          ) : (
            <Box className='h-12 w-12 items-center justify-center rounded-full bg-primary-100'>
              <Icon as={Bell} size='lg' className='text-primary-600' />
            </Box>
          )}
          <VStack className='flex-1' space='xs'>
            <HStack className='items-center justify-between'>
              <Text
                className='flex-1 text-sm font-medium text-typography-900'
                numberOfLines={2}
              >
                {title}
              </Text>
              <Icon
                as={MoreHorizontal}
                size='sm'
                className='text-typography-400'
              />
            </HStack>
            <Pressable onPress={() => setShowFullMessage(!showFullMessage)}>
              <Text
                className='text-sm text-typography-600'
                numberOfLines={showFullMessage ? undefined : 2}
              >
                {message}
              </Text>
              {message.length > 100 && (
                <Text className='mt-1 text-xs text-primary-600'>
                  {showFullMessage
                    ? t('notification:notification:showLess')
                    : t('notification:notification:showMore')}
                </Text>
              )}
            </Pressable>
            <HStack space='xs' className='items-center'>
              <Icon as={Clock} size='xs' className='text-typography-400' />
              <Text className='text-xs text-typography-400'>
                {formatRelativeTime(created_date)}
              </Text>
            </HStack>
          </VStack>
          {!is_read && (
            <Box className='absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-600' />
          )}
        </HStack>
      </Box>
    </Pressable>
  );
};

const Notification = () => {
  const { t } = useTranslation();
  const { user } = useSession();
  const {
    useFetchAllByUserIdQuery,
    markAsReadMutation,
    markAllAsReadMutation,
  } = useNotification();
  const query = user?.id ? useFetchAllByUserIdQuery(user.id) : null;
  const { data, isLoading, isError } = query ?? {};
  const notifications = data?.data ?? [];
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await query?.refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [query]);

  const handleMarkAsRead = useCallback(
    (id: number, is_read: boolean) => {
      if (!is_read) {
        markAsReadMutation.mutate(id);
      }
    },
    [markAsReadMutation],
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (user?.id) {
      markAllAsReadMutation.mutate(user.id);
    }
  }, [markAllAsReadMutation, user?.id]);

  const filteredNotifications = notifications.filter(notification =>
    activeTab === 'all' ? true : !notification.is_read,
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const renderEmptyState = () => (
    <VStack className='items-center justify-center py-10'>
      <Box className='mb-4 rounded-full bg-warning-100 p-4'>
        <Icon as={AlertTriangle} size='xl' className='text-warning-600' />
      </Box>
      <Text className='text-center text-typography-500'>
        {activeTab === 'all'
          ? t('notification:emptyState:all')
          : t('notification:emptyState:unread')}
      </Text>
    </VStack>
  );

  const renderErrorState = () => (
    <VStack className='items-center justify-center py-10'>
      <Box className='bg-danger-100 mb-4 rounded-full p-4'>
        <Icon as={AlertCircle} size='xl' className='text-danger-600' />
      </Box>
      <Text className='mb-4 text-center text-typography-500'>
        {t('notification:error:title')}
      </Text>
      <Button onPress={handleRefresh}>
        <ButtonText>{t('notification:error:tryAgain')}</ButtonText>
      </Button>
    </VStack>
  );

  const renderLoadingState = () => (
    <VStack className='items-center justify-center py-10'>
      <Box className='mb-4 rounded-full bg-primary-100 p-4'>
        <Spinner size='large' color='$primary600' />
      </Box>
      <Text className='text-center text-typography-500'>
        {t('notification:loading')}
      </Text>
    </VStack>
  );

  return (
    <SafeAreaView className='h-full w-full bg-background-0'>
      <Box className='px-4 py-4'>
        <HStack className='items-center justify-between'>
          <HStack className='items-center space-x-4'>
            <Heading size='lg'>{t('notification:title')}</Heading>
          </HStack>
        </HStack>
      </Box>

      <Box className='px-4 py-2'>
        <Tabs
          items={[
            { label: t('notification:tabs:all'), value: 'all' },
            { label: t('notification:tabs:unread'), value: 'unread' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </Box>

      {activeTab === 'unread' && unreadCount > 0 && (
        <Box className='px-4 py-2'>
          <Button
            variant='outline'
            size='sm'
            onPress={handleMarkAllAsRead}
            className='flex-row items-center space-x-1'
          >
            <Icon as={Check} size='sm' className='text-primary-600' />
            <ButtonText className='text-primary-600'>
              {t('notification:markAllAsRead')}
            </ButtonText>
          </Button>
        </Box>
      )}

      <Box className='flex-1'>
        {isLoading ? (
          renderLoadingState()
        ) : isError ? (
          renderErrorState()
        ) : filteredNotifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlashList
            data={filteredNotifications}
            renderItem={({ item }) => (
              <NotificationCard
                id={item.id}
                title={item.title}
                message={item.message ?? ''}
                created_date={item.created_date}
                is_read={item.is_read}
                image={item.image ?? undefined}
                onPress={() => handleMarkAsRead(item.id, item.is_read)}
              />
            )}
            estimatedItemSize={100}
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

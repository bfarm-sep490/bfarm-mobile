import React, { useState } from 'react';

import { Image } from 'react-native';

import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  Check,
  Leaf,
  Droplets,
  PackageOpen,
  Scissors,
  Shovel,
  Box,
  ShoppingBag,
  Settings,
  Info,
  MapPin,
  MoreVertical,
} from 'lucide-react-native';

import CompleteTaskModal from '@/components/modal/CompleteTaskModal';
import { Box as BoxUI } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

// Helper function to get icon based on task type
const getTaskTypeIcon = (taskType: string) => {
  switch (taskType) {
    case 'Spraying':
      return Shovel;
    case 'Watering':
      return Droplets;
    case 'Harvesting':
      return Scissors;
    case 'Packaging':
      return PackageOpen;
    case 'Setup':
      return Settings;
    case 'Fertilizing':
      return ShoppingBag;
    default:
      return Leaf;
  }
};

// Helper function to get task status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Complete':
      return {
        bg: 'bg-success-100',
        text: 'text-success-700',
        icon: CheckCircle2,
      };
    case 'Completed':
      return {
        bg: 'bg-success-100',
        text: 'text-success-700',
        icon: CheckCircle2,
      };
    case 'Cancel':
      return { bg: 'bg-danger-100', text: 'text-danger-700', icon: XCircle };
    case 'Ongoing':
      return { bg: 'bg-primary-100', text: 'text-primary-700', icon: Clock };
    case 'Pending':
      return {
        bg: 'bg-warning-100',
        text: 'text-warning-700',
        icon: AlertCircle,
      };
    default:
      return {
        bg: 'bg-typography-100',
        text: 'text-typography-700',
        icon: Info,
      };
  }
};

// Item Card Component
const ItemCard = ({
  item,
  type = 'tool',
}: {
  item: { id: number; item_id: number; quantity: number; unit: string };
  type?: 'tool' | 'fertilizer' | 'pesticide';
}) => {
  let icon = Box;
  let bgColor = 'bg-typography-100';
  let textColor = 'text-typography-700';

  switch (type) {
    case 'tool':
      icon = Settings;
      bgColor = 'bg-primary-100';
      textColor = 'text-primary-700';
      break;
    case 'fertilizer':
      icon = ShoppingBag;
      bgColor = 'bg-success-100';
      textColor = 'text-success-700';
      break;
    case 'pesticide':
      icon = Shovel;
      bgColor = 'bg-warning-100';
      textColor = 'text-warning-700';
      break;
  }

  return (
    <HStack className='mb-2 items-center rounded-lg border border-typography-200 p-3'>
      <BoxUI className={`mr-3 rounded-lg p-2 ${bgColor}`}>
        <Icon as={icon} size='sm' className={textColor} />
      </BoxUI>
      <VStack>
        <Text className='font-medium'>Công cụ #{item.item_id}</Text>
        <Text className='text-xs text-typography-500'>
          Số lượng: {item.quantity} {item.unit}
        </Text>
      </VStack>
    </HStack>
  );
};

// Mock data for demo
const mockTaskDetail = {
  id: 4,
  plan_id: 2,
  farmer_information: [
    {
      farmer_id: 3,
      status: 'Completed',
    },
  ],
  problem_id: 4,
  task_name: 'Lắp hệ thống tưới tự động',
  description:
    'Thiết lập hệ thống tưới nhỏ giọt giúp cây nhận đủ nước mà không gây lãng phí. Hệ thống này sẽ giúp tiết kiệm nước, giảm công sức chăm sóc và đảm bảo cây trồng luôn được cung cấp đủ nước đều đặn.',
  result_content: null,
  task_type: 'Setup',
  start_date: '2025-02-15T00:00:00',
  end_date: '2025-02-18T00:00:00',
  complete_date: '2025-02-20T00:00:00',
  status: 'Ongoing',
  create_at: '2025-03-15T17:18:36',
  create_by: 'thangbinhbeo',
  update_at: null,
  update_by: null,
  care_images: [
    {
      id: 5,
      task_id: 4,
      url: 'https://danviet.ex-cdn.com/files/f1/296231569849192448/2022/5/13/edit-z3411936151630efaace430e503df8e6a548a064ff5839-1652436512592542646364-1652440184006468269746.jpeg',
    },
  ],
  care_pesticides: [],
  care_fertilizers: [],
  care_items: [
    {
      id: 7,
      item_id: 4,
      task_id: 4,
      quantity: 1,
      unit: 'Cái',
    },
    {
      id: 8,
      item_id: 5,
      task_id: 4,
      quantity: 2,
      unit: 'Bộ',
    },
  ],
  location: 'Khu vực B, Cánh đồng Tân Lập',
  notes:
    'Lưu ý kiểm tra áp lực nước trước khi lắp đặt. Đảm bảo vòi phun được đặt đúng vị trí.',
};

export const TaskDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.id;
  const taskType = params.type || 'caring';

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const task = mockTaskDetail;
  const TaskIcon = getTaskTypeIcon(task.task_type);
  const statusStyle = getStatusColor(task.status);

  // Check if task has images
  let images: string | any[] = [];
  if (taskType === 'caring' && task.care_images) {
    images = task.care_images;
  } else if (taskType === 'harvesting' && task.care_images) {
    images = task.care_images;
  } else if (taskType === 'packaging' && task.care_images) {
    images = task.care_images;
  }

  // Check if task has items
  let items: any[] = [];
  if (taskType === 'caring' && task.care_items) {
    items = task.care_items;
  } else if (taskType === 'harvesting' && task.care_images) {
    items = task.care_images;
  } else if (taskType === 'packaging' && task.care_images) {
    items = task.care_images;
  }

  // Handle task completion
  const handleCompleteTask = ({
    resultContent,
    images,
  }: {
    resultContent: string;
    images: any;
  }) => {
    console.log('Complete task with result:', resultContent);
    console.log('Images:', images);

    // In a real app, you would upload the images and send the data to your API
  };

  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      {/* Header */}
      <BoxUI className='px-4 py-4'>
        <HStack className='items-center justify-between'>
          <HStack space='md' className='items-center'>
            <Pressable onPress={() => router.back()}>
              <Icon as={ArrowLeft} />
            </Pressable>
            <Heading size='md'>Chi tiết nhiệm vụ</Heading>
          </HStack>
          <Pressable
            className='rounded-full bg-primary-700 p-2'
            onPress={() => setShowOptions(true)}
          >
            <Icon as={MoreVertical} size='sm' color='white' />
          </Pressable>
        </HStack>
      </BoxUI>

      {/* Task content */}
      <ScrollView className='flex-1'>
        {/* Task info card */}
        <Card className='overflow-hidden rounded-xl'>
          <BoxUI>
            <VStack space='md'>
              {/* Task header with status */}
              <HStack className='items-center justify-between'>
                <HStack space='sm' className='items-center'>
                  <BoxUI
                    className={`rounded-lg p-2 ${task.task_type ? 'bg-primary-100' : 'bg-typography-100'}`}
                  >
                    <Icon
                      as={TaskIcon}
                      size='sm'
                      className='text-primary-700'
                    />
                  </BoxUI>
                  <VStack>
                    <Text className='text-lg font-bold'>{task.task_name}</Text>
                    <Text className='text-xs text-typography-500'>
                      {task.task_type ||
                        (taskType === 'harvesting' ? 'Thu hoạch' : 'Đóng gói')}
                    </Text>
                  </VStack>
                </HStack>
                <BoxUI className={`rounded-full px-3 py-1 ${statusStyle.bg}`}>
                  <HStack space='xs' className='items-center'>
                    <Icon
                      as={statusStyle.icon}
                      size='xs'
                      className={statusStyle.text}
                    />
                    <Text className={`text-xs font-medium ${statusStyle.text}`}>
                      {task.status}
                    </Text>
                  </HStack>
                </BoxUI>
              </HStack>

              <Divider />

              {/* Task details */}
              <VStack space='sm'>
                <Text className='font-semibold'>Mô tả</Text>
                <Text className='text-sm text-typography-700'>
                  {task.description}
                </Text>

                {task.result_content && (
                  <>
                    <Text className='mt-2 font-semibold'>Kết quả</Text>
                    <BoxUI className='rounded-lg border border-success-200 bg-success-50 p-3'>
                      <Text className='text-sm text-success-800'>
                        {task.result_content}
                      </Text>
                    </BoxUI>
                  </>
                )}

                {task.notes && (
                  <>
                    <Text className='mt-2 font-semibold'>Ghi chú</Text>
                    <BoxUI className='rounded-lg border border-warning-200 bg-warning-50 p-3'>
                      <Text className='text-sm text-warning-800'>
                        {task.notes}
                      </Text>
                    </BoxUI>
                  </>
                )}
              </VStack>

              {/* Time information */}
              <Card className='rounded-lg bg-typography-50 p-3'>
                <VStack space='sm'>
                  <HStack className='items-center justify-between'>
                    <HStack space='sm' className='items-center'>
                      <Icon
                        as={Calendar}
                        size='sm'
                        className='text-typography-500'
                      />
                      <Text className='text-sm text-typography-700'>
                        Thời gian
                      </Text>
                    </HStack>
                    <Text className='text-sm font-medium'>
                      {dayjs(task.start_date).format('DD/MM/YYYY')} -{' '}
                      {dayjs(task.end_date).format('DD/MM/YYYY')}
                    </Text>
                  </HStack>

                  {task.location && (
                    <HStack className='items-center justify-between'>
                      <HStack space='sm' className='items-center'>
                        <Icon
                          as={MapPin}
                          size='sm'
                          className='text-typography-500'
                        />
                        <Text className='text-sm text-typography-700'>
                          Vị trí
                        </Text>
                      </HStack>
                      <Text className='flex-1 text-right text-sm font-medium'>
                        {task.location}
                      </Text>
                    </HStack>
                  )}

                  <HStack className='items-center justify-between'>
                    <HStack space='sm' className='items-center'>
                      <Icon
                        as={Info}
                        size='sm'
                        className='text-typography-500'
                      />
                      <Text className='text-sm text-typography-700'>
                        Người tạo
                      </Text>
                    </HStack>
                    <Text className='text-sm font-medium'>
                      {task.create_by}
                    </Text>
                  </HStack>
                </VStack>
              </Card>
            </VStack>
          </BoxUI>
        </Card>

        {/* Images section */}
        {images.length > 0 && (
          <BoxUI className='mx-4 mb-4'>
            <HStack className='mb-2 items-center justify-between'>
              <Text className='font-semibold'>Hình ảnh</Text>
              {images.length > 1 && (
                <Pressable>
                  <Text className='text-xs text-primary-600'>Xem tất cả</Text>
                </Pressable>
              )}
            </HStack>

            <BoxUI className='h-48 w-full overflow-hidden rounded-xl'>
              <Image
                source={{ uri: images[0].url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode='cover'
              />
            </BoxUI>
          </BoxUI>
        )}

        {/* Items section */}
        {items.length > 0 && (
          <BoxUI className='mx-4 mb-4'>
            <Text className='mb-2 font-semibold'>Công cụ cần thiết</Text>
            {items.map((item: any) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </BoxUI>
        )}

        {/* Actions section */}
        {task.status !== 'Complete' &&
          task.status !== 'Completed' &&
          task.status !== 'Cancel' && (
            <Card className='m-4 rounded-xl'>
              <BoxUI className='p-4'>
                <VStack space='md'>
                  <Text className='font-semibold'>Cập nhật trạng thái</Text>

                  <HStack space='md'>
                    <Button
                      variant='outline'
                      className='flex-1'
                      onPress={() =>
                        router.push(
                          `/farmer-tasks/${task.id}/edit?type=${taskType}`,
                        )
                      }
                    >
                      <ButtonIcon as={Edit3} />
                      <ButtonText>Chỉnh sửa</ButtonText>
                    </Button>

                    <Button
                      variant='solid'
                      className='flex-1 bg-success-600'
                      onPress={() => setShowCompleteModal(true)}
                    >
                      <ButtonIcon as={Check} />
                      <ButtonText>Hoàn thành</ButtonText>
                    </Button>
                  </HStack>
                </VStack>
              </BoxUI>
            </Card>
          )}

        {/* Add some space at the bottom */}
        <BoxUI className='h-10' />
      </ScrollView>

      {/* Complete task modal using our reusable component */}
      <CompleteTaskModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleCompleteTask}
        allowMultipleImages={true}
        maxImages={3}
      />

      {/* Options modal would go here */}
    </SafeAreaView>
  );
};

export default TaskDetailScreen;

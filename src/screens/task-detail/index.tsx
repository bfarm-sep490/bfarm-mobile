import React, { useState } from 'react';

import { Image, Alert } from 'react-native';

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
  MoreVertical,
  Search,
  Users,
  UserIcon,
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
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { useCaringTask } from '@/services/api/caring-tasks/useCaringTask';
import { useHarvestingTask } from '@/services/api/harvesting-tasks/useHarvestingTask';
import { usePackagingTask } from '@/services/api/packaging-tasks/usePackagingTask';

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
    case 'Inspecting':
      return Search;
    default:
      return Leaf;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Complete':
    case 'Completed':
      return {
        bg: 'bg-success-100',
        text: 'text-success-700',
        icon: CheckCircle2,
      };
    case 'InComplete':
      return { bg: 'bg-danger-100', text: 'text-danger-700', icon: XCircle };
    case 'Ongoing':
      return { bg: 'bg-primary-100', text: 'text-primary-700', icon: Clock };
    default:
      return {
        bg: 'bg-typography-100',
        text: 'text-typography-700',
        icon: Info,
      };
  }
};

const ItemCard = ({
  item,
  type = 'tool',
}: {
  item: {
    id?: number;
    item_id: number;
    item_name: string;
    quantity: number;
    unit: string;
    care_images?: { url: string }[];
  };
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
        <Text className='font-medium'>{item.item_name}</Text>
        <Text className='text-xs text-typography-500'>
          Số lượng: {item.quantity} {item.unit}
        </Text>
      </VStack>
    </HStack>
  );
};

const FarmerCard = ({ farmers }: { farmers: any[] }) => {
  const activeFarmers = farmers?.filter(f => f.status === 'Active') || [];

  return (
    <Card className='mb-4 overflow-hidden rounded-lg'>
      <BoxUI>
        <HStack space='sm' className='mb-2 items-center'>
          <Icon as={Users} size='sm' className='text-primary-600' />
          <Text className='font-semibold'>
            Người thực hiện ({activeFarmers.length})
          </Text>
        </HStack>

        {activeFarmers.length === 0 && (
          <BoxUI className='rounded-lg bg-typography-50 p-2'>
            <Text className='text-sm text-typography-600'>
              Chưa có ai được giao nhiệm vụ này
            </Text>
          </BoxUI>
        )}

        {activeFarmers.length > 0 && (
          <VStack space='sm'>
            {activeFarmers.map(farmer => (
              <HStack
                key={farmer.farmer_id}
                className='items-center rounded-lg bg-success-50 p-2'
              >
                <Icon
                  as={UserIcon}
                  size='sm'
                  className='mr-2 text-success-600'
                />
                <Text className='text-sm'>
                  {farmer.farmer_name || `Nông dân #${farmer.farmer_id}`}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}
      </BoxUI>
    </Card>
  );
};

export const TaskDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; type: string }>();
  const taskType = params.type || 'caring';

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get session data
  const { user } = useSession();
  const currentFarmerId = user?.id;

  const {
    useFetchOneQuery: useFetchCaringTask,
    useUpdateTaskReportMutation: useUpdateCaringTask,
  } = useCaringTask();
  const {
    useFetchOneQuery: useFetchHarvestingTask,
    useUpdateTaskReportMutation: useUpdateHarvestingTask,
  } = useHarvestingTask();
  const {
    useFetchOneQuery: useFetchPackagingTask,
    useUpdateTaskReportMutation: useUpdatePackagingTask,
  } = usePackagingTask();

  const caringTaskQuery = useFetchCaringTask(
    taskType === 'caring' ? Number(params.id) : 0,
  );
  const harvestingTaskQuery = useFetchHarvestingTask(
    taskType === 'harvesting' ? Number(params.id) : 0,
  );
  const packagingTaskQuery = useFetchPackagingTask(
    taskType === 'packaging' ? Number(params.id) : 0,
  );

  const updateTaskMutation =
    taskType === 'caring'
      ? useUpdateCaringTask()
      : taskType === 'harvesting'
        ? useUpdateHarvestingTask()
        : useUpdatePackagingTask();

  const queryMap = {
    caring: caringTaskQuery,
    harvesting: harvestingTaskQuery,
    packaging: packagingTaskQuery,
  };

  const activeQuery = queryMap[taskType as keyof typeof queryMap];
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;

  // Extract the task from the response
  const taskData = activeQuery.data;
  const task: any =
    taskData?.data && taskData.data.length > 0 ? taskData.data[0] : null;

  const currentFarmerInfo = task?.farmer_information?.find(
    (info: any) => info.farmer_id === currentFarmerId,
  );

  const TaskIcon =
    task && 'task_type' in task ? getTaskTypeIcon(task.task_type || '') : Leaf;
  const statusStyle = task
    ? getStatusColor(task.status)
    : { bg: '', text: '', icon: AlertCircle };

  let images: any[] = [];
  if (task) {
    if (taskType === 'caring' && task.care_images) {
      images = task.care_images;
    } else if (taskType === 'harvesting' && task.harvest_images) {
      images = task.harvest_images;
    } else if (taskType === 'packaging' && task.packaging_images) {
      images = task.packaging_images;
    }
  }

  let items: any[] = [];
  if (task) {
    if (taskType === 'caring' && task.care_items) {
      items = task.care_items;
    } else if (taskType === 'harvesting' && task.harvesting_items) {
      items = task.harvesting_items;
    } else if (taskType === 'packaging' && task.packaging_items) {
      items = task.packaging_items;
    }
  }
  let fertilizers: any[] = [];
  if (task) {
    if (taskType === 'caring' && task.care_fertilizers) {
      fertilizers = task.care_fertilizers?.map((x: any) => {
        return {
          ...x,
          item_name: x.fertilizer_name,
          item_id: x.fertilizer_id,
        };
      });
    }
  }

  let pesticides: any[] = [];
  if (task) {
    if (taskType === 'caring' && task.care_pesticides) {
      pesticides = task.care_pesticides?.map((x: any) => {
        return {
          ...x,
          item_name: x.pesticide_name,
          item_id: x.pesticide_id,
        };
      });
    }
  }
  items = items.concat(fertilizers).concat(pesticides);
  const handleCompleteTask = async (data: {
    resultContent: string;
    images: string[];
  }) => {
    if (!task) return;

    try {
      setIsSubmitting(true);
      if (taskType === 'caring') {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: {
            status: 'Completed',
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            harvested_quantity: task.harvested_quantity || 0,
            packed_quantity: task.packed_quantity || 0,
            report_by: user?.name ?? 'Unknown',
          },
        });
      } else if (taskType === 'harvesting') {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: {
            status: 'Completed',
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            harvested_quantity: task.harvested_quantity || 0,
            packed_quantity: task.packed_quantity || 0,
            report_by: user?.name ?? 'Unknown',
          },
        });
      } else if (taskType === 'packaging') {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: {
            status: 'Completed',
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            harvested_quantity: task.harvested_quantity || 0,
            packed_quantity: task.packed_quantity || 0,
            report_by: user?.name ?? 'Unknown',
          },
        });
      }

      // Refresh the task data
      activeQuery.refetch();
      Alert.alert('Thành công', 'Nhiệm vụ đã được cập nhật thành công');
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert(
        'Lỗi',
        'Đã có lỗi xảy ra khi cập nhật nhiệm vụ. Vui lòng thử lại.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-background-0'>
        <BoxUI className='px-4 py-4'>
          <HStack className='items-center justify-between'>
            <HStack space='md' className='flex-1 items-center'>
              <Pressable onPress={() => router.back()}>
                <Icon as={ArrowLeft} />
              </Pressable>
              <Heading size='md'>{task?.task_name}</Heading>
            </HStack>
          </HStack>
        </BoxUI>
        <VStack className='flex-1 items-center justify-center'>
          <Spinner size='large' />
          <Text className='mt-4'>Đang tải thông tin...</Text>
        </VStack>
      </SafeAreaView>
    );
  }

  if (isError || !task) {
    return (
      <SafeAreaView className='flex-1 bg-background-0'>
        <BoxUI className='px-4 py-4'>
          <HStack className='items-center justify-between'>
            <HStack space='md' className='flex-1 items-center'>
              <Pressable onPress={() => router.back()}>
                <Icon as={ArrowLeft} />
              </Pressable>
              <Heading size='md'>{task?.task_name}</Heading>
            </HStack>
          </HStack>
        </BoxUI>
        <VStack className='flex-1 items-center justify-center'>
          <BoxUI className='bg-danger-100 rounded-full p-4'>
            <Icon as={AlertCircle} size='xl' className='text-danger-600' />
          </BoxUI>
          <Text className='mt-4'>Không thể tải thông tin nhiệm vụ</Text>
          <Button className='mt-4' onPress={() => activeQuery.refetch()}>
            <ButtonText>Thử lại</ButtonText>
          </Button>
        </VStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      {/* Header */}
      <BoxUI className='p-4'>
        <HStack className='items-center'>
          <HStack space='md' className='flex-1 items-center justify-between'>
            <Pressable onPress={() => router.back()}>
              <Icon as={ArrowLeft} />
            </Pressable>
            <Heading size='md'>{task?.task_name}</Heading>
            <Pressable onPress={() => {}}>
              <Icon as={MoreVertical} size='sm' className='text-primary-900' />
            </Pressable>
          </HStack>
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
                    <Heading size='sm' className='text-typography-500'>
                      {task.task_type ||
                        (taskType === 'harvesting' ? 'Thu hoạch' : 'Đóng gói')}
                    </Heading>
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

                  {/* Current farmer status if available */}
                  {currentFarmerInfo && (
                    <HStack className='items-center justify-between'>
                      <HStack space='sm' className='items-center'>
                        <Icon
                          as={UserIcon}
                          size='sm'
                          className='text-typography-500'
                        />
                        <Text className='text-sm text-typography-700'>
                          Trạng thái của bạn
                        </Text>
                      </HStack>
                      <Text
                        className={`text-sm font-medium ${
                          currentFarmerInfo.status === 'Active'
                            ? 'text-success-700'
                            : 'text-typography-700'
                        }`}
                      >
                        {currentFarmerInfo.status}
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
                      {task.create_by || task.created_by || 'Unknown'}
                    </Text>
                  </HStack>
                </VStack>
              </Card>
            </VStack>
          </BoxUI>
        </Card>

        {/* Farmers assigned to task */}
        {task.farmer_information && (
          <BoxUI>
            <FarmerCard farmers={task.farmer_information} />
          </BoxUI>
        )}

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

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space='sm'>
                {images.map((image, index) => (
                  <BoxUI
                    key={index}
                    className='h-48 w-48 overflow-hidden rounded-xl'
                  >
                    <Image
                      source={{ uri: image.url }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode='cover'
                    />
                  </BoxUI>
                ))}
              </HStack>
            </ScrollView>
          </BoxUI>
        )}

        {/* Task-specific information */}
        {taskType === 'harvesting' && task.harvested_quantity && (
          <Card className='mb-4 overflow-hidden rounded-xl'>
            <BoxUI>
              <Text className='mb-2 font-semibold'>Thông tin thu hoạch</Text>
              <HStack className='items-center justify-between'>
                <Text className='text-sm text-typography-700'>
                  Số lượng thu hoạch:
                </Text>
                <Text className='font-medium'>
                  {task.harvested_quantity} {task.harvested_unit || 'kg'}
                </Text>
              </HStack>
              {task.fail_quantity !== null &&
                task.fail_quantity !== undefined && (
                  <HStack className='mt-2 items-center justify-between'>
                    <Text className='text-sm text-typography-700'>
                      Số lượng hỏng:
                    </Text>
                    <Text className='text-danger-600 font-medium'>
                      {task.fail_quantity} {task.harvested_unit || ''}
                    </Text>
                  </HStack>
                )}
            </BoxUI>
          </Card>
        )}

        {taskType === 'packaging' && task.packed_quantity && (
          <Card className='mx-4 mb-4 overflow-hidden rounded-xl'>
            <BoxUI className='p-4'>
              <Text className='mb-2 font-semibold'>Thông tin đóng gói</Text>
              <HStack className='items-center justify-between'>
                <Text className='text-sm text-typography-700'>
                  Số lượng đóng gói:
                </Text>
                <Text className='font-medium'>
                  {task.packed_quantity} {task.packed_unit || ''}
                </Text>
              </HStack>
            </BoxUI>
          </Card>
        )}

        {/* Items section */}
        {items.length > 0 && (
          <BoxUI className='mx-4 mb-4'>
            <Text className='mb-2 font-semibold'>
              Công cụ, phân bón hoặc thuốc cần thiết
            </Text>
            {items.map(item => (
              <ItemCard
                key={`item.id || item.item_id`}
                item={item}
                type={
                  taskType === 'caring' &&
                  task.care_pesticides?.some(
                    (p: { item_id: any }) => p.item_id === item.item_id,
                  )
                    ? 'pesticide'
                    : taskType === 'caring' &&
                        task.care_fertilizers?.some(
                          (f: { item_id: any }) => f.item_id === item.item_id,
                        )
                      ? 'fertilizer'
                      : 'tool'
                }
              />
            ))}
          </BoxUI>
        )}
        {/* Actions section */}
        {task.status !== 'Complete' &&
          task.status !== 'Completed' &&
          (!currentFarmerInfo || currentFarmerInfo.status === 'Active') && (
            <Card className='m-4 rounded-xl'>
              <BoxUI className='p-4'>
                <VStack space='md'>
                  <Text className='font-semibold'>Cập nhật trạng thái</Text>

                  <HStack space='md'>
                    <Button
                      variant='outline'
                      className='flex-1'
                      onPress={() =>
                        router.push(`/tasks/${task.id}/update?type=${taskType}`)
                      }
                      isDisabled={isSubmitting}
                    >
                      <ButtonIcon as={Edit3} />
                      <ButtonText>Chỉnh sửa</ButtonText>
                    </Button>

                    <Button
                      variant='solid'
                      className='flex-1 bg-success-600'
                      onPress={() => setShowCompleteModal(true)}
                      isDisabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <HStack space='sm' className='items-center'>
                          <Spinner size='small' color='white' />
                          <ButtonText>Đang xử lý...</ButtonText>
                        </HStack>
                      ) : (
                        <>
                          <ButtonIcon as={Check} />
                          <ButtonText>Hoàn thành</ButtonText>
                        </>
                      )}
                    </Button>
                  </HStack>
                </VStack>
              </BoxUI>
            </Card>
          )}

        <BoxUI className='h-10' />
      </ScrollView>
      <CompleteTaskModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        taskType={taskType as 'caring' | 'harvesting' | 'packaging'}
        title='Xác nhận hoàn thành nhiệm vụ'
        description={`Vui lòng nhập kết quả thực hiện nhiệm vụ "${task?.task_name}"`}
        allowMultipleImages={true}
        maxImages={3}
        onConfirm={handleCompleteTask}
      />
    </SafeAreaView>
  );
};

export default TaskDetailScreen;

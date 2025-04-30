import React, { useState } from 'react';

import { Image, Alert } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Leaf,
  Droplets,
  Scissors,
  Shovel,
  Box,
  ShoppingBag,
  Settings,
  Info,
  MoreVertical,
  Users,
  UserIcon,
  Sprout,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import CompleteTaskModal from '@/components/modal/CompleteTaskModal';
import { SubmitReportProgressModal } from '@/components/modal/SubmitReportProgressModal';
import { Box as BoxUI } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { usePackagingType } from '@/services/api/packaging-types/usePackagingType';

// Add task type constants at the top of the file
const TASK_TYPES = {
  Planting: 'Gieo hạt',
  Nurturing: 'Chăm sóc',
  Watering: 'Tưới nước',
  Fertilizing: 'Bón phân',
  Setup: 'Lắp đặt',
  Pesticide: 'Phun thuốc',
  Weeding: 'Làm cỏ',
  Pruning: 'Cắt tỉa',
} as const;

type TaskType = keyof typeof TASK_TYPES;

// Helper function to get icon based on task type
const getTaskTypeIcon = (taskType: string) => {
  switch (taskType) {
    case 'Planting':
      return Leaf;
    case 'Nurturing':
      return Sprout;
    case 'Watering':
      return Droplets;
    case 'Fertilizing':
      return ShoppingBag;
    case 'Setup':
      return Settings;
    case 'Pesticide':
      return Shovel;
    case 'Weeding':
      return Scissors;
    case 'Pruning':
      return Scissors;
    default:
      return Leaf;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Complete':
      return {
        bg: 'bg-success-100',
        text: 'text-success-700',
        icon: CheckCircle2,
      };
    case 'Incomplete':
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
  const { useFetchAllQuery: usePackagingTypeAll } = usePackagingType();
  const { data: packagingTypes } = usePackagingTypeAll({
    enabled: true,
  });
  // Get session data
  const { user, currentPlan } = useSession();
  const currentFarmerId = user?.id;
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  // Check if current date is within task's date range
  const isCurrentDateInRange = () => {
    if (!task) return false;
    const currentDate = dayjs();
    const taskStartDate = dayjs(task.start_date);
    const taskEndDate = dayjs(task.end_date);
    return (
      currentDate.isSameOrAfter(taskStartDate, 'day') &&
      currentDate.isSameOrBefore(taskEndDate, 'day')
    );
  };

  // Check if task is ongoing and current date is in range
  const canCompleteTask = task?.status === 'Ongoing' && isCurrentDateInRange();

  const handleCompleteTask = async (data: {
    resultContent: string;
    images: string[];
    harvesting_task_id?: number;
    harvesting_quantity?: number;
    packaged_item_count?: number;
    total_packaged_weight?: number;
  }) => {
    if (!task) return;

    try {
      setIsSubmitting(true);
      setShowProgressModal(true);
      setSubmitProgress(0);

      // Start progress tracking
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        // Update progress every 100ms, but don't exceed 95% until completion
        setSubmitProgress(prev => Math.min(95, prev + 1));
      }, 100);

      if (taskType === 'caring') {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: {
            status: 'Complete',
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            harvested_quantity: task.harvested_quantity || 0,
            report_by: user?.name ?? 'Unknown',
          },
        });
      } else if (taskType === 'harvesting') {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: {
            status: 'Complete',
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            harvested_quantity: data.harvesting_quantity || 0,
            report_by: user?.name ?? 'Unknown',
          },
        });
      } else if (taskType === 'packaging') {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          data: {
            status: 'Complete',
            harvesting_task_id: data.harvesting_task_id,
            packaged_item_count: data.packaged_item_count || 0,
            total_packaged_weight: data.total_packaged_weight || 0,
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            harvested_quantity: task.harvested_quantity || 0,
            report_by: user?.name ?? 'Unknown',
          },
        });
      }

      // Set to 100% when complete
      setSubmitProgress(100);
      clearInterval(progressInterval);

      // Invalidate queries to trigger refetch
      await queryClient.invalidateQueries({
        queryKey: ['fetchByParamsHarvestingTasks'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['fetchByParamsCaringTasks'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['fetchByParamsPackagingTasks'],
      });

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
      setShowProgressModal(false);
      setSubmitProgress(0);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-background-0'>
        <BoxUI className='px-4 py-4'>
          <HStack className='items-center justify-between'>
            <HStack space='md' className='flex-1 items-center'>
              <Pressable onPress={() => router.push('/farmer-tasks')}>
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
              <Pressable onPress={() => router.push('/farmer-tasks')}>
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
            <Pressable onPress={() => router.push('/farmer-tasks')}>
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
                <HStack space='sm' className='flex-1 items-center pr-2'>
                  <BoxUI
                    className={`rounded-lg p-2 ${task.task_type ? 'bg-primary-100' : 'bg-typography-100'}`}
                  >
                    <Icon
                      as={TaskIcon}
                      size='sm'
                      className='text-primary-700'
                    />
                  </BoxUI>
                  <VStack className='flex-1'>
                    <Text
                      className='text-base font-semibold'
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {task.task_name}
                    </Text>
                    <Text className='text-xs text-typography-500'>
                      {task.task_type
                        ? t(`farmerTask:taskTypes:${task.task_type}`)
                        : taskType === 'harvesting'
                          ? t('farmerTask:taskTypes:Harvesting')
                          : t('farmerTask:taskTypes:Packaging')}
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

              {/* Task description */}
              <Text className='text-sm text-typography-700'>
                {task.description || t('farmerTask:task:noDescription')}
              </Text>

              {/* Task details */}
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
                        {t('farmerTask:task:time')}
                      </Text>
                    </HStack>
                    <Text className='text-sm font-medium'>
                      {dayjs(task.start_date).format('DD/MM/YYYY')} -{' '}
                      {dayjs(task.end_date).format('DD/MM/YYYY')}
                    </Text>
                  </HStack>

                  <HStack className='items-center justify-between'>
                    <HStack space='sm' className='items-center'>
                      <Icon
                        as={Clock}
                        size='sm'
                        className='text-typography-500'
                      />
                      <Text className='text-sm text-typography-700'>
                        {t('farmerTask:task:executionTime')}
                      </Text>
                    </HStack>
                    <Text className='text-sm font-medium'>
                      {dayjs(task.start_date).format('HH:mm')} -{' '}
                      {dayjs(task.end_date).format('HH:mm')}
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
                          {t('farmerTask:task:yourStatus')}
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
                        {t('farmerTask:task:creator')}
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
          <Card className='mt-4 overflow-hidden rounded-xl'>
            <BoxUI>
              <HStack className='mb-2 items-center justify-between'>
                <HStack space='sm' className='items-center'>
                  <Icon as={Box} size='sm' className='text-primary-600' />
                  <Text className='font-semibold'>
                    {t('farmerTask:task:images')}
                  </Text>
                </HStack>
                <Pressable onPress={() => {}}>
                  <Text className='text-sm text-primary-600'>
                    {t('farmerTask:task:viewAll')}
                  </Text>
                </Pressable>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space='sm'>
                  {images.map((image, index) => (
                    <BoxUI
                      key={index}
                      className='h-32 w-32 overflow-hidden rounded-lg'
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
          </Card>
        )}

        {/* Required items section */}
        {items.length > 0 && (
          <Card className='mt-4 overflow-hidden rounded-xl'>
            <BoxUI>
              <HStack className='mb-2 items-center'>
                <Icon as={Box} size='sm' className='text-primary-600' />
                <Text className='font-semibold'>
                  {t('farmerTask:task:requiredItems')}
                </Text>
              </HStack>

              <VStack space='sm'>
                {items.map((item, index) => (
                  <HStack
                    key={index}
                    className='items-center rounded-lg bg-typography-50 p-2'
                  >
                    <Icon
                      as={Box}
                      size='sm'
                      className='mr-2 text-typography-500'
                    />
                    <VStack className='flex-1'>
                      <Text className='text-sm'>
                        {item.item_name || item.name || `Item #${item.item_id}`}
                      </Text>
                      <Text className='text-xs text-typography-500'>
                        {t('farmerTask:task:quantity', {
                          count: item.quantity,
                          unit: item.unit || '',
                        })}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </BoxUI>
          </Card>
        )}

        {/* Task result section */}
        {task.result_content && (
          <Card className='mt-4 overflow-hidden rounded-xl'>
            <BoxUI>
              <HStack className='mb-2 items-center'>
                <Icon
                  as={CheckCircle2}
                  size='sm'
                  className='text-primary-600'
                />
                <Text className='font-semibold'>
                  {t('farmerTask:task:result')}
                </Text>
              </HStack>

              <BoxUI className='rounded-lg bg-typography-50 p-2'>
                <Text className='text-sm text-typography-700'>
                  {task.result_content}
                </Text>
              </BoxUI>
            </BoxUI>
          </Card>
        )}

        {/* Action buttons */}
        <BoxUI className='mt-4 p-4'>
          <Button
            className='w-full'
            variant='solid'
            onPress={() => setShowCompleteModal(true)}
            isDisabled={!canCompleteTask || isSubmitting}
          >
            {isSubmitting ? (
              <HStack space='sm' className='items-center'>
                <Spinner size='small' />
                <ButtonText>{t('farmerTask:task:updating')}</ButtonText>
              </HStack>
            ) : (
              <ButtonText>{t('farmerTask:task:updateStatus')}</ButtonText>
            )}
          </Button>
        </BoxUI>
      </ScrollView>

      {/* Complete task modal */}
      <CompleteTaskModal
        packaging_type_id={task?.packaging_type_id}
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        taskType={taskType as 'caring' | 'harvesting' | 'packaging'}
        title={t('farmerTask:task:confirmComplete')}
        description={t('farmerTask:task:confirmCompleteDescription', {
          taskName: task?.task_name,
        })}
        allowMultipleImages={true}
        maxImages={3}
        onConfirm={handleCompleteTask}
        idPlan={currentPlan?.id}
      />

      {/* Progress modal */}
      <SubmitReportProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setSubmitProgress(0);
        }}
        progress={submitProgress}
        title={t('farmerTask:report:updating')}
        description={t('farmerTask:report:updatingDescription')}
      />
    </SafeAreaView>
  );
};

export default TaskDetailScreen;

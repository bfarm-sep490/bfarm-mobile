import React, { useState, useCallback, useEffect } from 'react';

import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Leaf,
  Droplets,
  PackageOpen,
  Scissors,
  Shovel,
  ListFilter,
  Box,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Hourglass,
} from 'lucide-react-native';

import CompleteTaskModal from '@/components/modal/CompleteTaskModal';
import { SubmitReportProgressModal } from '@/components/modal/SubmitReportProgressModal';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from '@/components/ui/actionsheet';
import { Box as BoxUI } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { queryClient } from '@/context/providers';
import { useCaringTask } from '@/services/api/caring-tasks/useCaringTask';
import { useHarvestingTask } from '@/services/api/harvesting-tasks/useHarvestingTask';
import { usePackagingTask } from '@/services/api/packaging-tasks/usePackagingTask';

// Add dayjs plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
      return PackageOpen;
    case 'Inspecting':
      return Info;
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
    case 'Pending':
      return {
        bg: 'bg-warning-100',
        text: 'text-warning-700',
        icon: Hourglass,
      };
    default:
      return {
        bg: 'bg-typography-100',
        text: 'text-typography-700',
        icon: Info,
      };
  }
};

const TaskCard = ({
  task,
  taskType = 'caring',
  onQuickReport,
}: {
  task: any;
  taskType?: string;
  onQuickReport?: (task: any, taskType: string) => void;
}) => {
  const router = useRouter();
  const statusStyle = getStatusColor(task.status);
  const TaskIcon = getTaskTypeIcon(task.task_type || '');

  let imageUrl = '';
  if (taskType === 'caring' && task.care_images?.length > 0) {
    imageUrl = task.care_images[0].url;
  } else if (taskType === 'harvesting' && task.harvest_images?.length > 0) {
    imageUrl = task.harvest_images[0].url;
  } else if (taskType === 'packaging' && task.packaging_images?.length > 0) {
    imageUrl = task.packaging_images[0].url;
  }

  // Format time for display
  const startTime = dayjs(task.start_date).format('HH:mm');
  const endTime = dayjs(task.end_date).format('HH:mm');

  // Check if current date is within task's date range
  const isCurrentDateInRange = () => {
    const currentDate = dayjs();
    const taskStartDate = dayjs(task.start_date);
    const taskEndDate = dayjs(task.end_date);
    return (
      currentDate.isSameOrAfter(taskStartDate, 'day') &&
      currentDate.isSameOrBefore(taskEndDate, 'day')
    );
  };

  // Check if task is ongoing and current date is in range
  const canQuickReport = task.status === 'Ongoing' && isCurrentDateInRange();

  return (
    <Card className='mb-3 overflow-hidden rounded-xl'>
      <BoxUI>
        <VStack space='md'>
          {/* Task header with name and status */}
          <HStack className='items-center justify-between'>
            <HStack space='sm' className='flex-1 items-center pr-2'>
              <BoxUI
                className={`rounded-lg p-2 ${task.task_type ? 'bg-primary-100' : 'bg-typography-100'}`}
              >
                <Icon as={TaskIcon} size='sm' className='text-primary-700' />
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

          {/* Task description */}
          <Text className='text-sm text-typography-700'>
            {task.description || 'Không có mô tả'}
          </Text>

          {/* Task details */}
          <VStack space='xs'>
            <HStack space='sm' className='items-center'>
              <Icon as={Calendar} size='xs' className='text-typography-500' />
              <Text className='text-xs text-typography-500'>
                {dayjs(task.start_date).format('DD/MM/YYYY')} -{' '}
                {dayjs(task.end_date).format('DD/MM/YYYY')}
              </Text>
            </HStack>

            {/* Time information */}
            <HStack space='sm' className='items-center'>
              <Icon as={Clock} size='xs' className='text-typography-500' />
              <Text className='text-xs text-typography-500'>
                {startTime} - {endTime}
              </Text>
            </HStack>

            {/* Show items if available */}
            {(task.care_items?.length > 0 ||
              task.harvesting_items?.length > 0 ||
              task.packaging_items?.length > 0) && (
              <HStack space='sm' className='items-center'>
                <Icon as={Box} size='xs' className='text-typography-500' />
                <Text className='text-xs text-typography-500'>
                  {task.care_items?.length > 0
                    ? `${task.care_items.length} công cụ cần thiết`
                    : task.harvesting_items?.length > 0
                      ? `${task.harvesting_items.length} dụng cụ thu hoạch`
                      : `${task.packaging_items.length} vật liệu đóng gói`}
                </Text>
              </HStack>
            )}
          </VStack>

          {/* Action buttons */}
          <HStack space='sm' className='mt-2'>
            <Button
              className='flex-1'
              variant='outline'
              size='sm'
              onPress={() =>
                router.push(`/farmer-tasks/${task.id}?type=${taskType}`)
              }
            >
              <ButtonText>Chi tiết</ButtonText>
            </Button>
            <Button
              className='flex-1'
              variant='solid'
              size='sm'
              onPress={() => onQuickReport?.(task, taskType)}
              isDisabled={!canQuickReport}
            >
              <ButtonText>Báo cáo nhanh</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </BoxUI>
    </Card>
  );
};

const TodoScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showCalendar, setShowCalendar] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user and plan from session
  const { currentPlan, user } = useSession();
  const currentFarmerId = user?.id;
  const currentPlanId = currentPlan?.id;

  // Use API hooks
  const { useFetchByParamsQuery: useFetchCaringTasks } = useCaringTask();
  const { useFetchByParamsQuery: useFetchHarvestingTasks } =
    useHarvestingTask();
  const { useFetchByParamsQuery: useFetchPackagingTasks } = usePackagingTask();

  // Add mutation hooks
  const { mutateAsync: updateCaringTask } =
    useCaringTask().useUpdateTaskReportMutation();
  const { mutateAsync: updateHarvestingTask } =
    useHarvestingTask().useUpdateTaskReportMutation();
  const { mutateAsync: updatePackagingTask } =
    usePackagingTask().useUpdateTaskReportMutation();

  // Create params for API calls to get all tasks (for calendar)
  const allTasksParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: 1000, // Large number to get all tasks
    status: ['Ongoing', 'Pending'],
  };

  // Create params for API calls with pagination and date filter
  const caringParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: pageSize,
    status: ['Ongoing', 'Pending'],
    start_date: selectedDate.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_date: selectedDate.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };

  const harvestingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    status: ['Ongoing', 'Pending'],
    page_size: pageSize,
    start_date: selectedDate.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_date: selectedDate.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };

  const packagingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    status: ['Ongoing', 'Pending'],
    page_size: pageSize,
    start_date: selectedDate.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_date: selectedDate.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };

  // Fetch all tasks for calendar
  const allCaringQuery = useFetchCaringTasks(allTasksParams, !!currentPlanId);
  const allHarvestingQuery = useFetchHarvestingTasks(
    allTasksParams,
    !!currentPlanId,
  );
  const allPackagingQuery = useFetchPackagingTasks(
    allTasksParams,
    !!currentPlanId,
  );

  // Fetch filtered tasks by date
  const caringQuery = useFetchCaringTasks(caringParams, !!currentPlanId);
  const harvestingQuery = useFetchHarvestingTasks(
    harvestingParams,
    !!currentPlanId,
  );
  const packagingQuery = useFetchPackagingTasks(
    packagingParams,
    !!currentPlanId,
  );

  // Check if any query is loading
  const isLoading =
    allCaringQuery.isLoading ||
    allHarvestingQuery.isLoading ||
    allPackagingQuery.isLoading ||
    caringQuery.isLoading ||
    harvestingQuery.isLoading ||
    packagingQuery.isLoading;

  // Check if any query has error
  const hasError =
    allCaringQuery.isError ||
    allHarvestingQuery.isError ||
    allPackagingQuery.isError ||
    caringQuery.isError ||
    harvestingQuery.isError ||
    packagingQuery.isError;

  // Get all tasks for calendar
  const getAllTasks = () => {
    const caringTasks = allCaringQuery.data?.data || [];
    const harvestingTasks = allHarvestingQuery.data?.data || [];
    const packagingTasks = allPackagingQuery.data?.data || [];

    return [
      ...caringTasks.map(t => ({ ...t, taskType: 'caring' })),
      ...harvestingTasks.map(t => ({ ...t, taskType: 'harvesting' })),
      ...packagingTasks.map(t => ({ ...t, taskType: 'packaging' })),
    ];
  };

  // Get filtered tasks by date
  const getFilteredTasks = () => {
    const caringTasks = caringQuery.data?.data || [];
    const harvestingTasks = harvestingQuery.data?.data || [];
    const packagingTasks = packagingQuery.data?.data || [];

    const allTasks = [
      ...caringTasks.map(t => ({ ...t, taskType: 'caring' })),
      ...harvestingTasks.map(t => ({ ...t, taskType: 'harvesting' })),
      ...packagingTasks.map(t => ({ ...t, taskType: 'packaging' })),
    ];

    // Sort tasks by start date (oldest first)
    return allTasks.sort((a, b) => {
      const dateA = dayjs(a.start_date);
      const dateB = dayjs(b.start_date);
      return dateA.diff(dateB);
    });
  };

  const allTasks = getAllTasks();
  const filteredTasks = getFilteredTasks();

  // Get task count for a specific date
  const getTaskCountForDate = (date: dayjs.Dayjs) => {
    return allTasks.filter(task => {
      const taskStartDate = dayjs(task.start_date);
      const taskEndDate = dayjs(task.end_date);
      return (
        date.isSameOrAfter(taskStartDate, 'day') &&
        date.isSameOrBefore(taskEndDate, 'day')
      );
    }).length;
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageSize(10);
    setHasMore(true);

    try {
      await Promise.all([
        caringQuery.refetch(),
        harvestingQuery.refetch(),
        packagingQuery.refetch(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [caringQuery, harvestingQuery, packagingQuery]);

  // Handle load more
  const onEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      setPageSize(prev => prev + 10);
    }
  }, [isLoading, hasMore]);

  // Update hasMore based on data length
  useEffect(() => {
    const currentData = getFilteredTasks();
    if (currentData.length < pageSize) {
      setHasMore(false);
    }
  }, [pageSize, getFilteredTasks]);

  // Generate date buttons for the week
  const generateDateButtons = () => {
    const dates = [];
    const startOfWeek = selectedDate.startOf('week');

    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, 'day');
      const isSelected = date.isSame(selectedDate, 'day');
      const isToday = date.isSame(dayjs(), 'day');
      const taskCount = getTaskCountForDate(date);

      dates.push(
        <Pressable
          key={date.format('YYYY-MM-DD')}
          className={`flex-1 items-center p-2 ${
            isSelected ? 'bg-primary-100' : ''
          }`}
          onPress={() => setSelectedDate(date)}
        >
          <Text
            className={`text-xs ${
              isSelected
                ? 'font-medium text-primary-600'
                : isToday
                  ? 'font-medium text-typography-900'
                  : 'text-typography-500'
            }`}
          >
            {date.format('ddd')}
          </Text>
          <BoxUI
            className={`mt-1 h-8 w-8 items-center justify-center rounded-full ${
              isSelected ? 'bg-primary-600' : isToday ? 'bg-typography-100' : ''
            }`}
          >
            <Text
              className={`text-sm ${
                isSelected
                  ? 'font-medium text-white'
                  : isToday
                    ? 'font-medium text-typography-900'
                    : 'text-typography-500'
              }`}
            >
              {date.format('D')}
            </Text>
          </BoxUI>
          {taskCount > 0 && (
            <BoxUI
              className={`absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full ${
                isSelected ? 'bg-white' : 'bg-primary-600'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isSelected ? 'text-primary-600' : 'text-white'
                }`}
              >
                {taskCount}
              </Text>
            </BoxUI>
          )}
        </Pressable>,
      );
    }

    return dates;
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const days = [];
    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<BoxUI key={`empty-${i}`} className='h-10 w-10' />);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i);
      const isSelected = date.isSame(selectedDate, 'day');
      const isToday = date.isSame(dayjs(), 'day');
      const taskCount = getTaskCountForDate(date);

      days.push(
        <Pressable
          key={date.format('YYYY-MM-DD')}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isSelected ? 'bg-primary-600' : isToday ? 'bg-typography-100' : ''
          }`}
          onPress={() => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
        >
          <Text
            className={`text-sm ${
              isSelected
                ? 'font-medium text-white'
                : isToday
                  ? 'font-medium text-typography-900'
                  : 'text-typography-500'
            }`}
          >
            {i}
          </Text>
          {taskCount > 0 && (
            <BoxUI
              className={`absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full ${
                isSelected ? 'bg-white' : 'bg-primary-600'
              }`}
            >
              <Text
                className={`text-[10px] font-medium ${
                  isSelected ? 'text-primary-600' : 'text-white'
                }`}
              >
                {taskCount}
              </Text>
            </BoxUI>
          )}
        </Pressable>,
      );
    }

    return days;
  };

  // Render task item
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TaskCard
        key={`${item.taskType}-${item.id}`}
        task={item}
        taskType={item.taskType || 'caring'}
        onQuickReport={handleQuickReport}
      />
    ),
    [],
  );

  // Render list footer
  const renderFooter = useCallback(() => {
    if (isLoading) {
      return (
        <VStack className='items-center justify-center py-4'>
          <Spinner size='small' color='$primary600' />
        </VStack>
      );
    }

    if (!hasMore && getFilteredTasks().length > 0) {
      return (
        <VStack className='items-center justify-center py-4'>
          <Text className='text-sm text-typography-500'>Đã hết dữ liệu</Text>
        </VStack>
      );
    }

    return null;
  }, [isLoading, hasMore, getFilteredTasks]);

  const handleQuickReport = (task: any, taskType: string) => {
    setSelectedTask(task);
    setSelectedTaskType(taskType);
    setShowCompleteModal(true);
  };

  const handleCompleteTask = async (data: {
    resultContent: string;
    images: string[];
    harvesting_task_id?: number;
    harvesting_quantity?: number;
    packaged_item_count?: number;
    total_packaged_weight?: number;
  }) => {
    if (!selectedTask) return;

    try {
      setIsSubmitting(true);
      setShowProgressModal(true);
      setSubmitProgress(0);

      // Start progress tracking
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        setSubmitProgress(prev => Math.min(95, prev + 1));
      }, 100);

      if (selectedTaskType === 'caring') {
        await updateCaringTask({
          id: selectedTask.id,
          data: {
            status: 'Complete',
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            report_by: user?.name ?? 'Unknown',
          },
        });
      } else if (selectedTaskType === 'harvesting') {
        await updateHarvestingTask({
          id: selectedTask.id,
          data: {
            status: 'Complete',
            result_content: data.resultContent,
            list_of_image_urls: data.images,
            report_by: user?.name ?? 'Unknown',
            harvested_quantity: data.harvesting_quantity || 0,
          },
        });
      } else if (selectedTaskType === 'packaging') {
        await updatePackagingTask({
          id: selectedTask.id,
          data: {
            status: 'Complete',
            harvesting_task_id: data.harvesting_task_id,
            packaged_item_count: data.packaged_item_count || 0,
            total_packaged_weight: data.total_packaged_weight || 0,
            result_content: data.resultContent,
            list_of_image_urls: data.images,
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
      onRefresh();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
      setShowProgressModal(false);
      setSubmitProgress(0);
      setSelectedTask(null);
      setSelectedTaskType('');
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      {/* Date navigation */}
      <BoxUI className='px-4'>
        <HStack className='mb-2 items-center justify-between'>
          <Pressable
            onPress={() => setSelectedDate(prev => prev.subtract(1, 'week'))}
          >
            <Icon as={ChevronLeft} size='lg' className='text-typography-500' />
          </Pressable>
          <Pressable onPress={() => setShowCalendar(true)}>
            <Text className='font-medium text-typography-900'>
              {selectedDate.format('MMMM YYYY')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedDate(prev => prev.add(1, 'week'))}
          >
            <Icon as={ChevronRight} size='lg' className='text-typography-500' />
          </Pressable>
        </HStack>
        <HStack className='mb-4'>{generateDateButtons()}</HStack>
      </BoxUI>

      {/* Calendar ActionSheet */}
      <Actionsheet isOpen={showCalendar} onClose={() => setShowCalendar(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <VStack space='md' className='p-4'>
            <HStack className='mb-4 items-center justify-between'>
              <Heading size='md'>Chọn ngày</Heading>
            </HStack>

            <HStack className='mb-4 items-center justify-between'>
              <Pressable
                onPress={() =>
                  setSelectedDate(prev => prev.subtract(1, 'month'))
                }
              >
                <Icon
                  as={ChevronLeft}
                  size='lg'
                  className='text-typography-500'
                />
              </Pressable>
              <Text className='font-medium text-typography-900'>
                {selectedDate.format('MMMM YYYY')}
              </Text>
              <Pressable
                onPress={() => setSelectedDate(prev => prev.add(1, 'month'))}
              >
                <Icon
                  as={ChevronRight}
                  size='lg'
                  className='text-typography-500'
                />
              </Pressable>
            </HStack>

            <HStack className='mb-2 justify-between'>
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                <BoxUI
                  key={day}
                  className='h-10 w-10 items-center justify-center'
                >
                  <Text className='text-xs font-medium text-typography-500'>
                    {day}
                  </Text>
                </BoxUI>
              ))}
            </HStack>

            <BoxUI className='flex-row flex-wrap justify-between'>
              {generateCalendarDays()}
            </BoxUI>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      {/* Task list */}
      <BoxUI className='flex-1'>
        {hasError && !isLoading && (
          <VStack className='items-center justify-center py-10'>
            <BoxUI className='bg-danger-100 mb-4 rounded-full p-4'>
              <Icon as={AlertCircle} size='xl' className='text-danger-600' />
            </BoxUI>
            <Text className='text-center text-typography-500'>
              Có lỗi xảy ra khi tải dữ liệu
            </Text>
            <Button
              className='mt-4'
              onPress={() => queryClient.invalidateQueries()}
            >
              <ButtonText>Thử lại</ButtonText>
            </Button>
          </VStack>
        )}

        {!hasError && (
          <FlashList
            data={filteredTasks}
            renderItem={renderItem}
            keyExtractor={item => `${item.taskType}-${item.id}`}
            estimatedItemSize={200}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              !isLoading ? (
                <VStack className='items-center justify-center py-10'>
                  <BoxUI className='mb-4 rounded-full bg-typography-100 p-4'>
                    <Icon
                      as={ListFilter}
                      size='xl'
                      className='text-typography-400'
                    />
                  </BoxUI>
                  <Text className='text-center text-typography-500'>
                    Không có nhiệm vụ nào vào ngày{' '}
                    {selectedDate.format('DD/MM/YYYY')}
                  </Text>
                </VStack>
              ) : null
            }
          />
        )}
      </BoxUI>

      <SubmitReportProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setSubmitProgress(0);
        }}
        progress={submitProgress}
        title='Đang cập nhật báo cáo'
        description='Vui lòng đợi trong giây lát, quá trình này có thể mất khoảng 30 giây...'
      />
      <CompleteTaskModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedTask(null);
          setSelectedTaskType('');
        }}
        taskType={selectedTaskType as 'caring' | 'harvesting' | 'packaging'}
        title='Báo cáo nhanh'
        description={`Vui lòng nhập kết quả thực hiện nhiệm vụ "${selectedTask?.task_name}"`}
        allowMultipleImages={true}
        maxImages={3}
        onConfirm={handleCompleteTask}
      />
    </SafeAreaView>
  );
};

export default TodoScreen;

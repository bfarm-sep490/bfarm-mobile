import React, { useState, useCallback, useEffect } from 'react';

import { Image, RefreshControl, Alert } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Leaf,
  Droplets,
  PackageOpen,
  Scissors,
  Shovel,
  ListFilter,
  Box,
  Settings,
  Info,
  UserIcon,
  Sprout,
} from 'lucide-react-native';

import CompleteTaskModal from '@/components/modal/CompleteTaskModal';
import { SubmitReportProgressModal } from '@/components/modal/SubmitReportProgressModal';
import { Box as BoxUI } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { queryClient } from '@/context/providers';
import { useCaringTask } from '@/services/api/caring-tasks/useCaringTask';
import { useHarvestingTask } from '@/services/api/harvesting-tasks/useHarvestingTask';
import { usePackagingTask } from '@/services/api/packaging-tasks/usePackagingTask';

// Add task type constants
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
      return Search;
    default:
      return Leaf;
  }
};

// Update status filter
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

const TaskCard = ({
  task,
  taskType = 'caring',
  currentFarmerId,
  onQuickReport,
}: {
  task: any;
  taskType?: string;
  currentFarmerId?: number;
  onQuickReport?: (task: any, taskType: string) => void;
}) => {
  const router = useRouter();
  const statusStyle = getStatusColor(task.status);
  const TaskIcon = getTaskTypeIcon(task.task_type || '');

  const activeFarmers =
    task.farmer_information?.filter((f: any) => f.status === 'Active') || [];

  const currentFarmerInfo = currentFarmerId
    ? task.farmer_information?.find((f: any) => f.farmer_id === currentFarmerId)
    : undefined;

  let imageUrl = '';
  if (taskType === 'caring' && task.care_images?.length > 0) {
    imageUrl = task.care_images[0].url;
  } else if (taskType === 'harvesting' && task.harvest_images?.length > 0) {
    imageUrl = task.harvest_images[0].url;
  } else if (taskType === 'packaging' && task.packaging_images?.length > 0) {
    imageUrl = task.packaging_images[0].url;
  }

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

          {/* Farmer assignment information */}
          <BoxUI className='rounded-lg border border-typography-200 p-2'>
            <HStack space='xs' className='items-center'>
              <VStack className='text-xs font-medium text-typography-600'>
                {activeFarmers.length > 0 ? (
                  activeFarmers.map((farmer: any, index: number) => (
                    <HStack
                      key={farmer.farmer_id}
                      space='xs'
                      className='items-center'
                    >
                      <Icon
                        as={UserIcon}
                        size='xs'
                        className='text-typography-500'
                      />
                      <Text className='text-xs text-typography-600'>
                        {farmer.farmer_name || `Nông dân #${farmer.farmer_id}`}
                      </Text>
                    </HStack>
                  ))
                ) : (
                  <Text className='text-xs text-typography-600'>
                    Chưa có ai được giao nhiệm vụ này
                  </Text>
                )}
              </VStack>
            </HStack>
          </BoxUI>

          {/* Current farmer status if available */}
          {currentFarmerInfo && (
            <BoxUI
              className={`rounded-lg p-2 ${currentFarmerInfo.status === 'Active' ? 'bg-success-100' : 'bg-typography-100'}`}
            >
              <HStack space='xs' className='items-center'>
                <Icon
                  as={
                    currentFarmerInfo.status === 'Active' ? CheckCircle2 : Info
                  }
                  size='xs'
                  className={
                    currentFarmerInfo.status === 'Active'
                      ? 'text-success-700'
                      : 'text-typography-700'
                  }
                />
                <Text
                  className={`text-xs ${currentFarmerInfo.status === 'Active' ? 'text-success-700' : 'text-typography-700'}`}
                >
                  Trạng thái của bạn: {currentFarmerInfo.status}
                </Text>
              </HStack>
            </BoxUI>
          )}

          {/* Task description */}
          <Text className='text-sm text-typography-700'>
            {task.description || 'Không có mô tả'}
          </Text>

          {/* Task image if available */}
          {imageUrl && (
            <BoxUI className='h-40 w-full overflow-hidden rounded-lg'>
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode='cover'
              />
            </BoxUI>
          )}

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
                {dayjs(task.start_date).format('HH:mm')} -{' '}
                {dayjs(task.end_date).format('HH:mm')}
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

            {/* Show additional task-specific info */}
            {taskType === 'harvesting' && task.harvested_quantity && (
              <HStack space='sm' className='items-center'>
                <Icon as={Scissors} size='xs' className='text-typography-500' />
                <Text className='text-xs text-typography-500'>
                  Số lượng thu hoạch: {task.harvested_quantity}
                  {task.harvested_unit ? ` ${task.harvested_unit}` : ''}
                </Text>
              </HStack>
            )}
            {/* Show result if available */}
            {task.result_content && (
              <BoxUI className='mt-2 rounded-lg bg-typography-50 p-2'>
                <Text className='text-xs text-typography-700'>
                  {task.result_content}
                </Text>
              </BoxUI>
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

// Update FilterTabs component
const FilterTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'all' | 'ongoing' | 'completed' | 'incomplete';
  setActiveTab: React.Dispatch<
    React.SetStateAction<'all' | 'ongoing' | 'completed' | 'incomplete'>
  >;
}) => {
  const tabs: {
    id: 'all' | 'ongoing' | 'completed' | 'incomplete';
    label: string;
  }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'ongoing', label: 'Đang thực hiện' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'incomplete', label: 'Chưa hoàn thành' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className='mb-4'
    >
      <HStack space='sm' className='px-1'>
        {tabs.map(tab => (
          <Pressable
            key={tab.id}
            className={`rounded-full px-4 py-2 ${activeTab === tab.id ? 'bg-primary-600' : 'bg-typography-100'}`}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              className={
                activeTab === tab.id
                  ? 'font-medium text-white'
                  : 'text-typography-700'
              }
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </HStack>
    </ScrollView>
  );
};

// Update CategoryFilter component
const CategoryFilter = ({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) => {
  const categories = [
    { id: 'all', label: 'Tất cả', icon: Leaf },
    { id: 'caring', label: 'Chăm sóc', icon: Sprout },
    { id: 'harvesting', label: 'Thu hoạch', icon: Scissors },
    { id: 'packaging', label: 'Đóng gói', icon: PackageOpen },
  ];

  return (
    <HStack className='mb-4 justify-between'>
      {categories.map(category => (
        <Pressable
          key={category.id}
          className={`flex-1 items-center p-2 ${activeCategory === category.id ? 'border-b-2 border-primary-600' : ''}`}
          onPress={() => setActiveCategory(category.id)}
        >
          <Icon
            as={category.icon}
            size='sm'
            className={
              activeCategory === category.id
                ? 'text-primary-600'
                : 'text-typography-500'
            }
          />
          <Text
            className={`mt-1 text-xs ${activeCategory === category.id ? 'font-medium text-primary-600' : 'text-typography-500'}`}
          >
            {category.label}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
};

// Main task screen component
export const FarmerTasksScreen = () => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'ongoing' | 'completed' | 'incomplete'
  >('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
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

  // Create params for API calls with pagination and filters
  const caringParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: pageSize,
    status:
      activeTab === 'all'
        ? ['Ongoing', 'Pending', 'Complete', 'Incomplete']
        : activeTab === 'completed'
          ? 'Complete'
          : activeTab === 'incomplete'
            ? 'Incomplete'
            : ['Ongoing', 'Pending'],
  };

  const harvestingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: pageSize,
    status:
      activeTab === 'all'
        ? ['Ongoing', 'Pending', 'Complete', 'Incomplete']
        : activeTab === 'completed'
          ? 'Complete'
          : activeTab === 'incomplete'
            ? 'Incomplete'
            : ['Ongoing', 'Pending'],
  };

  const packagingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: pageSize,
    status:
      activeTab === 'all'
        ? ['Ongoing', 'Pending', 'Complete', 'Incomplete']
        : activeTab === 'completed'
          ? 'Complete'
          : activeTab === 'incomplete'
            ? 'Incomplete'
            : ['Ongoing', 'Pending'],
  };

  // Fetch tasks using React Query
  const caringQuery = useFetchCaringTasks(
    caringParams,
    !!currentPlanId &&
      (activeCategory === 'all' || activeCategory === 'caring'),
  );

  const harvestingQuery = useFetchHarvestingTasks(
    harvestingParams,
    !!currentPlanId &&
      (activeCategory === 'all' || activeCategory === 'harvesting'),
  );

  const packagingQuery = useFetchPackagingTasks(
    packagingParams,
    !!currentPlanId &&
      (activeCategory === 'all' || activeCategory === 'packaging'),
  );

  // Check if any query is loading
  const isLoading =
    (caringQuery.isLoading &&
      (activeCategory === 'all' || activeCategory === 'caring')) ||
    (harvestingQuery.isLoading &&
      (activeCategory === 'all' || activeCategory === 'harvesting')) ||
    (packagingQuery.isLoading &&
      (activeCategory === 'all' || activeCategory === 'packaging'));

  // Check if any query has error
  const hasError =
    caringQuery.isError || harvestingQuery.isError || packagingQuery.isError;

  // Filter tasks based on active tab and category
  const getFilteredTasks = () => {
    let filteredTasks: any[] = [];

    // Filter by category
    if (activeCategory === 'all' || activeCategory === 'caring') {
      const caringTasks = caringQuery.data?.data || [];
      filteredTasks = [
        ...filteredTasks,
        ...caringTasks.map(t => ({ ...t, taskType: 'caring' })),
      ];
    }

    if (activeCategory === 'all' || activeCategory === 'harvesting') {
      const harvestingTasks = harvestingQuery.data?.data || [];
      filteredTasks = [
        ...filteredTasks,
        ...harvestingTasks.map(t => ({ ...t, taskType: 'harvesting' })),
      ];
    }

    if (activeCategory === 'all' || activeCategory === 'packaging') {
      const packagingTasks = packagingQuery.data?.data || [];
      filteredTasks = [
        ...filteredTasks,
        ...packagingTasks.map(t => ({ ...t, taskType: 'packaging' })),
      ];
    }

    // Filter by status
    if (activeTab !== 'all') {
      const statusMap: Record<string, string[]> = {
        ongoing: ['Ongoing'],
        completed: ['Complete'],
        incomplete: ['Incomplete'],
      };

      filteredTasks = filteredTasks.filter(task =>
        statusMap[activeTab]?.includes(task.status),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filteredTasks = filteredTasks.filter(
        task =>
          task.task_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort tasks by start date (oldest first)
    return filteredTasks.sort((a, b) => {
      const dateA = dayjs(a.start_date);
      const dateB = dayjs(b.start_date);
      return dateA.diff(dateB);
    });
  };

  const filteredTasks = getFilteredTasks();

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPageSize(10);
    setHasMore(true);

    try {
      if (activeCategory === 'all' || activeCategory === 'caring') {
        await caringQuery.refetch();
      }
      if (activeCategory === 'all' || activeCategory === 'harvesting') {
        await harvestingQuery.refetch();
      }
      if (activeCategory === 'all' || activeCategory === 'packaging') {
        await packagingQuery.refetch();
      }
    } finally {
      setRefreshing(false);
    }
  }, [activeCategory, caringQuery, harvestingQuery, packagingQuery]);

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
      setSelectedTask(null);
      setSelectedTaskType('');
    }
  };

  // Render task item
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TaskCard
        key={`${item.taskType}-${item.id}`}
        task={item}
        taskType={item.taskType || 'caring'}
        currentFarmerId={currentFarmerId}
        onQuickReport={handleQuickReport}
      />
    ),
    [currentFarmerId],
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

  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      {/* Header */}
      <BoxUI className='px-4 py-4'>
        <HStack className='items-center justify-between'>
          <HStack space='md' className='items-center'>
            <Heading size='lg'>Quản lý nhiệm vụ</Heading>
          </HStack>
        </HStack>
      </BoxUI>

      {/* Search bar */}
      <BoxUI className='bg-background-0 px-4 py-3'>
        <Input
          variant='outline'
          className='rounded-xl bg-background-50 px-2'
          size='md'
        >
          <InputIcon as={Search} className='text-typography-400' />
          <InputField
            placeholder='Tìm kiếm nhiệm vụ...'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <InputIcon as={XCircle} className='text-typography-400' />
            </Pressable>
          ) : null}
        </Input>
      </BoxUI>

      {/* Filter tabs */}
      <BoxUI className='px-4'>
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Divider />
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </BoxUI>

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
            <Button className='mt-4' onPress={onRefresh}>
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
                    Không tìm thấy nhiệm vụ phù hợp
                  </Text>
                  <Text className='mt-1 text-center text-xs text-typography-400'>
                    Thử thay đổi bộ lọc hoặc tìm kiếm
                  </Text>
                  <Button
                    className='mt-4'
                    variant='outline'
                    onPress={() => {
                      setActiveTab('all');
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    <ButtonText>Xóa bộ lọc</ButtonText>
                  </Button>
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

export default FarmerTasksScreen;

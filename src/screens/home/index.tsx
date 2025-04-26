import React, { useCallback, useState, useEffect } from 'react';

import { RefreshControl, Alert } from 'react-native';

import { Calendar } from '@marceloterreiro/flash-calendar';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { router, useRouter } from 'expo-router';
import {
  User2,
  AlertCircle,
  Leaf,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  BarChart3,
  Bell,
  ChevronRight,
  ClipboardList,
  Droplets,
  Bug,
  Shovel,
  Search,
  XCircle,
} from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { queryClient } from '@/context/providers';
import { useCaringTask } from '@/services/api/caring-tasks/useCaringTask';
import { useHarvestingTask } from '@/services/api/harvesting-tasks/useHarvestingTask';
import { usePackagingTask } from '@/services/api/packaging-tasks/usePackagingTask';
import { Plan } from '@/services/api/plans/planSchema';
import { usePlan } from '@/services/api/plans/usePlan';
import { useProblem } from '@/services/api/problems/useProblem';

import { CalendarSheet } from './calendar-sheet';
import { PlanSelector } from './plan-selector';

type MobileHeaderProps = {
  title: string;
};

const DashboardLayout = (props: any) => {
  const { user } = useSession();

  return (
    <VStack className='h-full w-full bg-background-0'>
      <Box className='md:hidden'>
        <MobileHeader title={props.title} />
        <Box className='px-4 py-2'>
          <PlanSelector farmerId={user?.id ?? 0} />
        </Box>
      </Box>
      <VStack className='h-full w-full'>
        <HStack className='h-full w-full'>
          <VStack className='w-full'>{props.children}</VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

function MobileHeader(props: MobileHeaderProps) {
  const router = useRouter();
  return (
    <VStack>
      <HStack
        className='flex items-center justify-between bg-primary-600 px-5 py-4'
        space='md'
      >
        <VStack>
          <Text className='text-sm text-background-0'>Xin chào</Text>
          <Heading size='xl' className='font-roboto text-background-0'>
            {props.title}
          </Heading>
        </VStack>
        <HStack space='sm'>
          <Pressable
            className='rounded-full border-2 border-primary-500 bg-primary-700 p-2.5'
            onPress={() => {
              router.push('/profile');
            }}
          >
            <Icon as={User2} color='white' />
          </Pressable>
        </HStack>
      </HStack>
    </VStack>
  );
}

const NoPlansView = () => {
  return (
    <Card className='my-4 overflow-hidden rounded-xl'>
      <VStack space='lg' className='items-center p-6'>
        <Box className='rounded-full bg-warning-100 p-4'>
          <Icon as={AlertCircle} size='xl' color='#f59e0b' />
        </Box>
        <VStack space='sm' className='items-center'>
          <Heading size='md' className='text-center'>
            Chưa có kế hoạch
          </Heading>
          <Text className='text-center text-typography-500'>
            Bạn chưa được gán kế hoạch nào. Vui lòng liên hệ với quản trị viên
            để bắt đầu các hoạt động canh tác của bạn.
          </Text>
        </VStack>
        <Button className='mt-2 w-full' variant='solid' size='md'>
          <ButtonIcon as={ChevronRight} />
          <ButtonText>Liên hệ quản trị viên</ButtonText>
        </Button>
      </VStack>
    </Card>
  );
};

const PlanStatusCard = ({ currentPlan }: { currentPlan: Plan }) => {
  const startDate = dayjs(currentPlan.start_date);
  const endDate = dayjs(currentPlan.end_date);
  const today = dayjs();
  const totalDays = endDate.diff(startDate, 'day');
  const daysPassed = today.diff(startDate, 'day');
  const daysRemaining = endDate.diff(today, 'day');

  const progressPercent = Math.min(
    100,
    Math.max(0, (daysPassed / totalDays) * 100),
  );

  return (
    <Card className='mb-4 overflow-hidden rounded-xl p-0'>
      {/* Header */}
      <Box className='rounded-t-lg bg-primary-600 px-4 py-3'>
        <HStack className='items-center justify-between'>
          <HStack space='sm' className='items-center'>
            <Icon as={Leaf} color='white' />
            <Text className='font-bold text-background-0'>
              Kế hoạch hiện tại
            </Text>
          </HStack>
          <Pressable className='rounded-full bg-primary-700 p-1.5'>
            <Icon as={ChevronRight} size='sm' color='white' />
          </Pressable>
        </HStack>
      </Box>

      {/* Content */}
      <Box className='bg-primary-100/30 p-4'>
        <VStack space='md'>
          <HStack className='items-center justify-between'>
            <Text className='text-lg font-semibold'>
              {currentPlan.plan_name}
            </Text>
            <Box
              className={`rounded-full px-2 py-0.5 ${currentPlan.status === 'Complete' ? 'bg-success-100' : 'bg-warning-100'}`}
            >
              <Text
                className={`text-xs ${currentPlan.status === 'Complete' ? 'text-success-700' : 'text-warning-700'}`}
              >
                {currentPlan.status}
              </Text>
            </Box>
          </HStack>

          <HStack space='md' className='flex-wrap'>
            <HStack space='xs' className='items-center'>
              <Icon as={Leaf} size='sm' className='text-success-600' />
              <Text className='text-sm'>{currentPlan.plant_name || 'N/A'}</Text>
            </HStack>

            <HStack space='xs' className='items-center'>
              <Icon as={CalendarIcon} size='sm' className='text-primary-600' />
              <Text className='text-sm'>
                {dayjs(currentPlan.start_date).format('DD/MM/YYYY')}
              </Text>
            </HStack>

            <HStack space='xs' className='items-center'>
              <Icon as={BarChart3} size='sm' className='text-indigo-600' />
              <Text className='text-sm'>
                {currentPlan.estimated_product} kg
              </Text>
            </HStack>
          </HStack>

          <HStack space='xs' className='items-center'>
            <Icon as={Shovel} size='sm' className='text-amber-600' />
            <Text className='text-sm text-typography-600'>
              Đất: {currentPlan.yield_name || 'N/A'}
            </Text>
          </HStack>

          <VStack space='xs'>
            <HStack className='justify-between'>
              <Text className='text-sm text-typography-500'>Tiến độ</Text>
              <Text className='text-sm font-medium'>
                {Math.round(progressPercent)}%
              </Text>
            </HStack>
            <Progress
              value={progressPercent}
              orientation='horizontal'
              size='md'
            >
              <ProgressFilledTrack className='h-1' />
            </Progress>
            <HStack className='justify-between'>
              <Text className='text-xs text-typography-500'>
                {dayjs(currentPlan.start_date).format('DD/MM/YYYY')}
              </Text>
              <Text className='text-xs text-typography-500'>
                {dayjs(currentPlan.end_date).format('DD/MM/YYYY')}
              </Text>
            </HStack>
          </VStack>

          <HStack className='items-center justify-between rounded-lg bg-primary-50 p-3'>
            <Icon as={Clock} className='text-primary-600' />
            <Text className='font-medium text-primary-700'>
              {daysRemaining > 0
                ? `Còn ${daysRemaining} ngày`
                : daysRemaining === 0
                  ? 'Kết thúc hôm nay'
                  : 'Đã kết thúc'}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Card>
  );
};

const TasksList = () => {
  const { currentPlan, user } = useSession();
  const currentFarmerId = user?.id;
  const currentPlanId = currentPlan?.id;
  const [refreshing, setRefreshing] = useState(false);
  const today = dayjs();

  // Use API hooks
  const { useFetchByParamsQuery: useFetchCaringTasks } = useCaringTask();
  const { useFetchByParamsQuery: useFetchHarvestingTasks } =
    useHarvestingTask();
  const { useFetchByParamsQuery: useFetchPackagingTasks } = usePackagingTask();

  // Create params for API calls
  const caringParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: 10,
    start_date: today.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_date: today.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };

  const harvestingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: 10,
    start_date: today.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_date: today.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };

  const packagingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: 10,
    start_date: today.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end_date: today.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };

  // Fetch tasks using React Query
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
    caringQuery.isLoading ||
    harvestingQuery.isLoading ||
    packagingQuery.isLoading;

  // Check if any query has error
  const hasError =
    caringQuery.isError || harvestingQuery.isError || packagingQuery.isError;

  // Get tasks for today
  const getTasksForToday = () => {
    let tasks: any[] = [];

    // Add caring tasks
    if (caringQuery.data?.data) {
      tasks = [
        ...tasks,
        ...caringQuery.data.data.map(t => ({ ...t, taskType: 'caring' })),
      ];
    }

    // Add harvesting tasks
    if (harvestingQuery.data?.data) {
      tasks = [
        ...tasks,
        ...harvestingQuery.data.data.map(t => ({
          ...t,
          taskType: 'harvesting',
        })),
      ];
    }

    // Add packaging tasks
    if (packagingQuery.data?.data) {
      tasks = [
        ...tasks,
        ...packagingQuery.data.data.map(t => ({ ...t, taskType: 'packaging' })),
      ];
    }

    return tasks;
  };

  const tasksForToday = getTasksForToday();

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await caringQuery.refetch();
      await harvestingQuery.refetch();
      await packagingQuery.refetch();
    } finally {
      setRefreshing(false);
    }
  }, [caringQuery, harvestingQuery, packagingQuery]);

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'caring':
        return Leaf;
      case 'harvesting':
        return Shovel;
      case 'packaging':
        return ClipboardList;
      default:
        return Leaf;
    }
  };

  const getTaskIconColor = (taskType: string) => {
    switch (taskType) {
      case 'caring':
        return 'green';
      case 'harvesting':
        return 'amber';
      case 'packaging':
        return 'blue';
      default:
        return 'green';
    }
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() =>
        router.push(`/farmer-tasks/${item.id}?type=${item.taskType}`)
      }
    >
      <VStack>
        <HStack className='items-center justify-between p-3'>
          <HStack space='md' className='items-center'>
            <Box
              className={`rounded-lg bg-${getTaskIconColor(item.taskType)}-100 p-2`}
            >
              <Icon
                as={getTaskIcon(item.taskType)}
                size='sm'
                className={`text-${getTaskIconColor(item.taskType)}-600`}
              />
            </Box>
            <VStack>
              <Text className='font-medium'>{item.task_name}</Text>
              <Text className='text-xs text-typography-500'>
                {dayjs(item.start_date).format('HH:mm')}
              </Text>
            </VStack>
          </HStack>
          <Icon
            as={item.status === 'Complete' ? CheckCircle2 : ClipboardList}
            className={
              item.status === 'Complete'
                ? 'text-success-600'
                : 'text-typography-400'
            }
          />
        </HStack>
        <Divider />
      </VStack>
    </Pressable>
  );

  return (
    <VStack space='md' className='mb-6'>
      <HStack className='items-center justify-between'>
        <Text className='font-bold text-typography-900'>Nhiệm vụ hôm nay</Text>
      </HStack>

      <Card className='overflow-hidden rounded-xl px-0'>
        {hasError && !isLoading && (
          <VStack className='items-center justify-center py-10'>
            <Box className='bg-danger-100 mb-4 rounded-full p-4'>
              <Icon as={AlertCircle} size='xl' className='text-danger-600' />
            </Box>
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
            data={tasksForToday}
            renderItem={renderTaskItem}
            estimatedItemSize={80}
            keyExtractor={item => `${item.taskType}-${item.id}`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              !isLoading ? (
                <VStack className='items-center justify-center py-10'>
                  <Box className='mb-4 rounded-full bg-typography-100 p-4'>
                    <Icon
                      as={ClipboardList}
                      size='xl'
                      className='text-typography-400'
                    />
                  </Box>
                  <Text className='text-center text-typography-500'>
                    Không có nhiệm vụ nào hôm nay
                  </Text>
                </VStack>
              ) : null
            }
          />
        )}
      </Card>
    </VStack>
  );
};

const MainContent = () => {
  const { currentPlan, user } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get query hooks
  const { useFetchByFarmerQuery: useFetchPlansQuery } = usePlan();
  const { useFetchByParamsQuery: useFetchProblemsQuery } = useProblem();

  // Get query instances
  const plansQuery = useFetchPlansQuery(user?.id ?? 0);
  const problemsQuery = useFetchProblemsQuery({
    farmer_id: user?.id,
    page_number: 1,
    page_size: 10,
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refresh plans
      await plansQuery.refetch();

      // Refresh problems/tasks
      await problemsQuery.refetch();

      // Add any additional data refreshes here
    } finally {
      setIsRefreshing(false);
    }
  }, [plansQuery, problemsQuery]);

  return (
    <Box className='mb-28 flex-1'>
      <FlashList
        data={[1]} // Single item to render the main content
        renderItem={() => (
          <VStack className='w-full p-4 pb-0' space='lg'>
            {!currentPlan ? (
              <NoPlansView />
            ) : (
              <>
                <PlanStatusCard currentPlan={currentPlan} />
                <TasksList />
              </>
            )}
          </VStack>
        )}
        estimatedItemSize={800}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4F46E5']}
            tintColor='#4F46E5'
            progressViewOffset={20}
          />
        }
      />
    </Box>
  );
};

export const Home = () => {
  const { user } = useSession();
  return (
    <SafeAreaView className='h-full w-full'>
      <DashboardLayout title={user?.name} isSidebarVisible={true}>
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};

import React from 'react';

import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  User2,
  AlertCircle,
  Leaf,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart3,
  Bell,
  Menu,
  ChevronRight,
  ClipboardList,
  Cloud,
  Droplets,
  Bug,
  SunMoon,
  Shovel,
} from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Progress } from '@/components/ui/progress';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { Plan } from '@/services/api/plans/planSchema';

import { PlanSelector } from './plan-selector';

type MobileHeaderProps = {
  title: string;
};

interface QuickActionCardProps {
  icon: any;
  title: string;
  onPress: () => void;
  color?: string;
  bgColor?: string;
}

// Small Weather Component for Header
const HeaderWeather = () => (
  <HStack
    className='items-center justify-between rounded-lg bg-primary-700 p-2'
    space='xs'
  >
    <HStack space='xs' className='items-center'>
      <Icon as={Cloud} size='sm' color='white' />
      <Text className='font-medium text-background-0'>27°C</Text>
    </HStack>
    <VStack>
      <HStack space='xs' className='items-center'>
        <Icon as={Droplets} size='xs' color='white' />
        <Text className='text-xs text-background-0'>78%</Text>
      </HStack>
    </VStack>
  </HStack>
);

const QuickActionCard = ({
  icon,
  title,
  onPress,
  color = 'text-primary-600',
  bgColor = 'bg-primary-50',
}: QuickActionCardProps) => (
  <Pressable
    onPress={onPress}
    className={`rounded-xl p-4 ${bgColor} min-w-20 flex-1`}
  >
    <VStack space='sm' className='items-center'>
      <Icon as={icon} size='lg' className={color} />
      <Text className='text-center text-sm font-medium'>{title}</Text>
    </VStack>
  </Pressable>
);

const DashboardLayout = (props: any) => {
  const { user } = useSession();

  return (
    <VStack className='h-full w-full bg-background-0'>
      <Box className='md:hidden'>
        <MobileHeader title={props.title} />

        <Box className='px-4 py-2'>
          <HStack className='mb-2 w-full items-center justify-between'>
            <Text className='text-lg font-bold text-typography-900'>
              Kế hoạch của bạn
            </Text>
            <HStack space='sm'>
              <Pressable className='rounded-full bg-background-100 p-2'>
                <Icon as={Bell} size='sm' />
              </Pressable>
              <Pressable className='rounded-full bg-background-100 p-2'>
                <Icon as={Menu} size='sm' />
              </Pressable>
            </HStack>
          </HStack>
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
        <Pressable
          className='rounded-full border-2 border-primary-500 bg-primary-700 p-2.5'
          onPress={() => {
            router.push('/profile');
          }}
        >
          <Icon as={User2} color='white' />
        </Pressable>
      </HStack>

      {/* Weather Info Bar Below Main Header */}
      <Box className='rounded-b-xl bg-primary-600 px-5 pb-4'>
        <HStack space='md'>
          {/* Left weather info */}
          <HeaderWeather />

          {/* Day/Night indicator */}
          <HStack
            className='flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2'
            space='xs'
          >
            <Icon as={SunMoon} size='sm' color='white' />
            <Text className='text-sm text-background-0'>Trưa</Text>
          </HStack>
        </HStack>
      </Box>
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
  // Calculate days remaining
  const startDate = dayjs(currentPlan.start_date);
  const endDate = dayjs(currentPlan.end_date);
  const today = dayjs();
  const totalDays = endDate.diff(startDate, 'day');
  const daysPassed = today.diff(startDate, 'day');
  const daysRemaining = endDate.diff(today, 'day');

  // Calculate progress percentage (capped at 100%)
  const progressPercent = Math.min(
    100,
    Math.max(0, (daysPassed / totalDays) * 100),
  );

  return (
    <Card className='mb-4 overflow-hidden rounded-xl'>
      {/* Header */}
      <Box className='rounded-lg bg-primary-600 px-4 py-3'>
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
      <Box className='p-4'>
        <VStack space='md'>
          <HStack className='justify-between'>
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
              <Icon as={Calendar} size='sm' className='text-primary-600' />
              <Text className='text-sm'>
                {dayjs(currentPlan.start_date).format('DD/MM/YYYY')}
              </Text>
            </HStack>

            <HStack space='xs' className='items-center'>
              <Icon as={BarChart3} size='sm' className='text-indigo-600' />
              <Text className='text-sm'>
                {currentPlan.estimated_product} {currentPlan.estimated_unit}
              </Text>
            </HStack>
          </HStack>

          <VStack space='xs'>
            <HStack className='justify-between'>
              <Text className='text-sm text-typography-500'>Tiến độ</Text>
              <Text className='text-sm font-medium'>
                {Math.round(progressPercent)}%
              </Text>
            </HStack>
            <Progress value={progressPercent} className='h-2 rounded-full' />
            <HStack className='justify-between'>
              <Text className='text-xs text-typography-500'>Ngày bắt đầu</Text>
              <Text className='text-xs text-typography-500'>Ngày kết thúc</Text>
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

const TasksList = () => (
  <VStack space='md' className='mb-6'>
    <HStack className='items-center justify-between'>
      <Text className='font-bold text-typography-900'>Nhiệm vụ gần đây</Text>
      <Pressable>
        <Text className='text-sm text-primary-600'>Xem tất cả</Text>
      </Pressable>
    </HStack>

    <Card className='overflow-hidden rounded-xl'>
      <VStack>
        <HStack className='items-center justify-between p-3'>
          <HStack space='md' className='items-center'>
            <Box className='rounded-lg bg-blue-100 p-2'>
              <Icon as={Droplets} size='sm' className='text-blue-600' />
            </Box>
            <VStack>
              <Text className='font-medium'>Tưới nước cho cà chua</Text>
              <Text className='text-xs text-typography-500'>
                Hôm nay, 15:00
              </Text>
            </VStack>
          </HStack>
          <Icon as={CheckCircle2} className='text-success-600' />
        </HStack>

        <Divider />

        <HStack className='items-center justify-between p-3'>
          <HStack space='md' className='items-center'>
            <Box className='rounded-lg bg-amber-100 p-2'>
              <Icon as={Shovel} size='sm' className='text-amber-600' />
            </Box>
            <VStack>
              <Text className='font-medium'>Bón phân hữu cơ</Text>
              <Text className='text-xs text-typography-500'>
                Ngày mai, 09:00
              </Text>
            </VStack>
          </HStack>
          <Icon as={ClipboardList} className='text-typography-400' />
        </HStack>

        <Divider />

        <HStack className='items-center justify-between p-3'>
          <HStack space='md' className='items-center'>
            <Box className='rounded-lg bg-red-100 p-2'>
              <Icon as={Bug} size='sm' className='text-red-600' />
            </Box>
            <VStack>
              <Text className='font-medium'>Phun thuốc trừ sâu</Text>
              <Text className='text-xs text-typography-500'>
                20/03/2025, 14:00
              </Text>
            </VStack>
          </HStack>
          <Icon as={ClipboardList} className='text-typography-400' />
        </HStack>
      </VStack>
    </Card>
  </VStack>
);

const QuickActions = () => {
  const router = useRouter();

  return (
    <VStack space='md' className='mb-6'>
      <HStack className='items-center justify-between'>
        <Text className='font-bold text-typography-900'>Thao tác nhanh</Text>
        <Pressable>
          <Text className='text-sm text-primary-600'>Xem tất cả</Text>
        </Pressable>
      </HStack>

      <HStack space='md' className='flex-wrap'>
        <QuickActionCard
          icon={Droplets}
          title='Tưới nước'
          color='text-blue-600'
          bgColor='bg-blue-50'
          onPress={() => router.push('/tasks/watering')}
        />

        <QuickActionCard
          icon={Bug}
          title='Phòng dịch'
          color='text-red-600'
          bgColor='bg-red-50'
          onPress={() => router.push('/tasks/pest-control')}
        />

        <QuickActionCard
          icon={Shovel}
          title='Bón phân'
          color='text-amber-600'
          bgColor='bg-amber-50'
          onPress={() => router.push('/tasks/fertilizing')}
        />
      </HStack>
    </VStack>
  );
};

const UpcomingEvents = () => (
  <VStack space='md' className='mb-6'>
    <HStack className='items-center justify-between'>
      <Text className='font-bold text-typography-900'>Sự kiện sắp tới</Text>
      <Pressable>
        <Text className='text-sm text-primary-600'>Xem tất cả</Text>
      </Pressable>
    </HStack>

    <Card className='overflow-hidden rounded-xl border border-primary-100'>
      <HStack className='items-center p-4'>
        <Box className='mr-4 rounded-xl bg-primary-100 p-3'>
          <VStack className='items-center'>
            <Text className='text-xs font-medium text-primary-700'>
              Tháng 3
            </Text>
            <Text className='text-xl font-bold text-primary-700'>18</Text>
          </VStack>
        </Box>
        <VStack className='flex-1'>
          <Text className='font-semibold'>Kiểm tra kết quả phân bón</Text>
          <Text className='text-sm text-typography-500'>
            Kiểm tra hiệu quả của phân bón kali đã áp dụng
          </Text>
        </VStack>
        <Icon as={ChevronRight} className='text-typography-400' />
      </HStack>
    </Card>
  </VStack>
);

const MainContent = () => {
  const { currentPlan } = useSession();

  return (
    <Box className='flex-1'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150,
          flexGrow: 1,
        }}
        className='mb-20 flex-1 md:mb-2'
      >
        <VStack className='w-full p-4 pb-0' space='lg'>
          {!currentPlan ? (
            <NoPlansView />
          ) : (
            <>
              <PlanStatusCard currentPlan={currentPlan} />
              <QuickActions />
              <TasksList />
              <UpcomingEvents />
            </>
          )}
        </VStack>
      </ScrollView>
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

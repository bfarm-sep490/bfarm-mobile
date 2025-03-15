import React, { useState } from 'react';

import { Image } from 'react-native';

import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
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
} from 'lucide-react-native';

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
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

// Mock data for UI demonstration
const mockCaringTasks = [
  {
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
      'Thiết lập hệ thống tưới nhỏ giọt giúp cây nhận đủ nước mà không gây lãng phí.',
    result_content: null,
    task_type: 'Setup',
    start_date: '2025-02-15T00:00:00',
    end_date: '2025-02-18T00:00:00',
    complete_date: '2025-02-20T00:00:00',
    status: 'Completed',
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
    ],
  },
];

const mockHarvestingTasks = [
  {
    id: 1,
    plan_id: 2,
    farmer_id: null,
    farmer_name: null,
    task_name: 'Thu hoạch rau cải',
    description: 'Thu hoạch rau cải trước khi trời quá nắng',
    result_content: 'Đã hủy vì cây không đạt chất lượng kiểm định',
    start_date: '2025-03-10T17:18:36',
    end_date: '2025-03-12T17:18:36',
    complete_date: '2025-03-15T17:18:36',
    harvested_quantity: 50,
    harvested_unit: null,
    is_available: false,
    status: 'Cancel',
    priority: 0,
    created_at: '2025-03-10T17:18:36',
    updated_at: null,
    harvest_images: [
      {
        id: 1,
        task_id: 1,
        url: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/1/4/991490/Thu-Hoach-Rau-Cai-Th.jpg',
      },
    ],
    harvesting_items: [
      {
        item_id: 5,
        task_id: 1,
        quantity: 2,
        unit: 'Cái',
      },
      {
        item_id: 6,
        task_id: 1,
        quantity: 1,
        unit: 'Cái',
      },
    ],
  },
];

const mockPackagingTasks = [
  {
    id: 2,
    plan_id: 2,
    farmer_id: null,
    farmer_name: null,
    task_name: 'Đóng gói cà phê',
    packed_unit: null,
    packed_quantity: 500,
    description: 'Đóng gói cà phê bột vào túi 1kg',
    result_content: 'Đã đóng gói được 500 túi',
    start_date: '2025-03-12T17:18:36',
    end_date: '2025-03-16T17:18:36',
    status: 'Complete',
    complete_date: '2025-03-18T17:18:36',
    created_at: '2025-03-11T17:18:36',
    updated_at: '2025-03-15T17:18:36',
    priority: 0,
    packaging_images: [
      {
        id: 2,
        task_id: 2,
        url: 'https://maygoi.vn/wp-content/uploads/2019/03/maxresdefault-1.jpg',
      },
    ],
    packaging_items: [
      {
        item_id: 9,
        task_id: 2,
        quantity: 4,
        unit: 'unit',
      },
    ],
  },
];

// Add more mock data for demo
const additionalTasks = [
  {
    id: 5,
    plan_id: 2,
    task_name: 'Phun thuốc diệt cỏ',
    task_type: 'Spraying',
    description: 'Phun thuốc diệt cỏ tại khu vực trồng lúa',
    status: 'Pending',
    start_date: '2025-03-20T17:18:36',
    end_date: '2025-03-22T17:18:36',
    care_images: [],
    care_items: [],
  },
  {
    id: 6,
    plan_id: 2,
    task_name: 'Bón phân NPK',
    task_type: 'Fertilizing',
    description: 'Bón phân NPK cho cây lúa giai đoạn đẻ nhánh',
    status: 'Pending',
    start_date: '2025-03-25T17:18:36',
    end_date: '2025-03-26T17:18:36',
    care_images: [],
    care_items: [],
  },
];

// Helper function to get icon based on task type
const getTaskTypeIcon = (taskType: any) => {
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
    default:
      return Leaf;
  }
};

// Helper function to get task status color
const getStatusColor = (status: any) => {
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

// Task card component
const TaskCard = ({
  task,
  taskType = 'caring',
}: {
  task: any;
  taskType?: string;
}) => {
  const router = useRouter();
  const statusStyle = getStatusColor(task.status);
  const TaskIcon = getTaskTypeIcon(task.task_type);

  // Determine image source based on task type
  let imageUrl = '';
  if (taskType === 'caring' && task.care_images?.length > 0) {
    imageUrl = task.care_images[0].url;
  } else if (taskType === 'harvesting' && task.harvest_images?.length > 0) {
    imageUrl = task.harvest_images[0].url;
  } else if (taskType === 'packaging' && task.packaging_images?.length > 0) {
    imageUrl = task.packaging_images[0].url;
  }

  return (
    <Card className='mb-3 overflow-hidden rounded-xl'>
      <BoxUI>
        <VStack space='md'>
          {/* Task header with name and status */}
          <HStack className='items-center justify-between'>
            <HStack space='sm' className='items-center'>
              <BoxUI
                className={`rounded-lg p-2 ${task.task_type ? 'bg-primary-100' : 'bg-typography-100'}`}
              >
                <Icon as={TaskIcon} size='sm' className='text-primary-700' />
              </BoxUI>
              <VStack>
                <Text className='text-base font-semibold'>
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
            {task.description}
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

            {task.status !== 'Complete' &&
              task.status !== 'Completed' &&
              task.status !== 'Cancel' && (
                <Button
                  className='flex-1'
                  variant='solid'
                  size='sm'
                  onPress={() =>
                    router.push(`/tasks/${task.id}/update?type=${taskType}`)
                  }
                >
                  <ButtonText>Cập nhật</ButtonText>
                </Button>
              )}
          </HStack>
        </VStack>
      </BoxUI>
    </Card>
  );
};

// Filter tabs component
const FilterTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'all' | 'pending' | 'ongoing' | 'completed';
  setActiveTab: React.Dispatch<
    React.SetStateAction<'all' | 'pending' | 'ongoing' | 'completed'>
  >;
}) => {
  const tabs: {
    id: 'all' | 'pending' | 'ongoing' | 'completed';
    label: string;
  }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xử lý' },
    { id: 'ongoing', label: 'Đang thực hiện' },
    { id: 'completed', label: 'Hoàn thành' },
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

// Category filter component
const CategoryFilter = ({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) => {
  const categories = [
    { id: 'all', label: 'Tất cả', icon: Leaf },
    { id: 'caring', label: 'Chăm sóc', icon: Scissors },
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'all' | 'pending' | 'ongoing' | 'completed'
  >('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine all tasks for the demo
  const allCaringTasks = [...mockCaringTasks, ...additionalTasks];

  // Filter tasks based on active tab and category
  const getFilteredTasks = () => {
    let filteredTasks: any[] = [];

    // Filter by category
    if (activeCategory === 'all' || activeCategory === 'caring') {
      filteredTasks = [
        ...filteredTasks,
        ...allCaringTasks.map(t => ({ ...t, taskType: 'caring' })),
      ];
    }

    if (activeCategory === 'all' || activeCategory === 'harvesting') {
      filteredTasks = [
        ...filteredTasks,
        ...mockHarvestingTasks.map(t => ({ ...t, taskType: 'harvesting' })),
      ];
    }

    if (activeCategory === 'all' || activeCategory === 'packaging') {
      filteredTasks = [
        ...filteredTasks,
        ...mockPackagingTasks.map(t => ({ ...t, taskType: 'packaging' })),
      ];
    }

    // Filter by status
    if (activeTab !== 'all') {
      const statusMap = {
        pending: ['Pending'],
        ongoing: ['Ongoing'],
        completed: ['Complete', 'Completed'],
      };

      filteredTasks = filteredTasks.filter(task =>
        statusMap[activeTab as 'pending' | 'ongoing' | 'completed']?.includes(
          task.status,
        ),
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

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      {/* Header */}
      <BoxUI className='px-4 py-4'>
        <HStack className='items-center justify-between'>
          <HStack space='md' className='items-center'>
            <Heading size='md' className=''>
              Quản lý nhiệm vụ
            </Heading>
          </HStack>
          <Pressable
            className='rounded-full bg-primary-700 p-2'
            onPress={() => {
              /* Open filter modal */
            }}
          >
            <Icon as={Filter} size='sm' color='white' />
          </Pressable>
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
      <ScrollView className='flex-1 px-4'>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={`${task.taskType}-${task.id}`}
              task={task}
              taskType={task.taskType || 'caring'}
            />
          ))
        ) : (
          <VStack className='items-center justify-center py-10'>
            <BoxUI className='mb-4 rounded-full bg-typography-100 p-4'>
              <Icon as={ListFilter} size='xl' className='text-typography-400' />
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
        )}

        {/* Add some space at the bottom */}
        <BoxUI className='h-20' />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FarmerTasksScreen;

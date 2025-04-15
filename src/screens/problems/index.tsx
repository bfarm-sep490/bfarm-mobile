import React, { useEffect, useState } from 'react';

import {
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import dayjs from 'dayjs';
import { Link, useLocalSearchParams, router, useRouter } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import { use } from 'i18next';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  Filter,
  Leaf,
  Menu,
  MoreVertical,
  Scissors,
  Sprout,
  UserIcon,
  Users,
  RefreshCw,
  List,
  AlertTriangle,
} from 'lucide-react-native';
import { useForm, Controller, Form } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { FlatList } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import Carousel from 'react-native-reanimated-carousel';
import { ICreateProblem, IProblem, ISelectPlan } from 'src/interfaces';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import { StatusProblem } from '@/components/status-tag/problem-tag';
import {
  Box,
  Heading,
  HStack,
  Input,
  InputField,
  InputIcon,
  CloseIcon,
  InputSlot,
  ScrollView,
  VStack,
  Text,
  CalendarDaysIcon,
  Image,
  SelectInput,
  SelectItem,
  View,
  Button,
  Slider,
  UISlider,
  ButtonText,
  Icon,
  Select,
  Card,
  Divider,
  Spinner,
} from '@/components/ui';
import { Box as BoxUI } from '@/components/ui/box';
import { useSession } from '@/context/ctx';
import { usePlan } from '@/services/api/plans/usePlan';
import { useProblem } from '@/services/api/problems/useProblem';
import {
  createProblem,
  getProblemsByFarmerId,
  getProblemsById,
  planByFarmerId,
  uploadProblemImage,
} from '@/services/problems';

import { PlanSelector } from '../home/plan-selector';

const FilterTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'All' | 'Resolved' | 'Pending';
  setActiveTab: React.Dispatch<
    React.SetStateAction<'All' | 'Resolved' | 'Pending'>
  >;
}) => {
  const tabs: {
    id: 'All' | 'Resolved' | 'Pending';
    label: string;
  }[] = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Resolved', label: 'Đã giải quyết' },
    { id: 'Pending', label: 'Chưa giải quyết' },
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

const ProblemFilter = ({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) => {
  const categories = [
    { id: 'Watering', label: 'Thiếu nước', icon: Leaf },
    { id: 'Resolved', label: 'Đã giải quyết', icon: Sprout },
    { id: 'Pending', label: 'Chưa giải quyết', icon: Scissors },
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
type FilterProblemByElements = {
  problems: any[];
  status: string;
  name: string;
};
const FilterProblemsByElements = ({
  problems = [],
  status = 'All',
  name = '',
}: FilterProblemByElements) => {
  let filter = problems;
  if (status !== 'All') {
    filter = filter.filter(problem => problem.status === status);
  }
  if (name !== '') {
    filter = filter.filter(problem =>
      problem.problem_name.toLowerCase().includes(name.toLowerCase()),
    );
  }
  return filter;
};
type ProblemCardProps = {
  problem: any;
};
export const ProblemCard = ({ problem }: ProblemCardProps) => {
  return (
    <VStack className='w-full'>
      <Card className='border-1 overflow-hidden rounded-xl'>
        <BoxUI className='w-full flex-row justify-center rounded-lg'>
          <VStack className='p-2'>
            <HStack className='w-full justify-between'>
              <Heading size='lg'>{problem.problem_name}</Heading>
              <StatusProblem status={problem.status} />
            </HStack>
            <BoxUI className='mt-2 rounded-lg border border-typography-200 p-2'>
              <HStack space='xs' className='items-center'>
                <VStack className='text-xs font-medium text-typography-600'>
                  <HStack space='xs' className='items-center'>
                    <Icon
                      as={UserIcon}
                      size='xs'
                      className='text-typography-500'
                    />
                    <Text className='text-xs text-typography-600'>
                      {problem.farmer_name || `Nông dân #${problem.farmer_id}`}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </BoxUI>
            <VStack className='ml-2 w-full' space='md'>
              <Text className='mt-4 text-sm'>
                <Icon as={Calendar} size='xs' className='text-typography-500' />{' '}
                {dayjs(problem.created_date).format('hh:mm DD/MM/YYYY') ||
                  'Không có'}
              </Text>

              <Text className='line-clamp-2 text-sm'>
                <Icon as={List} size='xs' className='text-typography-500' />
                {problem?.plan_name}
              </Text>
            </VStack>

            <Button
              className='mt-4 h-8 w-full'
              onPress={() => router.push(`/problem/${problem.id}`)}
            >
              <ButtonText>Chi tiết</ButtonText>
            </Button>
          </VStack>
        </BoxUI>
      </Card>
    </VStack>
  );
};

export const ProblemsScreen = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Resolved' | 'Pending'>(
    'All',
  );
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData] = useState(true);
  const [searchName, setSearchName] = useState('');
  const { user } = useSession();
  const { useFetchByParamsQuery } = useProblem();
  const [data, setData] = useState<IProblem[]>([]);
  const problemQuery = useFetchByParamsQuery({
    farmer_id: Number(user?.id),
  });
  const handleRefresh = () => {
    problemQuery.refetch();
  };
  const {
    data: problemsData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = problemQuery;
  const problems = problemsData?.data;
  useEffect(() => {
    setData(
      (problems ?? []).map(problem => ({
        ...problem,
      })) as unknown as IProblem[],
    );
  }, [problems]);
  const handleLoadMore = () => {
    refetch();
  };

  console.log(error);
  useEffect(() => {
    return setData(
      FilterProblemsByElements({
        problems: problems || [],
        status: activeTab,
        name: searchName,
      }),
    );
  }, [activeTab, searchName, problems]);
  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <VStack className='items-center justify-center py-4'>
        <Spinner size='small' color='$primary600' />
        <Text className='mt-2 text-center text-typography-500'>
          Đang tải thêm...
        </Text>
      </VStack>
    );
  };
  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      <BoxUI className='bg-background-0 px-4 py-3'>
        <Input
          variant='outline'
          className='rounded-xl bg-background-50 px-2'
          size='md'
        >
          <InputIcon className='text-typography-400' />
          <InputField
            onChangeText={setSearchName}
            placeholder='Tìm kiếm vấn đề...'
          />
        </Input>
      </BoxUI>
      <BoxUI className='mt-1 flex-col px-4'>
        <FilterTabs setActiveTab={setActiveTab} activeTab={activeTab} />
      </BoxUI>
      <VStack className='w-full flex-row justify-end p-5' space='2xl'>
        <Button onPress={() => router.push('/problem/create')}>
          <ButtonText>Tạo mới</ButtonText>
        </Button>
      </VStack>
      <Divider />

      {isLoading && (
        <VStack className='items-center justify-center py-10'>
          <Spinner size='large' color='$primary600' />
          <Text className='mt-4 text-center text-typography-500'>
            Đang tải dữ liệu...
          </Text>
        </VStack>
      )}
      {!isError && (
        <FlatList
          className='h-64 w-full flex-1 md:mb-2'
          contentContainerStyle={{
            paddingBottom: isWeb ? 0 : 140,
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isFetching}
              onRefresh={handleRefresh}
              colors={['#4F46E5']}
              tintColor='#4F46E5'
            />
          }
          data={problemsData?.data}
          keyExtractor={item => 'problem_' + item.id}
          renderItem={({ item }) => (
            <VStack>
              <ProblemCard problem={item} />
              <Divider />
            </VStack>
          )}
          onEndReachedThreshold={0.5}
        ></FlatList>
      )}
      {isError && (
        <HStack space='2xl' className='h-full w-full flex-1'>
          <VStack className='flex-1 items-center justify-center py-10'>
            <BoxUI className='bg-danger-100 mb-4 rounded-full p-4'>
              <Icon as={AlertCircle} size='xl' className='text-danger-600' />
            </BoxUI>
            <Text className='text-center text-typography-500'>
              Có lỗi xảy ra khi tải dữ liệu
            </Text>
            <Button className='mt-4' onPress={handleRefresh}>
              <ButtonText>Thử lại</ButtonText>
            </Button>
          </VStack>
        </HStack>
      )}
      {!isLoading && !isError && data?.length === 0 && (
        <VStack className='w-full items-center justify-center'>
          <Icon as={AlertTriangle} size='lg' className='mb-2 text-gray-500' />
          <Text className='text-center text-sm text-gray-600'>
            Không có dữ liệu
          </Text>
        </VStack>
      )}
    </SafeAreaView>
  );
};

export const CreateScreen = () => {
  const { user } = useSession();
  const [plan, setPlan] = useState<ISelectPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateProblem>({
    defaultValues: {
      farmer_id: user?.id ?? 0,
      problem_name: '',
      plan_id: 0,
      description: '',
    },
  });
  const [images, setImages] = useState<string[]>([]);
  const pickImage = () => {
    if (images.length >= 3) {
      Alert.alert('Lỗi', 'Chỉ được tải lên tối đa 3 ảnh');
      return;
    }
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      async response => {
        if (response.errorMessage) {
          Alert.alert('Lỗi', 'Lỗi tải ảnh: ' + response.errorMessage);
        } else {
          if (response.assets) {
            const { message, status, data } = await uploadProblemImage(
              response.assets[0],
            );
            if (status === 200 && data) {
              setImages([...images, ...data]);
            } else {
              Alert.alert('Lỗi', 'Không thể tải ảnh lên. Hãy thử lại!');
            }
          }
        }
      },
    );
  };
  useEffect(() => {
    const fetchPlan = async () => {
      const { status, data } = await planByFarmerId(user?.id ?? 0);
      if (status === 200 && data) {
        setIsLoading(false);
        setPlan(
          data.map((item: any) => ({
            id: item.id,
            plan_name: item.plan_name,
          })),
        );
      }
    };
    fetchPlan();
  }, []);
  if (!control && isLoading) {
    return (
      <VStack className='items-center justify-center py-10'>
        <Spinner size='large' color='$primary600' />
        <Text className='mt-4 text-center text-typography-500'>
          Đang tải dữ liệu...
        </Text>
      </VStack>
    );
  }
  const onSubmit = async (report: ICreateProblem) => {
    const income_data = { ...report, list_of_images: images } as ICreateProblem;
    console.log('income_data', income_data);
    const { status, data, message } = await createProblem(income_data);
    console.log('data', data);
    console.log('status', status);
    console.log('message', message);
    if (status && data) {
      Alert.alert('Thành công', 'Báo cáo thành công');
      router.push({
        pathname: '/problem/[id]',
        params: { id: data?.id?.toString() },
      });
    } else {
      Alert.alert(
        'Lỗi',
        (message as string) ?? 'Có lỗi xảy ra. Vui lòng thử lại!',
      );
    }
  };

  const removeImage = (index: string) => {
    setImages(images.filter(image => image !== index));
  };
  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      <Box className='p-4'>
        <HStack className='items-center'>
          <HStack space='md' className='flex-1 items-center justify-between'>
            <Pressable onPress={() => router.back()}>
              <Icon as={ArrowLeft} />
            </Pressable>
            <Heading size='md'>{'Tạo vấn đề'}</Heading>
            <Pressable onPress={() => {}}>
              <Icon as={MoreVertical} size='sm' className='text-primary-900' />
            </Pressable>
          </HStack>
        </HStack>
      </Box>
      <ScrollView className='h-full w-full flex-1'>
        <VStack className='w-full items-center justify-center'>
          <VStack className='w-5/6 gap-1' space='2xl'>
            {images.length > 0 && (
              <Box className='h-60 flex-row'>
                <Carousel
                  autoPlayInterval={2000}
                  height={320}
                  width={320}
                  loop={true}
                  pagingEnabled={true}
                  snapEnabled={true}
                  mode='parallax'
                  modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                  }}
                  data={images || []}
                  renderItem={({ item }) => (
                    <View>
                      {item ? (
                        <View key={`image-${item}`} className='relative'>
                          <Image
                            resizeMode='cover'
                            source={{ uri: item }}
                            alt={`image-${item}`}
                            className='mx-2 h-60 w-full rounded-lg object-cover'
                          />

                          <CloseIcon
                            style={{
                              position: 'absolute',
                              bottom: '90%',
                              left: '90%',
                              backgroundColor: 'black',
                            }}
                            color='white'
                            width={30}
                            height={30}
                            onPress={() => removeImage(item)}
                          />
                        </View>
                      ) : (
                        <Text>No Image</Text>
                      )}
                    </View>
                  )}
                />
              </Box>
            )}
            <Text style={{ color: 'red', fontSize: 12 }}>
              * Chú ý bạn chỉ đươc tải 3 ảnh
            </Text>
            <Button onPress={pickImage}>
              <ButtonText>Chọn ảnh</ButtonText>
            </Button>
          </VStack>

          <VStack
            className='mt-4 w-5/6 flex-col gap-4 rounded-lg border p-4'
            space='2xl'
          >
            <Text className='mb-5 text-center text-2xl font-bold'>
              Tạo mới vấn đề
            </Text>
            {control && (
              <View>
                <VStack>
                  <Text className='ml-2 font-bold'>Tên vấn đề</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input className='rounded'>
                        <InputField
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value ?? ''}
                          placeholder='Tên vấn đề'
                        />
                      </Input>
                    )}
                    name='problem_name'
                    rules={{ required: 'Tên vấn đề không được để trống' }}
                  />
                  {errors.problem_name && (
                    <Text className='text-red-500'>
                      {errors.problem_name.message}
                    </Text>
                  )}
                </VStack>
                <VStack>
                  <Text className='ml-2 font-bold'>Kế hoạch</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <RNPickerSelect
                        textInputProps={{
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}
                        onValueChange={onChange}
                        items={(plan || []).map(item => ({
                          label: item.plan_name,
                          value: item.id,
                        }))}
                      />
                    )}
                    name='plan_id'
                    rules={{ required: 'Kế hoạch không được để trống' }}
                  />
                  {errors.plan_id && (
                    <Text className='text-red-500'>
                      {errors.plan_id.message}
                    </Text>
                  )}
                </VStack>
                <VStack>
                  <Text className='ml-2 font-bold'>Mô tả</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input className='rounded'>
                        <InputField
                          onBlur={onBlur}
                          multiline
                          numberOfLines={5}
                          onChangeText={onChange}
                          value={value ?? ''}
                          placeholder='Mô tả'
                        />
                      </Input>
                    )}
                    name='description'
                  />
                </VStack>
                <Button className='mt-2' onPress={handleSubmit(onSubmit)}>
                  <ButtonText>Gửi</ButtonText>
                </Button>
              </View>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};
const FarmerCard = ({ farmer }: { farmer: any }) => {
  return (
    <Card className='mb-4 overflow-hidden rounded-lg'>
      <BoxUI>
        <HStack space='sm' className='mb-2 items-center'>
          <Icon as={Users} size='sm' className='text-primary-600' />
          <Text className='font-semibold'>Người báo cáo</Text>
        </HStack>
        {farmer !== null && (
          <VStack space='sm'>
            <HStack
              key={farmer?.farmer_id}
              className='items-center rounded-lg bg-success-50 p-2'
            >
              <Icon as={UserIcon} size='sm' className='mr-2 text-success-600' />
              <Text className='text-sm'>
                {farmer?.farmer_name || `Nông dân #${farmer.farmer_id}`}
              </Text>
            </HStack>
          </VStack>
        )}
      </BoxUI>
    </Card>
  );
};

export const ProblemDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [images, setImages] = useState<string[]>([]);

  const { user } = useSession();
  const { useFetchOneQuery } = useProblem();
  const problemQuery = useFetchOneQuery(Number(id));
  const handleRefresh = () => {
    problemQuery.refetch();
  };
  const { data: problems, isLoading, isError, error } = problemQuery;
  const problem = problems?.data;
  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      {/* Header */}
      <Box className='p-4'>
        <HStack className='items-center'>
          <HStack space='md' className='flex-1 items-center justify-between'>
            <Pressable onPress={() => router.back()}>
              <Icon as={ArrowLeft} />
            </Pressable>
            <Heading size='md'>Chi tiết vấn đề</Heading>
            <Pressable onPress={() => {}}>
              <Icon as={MoreVertical} size='sm' className='text-primary-900' />
            </Pressable>
          </HStack>
        </HStack>
      </Box>
      {isLoading && (
        <VStack className='items-center justify-center py-10'>
          <Spinner size='large' color='$primary600' />
          <Text className='mt-4 text-center text-typography-500'>
            Đang tải dữ liệu...
          </Text>
        </VStack>
      )}
      {isError && (
        <VStack className='items-center justify-center py-10'>
          <BoxUI className='bg-danger-100 mb-4 rounded-full p-4'>
            <Icon as={AlertCircle} size='xl' className='text-danger-600' />
          </BoxUI>
          <Text className='text-center text-typography-500'>
            Có lỗi xảy ra khi tải dữ liệu
          </Text>
          <Button className='mt-4' onPress={handleRefresh}>
            <ButtonText>Thử lại</ButtonText>
          </Button>
        </VStack>
      )}
      {!isError && (
        <ScrollView className='flex-1'>
          <Card className='overflow-hidden rounded-xl'>
            <Box>
              <VStack space='md'>
                <HStack className='items-center justify-between'>
                  <HStack space='sm' className='items-center'>
                    <VStack>
                      <Heading size='sm' className='text-typography-500'>
                        {problem?.problem_name}
                      </Heading>
                    </VStack>
                  </HStack>
                  <Box className={'rounded-full px-3 py-1'}>
                    <StatusProblem status={problem?.status || 'Pending'} />
                  </Box>
                </HStack>

                <Divider />

                <VStack space='sm'>
                  <Text className='font-semibold'>Thời gian</Text>
                  <Text className='text-sm text-typography-700'>
                    {dayjs(problem?.created_date).format('hh:mm DD/MM/YYYY')}
                  </Text>
                  <Text className='font-semibold'>Mô tả</Text>
                  <Text className='text-sm text-typography-700'>
                    {problem?.description}
                  </Text>
                  <Text className='font-semibold'>Kế hoạch</Text>
                  <Text className='text-sm text-typography-700'>
                    {problem?.plan_name}
                  </Text>
                  {problem?.result_content && (
                    <>
                      <Text className='mt-2 font-semibold'>Kết quả</Text>
                      <Box className='rounded-lg border border-success-200 bg-success-50 p-3'>
                        <Text className='text-sm text-success-800'>
                          {problem?.result_content}
                        </Text>
                      </Box>
                    </>
                  )}
                </VStack>

                <Card className='rounded-lg bg-typography-50 p-3'>
                  <VStack space='sm'>
                    {problem?.farmer_id && (
                      <Box>
                        <FarmerCard
                          farmer={{
                            farmer_id: problem?.farmer_id,
                            farmer_name: problem?.farmer_name,
                          }}
                        />
                      </Box>
                    )}

                    {problem?.problem_images &&
                      problem?.problem_images?.length > 0 && (
                        <Box className='mx-4 mb-4'>
                          <HStack className='mb-2 items-center justify-between'>
                            <Text className='font-semibold'>Hình ảnh</Text>
                            {problem?.problem_images?.length > 1 && (
                              <Pressable>
                                <Text className='text-xs text-primary-600'>
                                  Xem tất cả
                                </Text>
                              </Pressable>
                            )}
                          </HStack>

                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                          >
                            <HStack space='sm'>
                              {problem?.problem_images?.map((image, index) => (
                                <Box
                                  key={index}
                                  className='h-48 w-48 overflow-hidden rounded-xl'
                                >
                                  <Image
                                    size='full'
                                    source={{ uri: image.url }}
                                    resizeMode='cover'
                                  />
                                </Box>
                              ))}
                            </HStack>
                          </ScrollView>
                        </Box>
                      )}
                  </VStack>
                </Card>
              </VStack>
            </Box>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

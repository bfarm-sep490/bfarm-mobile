import React, { useEffect, useState, useCallback } from 'react';

import {
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, router, useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  MoreVertical,
  UserIcon,
  Users,
  AlertTriangle,
  Search,
  XCircle,
  CheckCircle2,
  Info,
  Camera,
  ImageIcon,
  X,
} from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import Carousel from 'react-native-reanimated-carousel';
import { ICreateProblem } from 'src/interfaces';

import { StatusProblem } from '@/components/status-tag/problem-tag';
import {
  Box,
  Heading,
  HStack,
  Input,
  InputField,
  InputIcon,
  CloseIcon,
  ScrollView,
  VStack,
  Text,
  Image,
  View,
  Button,
  ButtonText,
  Icon,
  Card,
  Divider,
  Spinner,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui';
import { Box as BoxUI } from '@/components/ui/box';
import { useSession } from '@/context/ctx';
import { useProblem } from '@/services/api/problems/useProblem';

// Update status filter
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolve':
      return {
        bg: 'bg-success-100',
        text: 'text-success-700',
        icon: CheckCircle2,
      };
    case 'Pending':
      return {
        bg: 'bg-danger-100',
        text: 'text-danger-700',
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

const ProblemCard = ({ problem }: { problem: any }) => {
  const router = useRouter();
  const statusStyle = getStatusColor(problem.status);

  return (
    <Card className='mb-3 overflow-hidden rounded-xl'>
      <BoxUI>
        <VStack space='md'>
          {/* Problem header with name and status */}
          <HStack className='items-center justify-between'>
            <HStack space='sm' className='flex-1 items-center pr-2'>
              <BoxUI className='rounded-lg bg-primary-100 p-2'>
                <Icon as={AlertCircle} size='sm' className='text-primary-700' />
              </BoxUI>
              <VStack className='flex-1'>
                <Text
                  className='text-base font-semibold'
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {problem.problem_name}
                </Text>
                <Text className='text-xs text-typography-500'>
                  {problem.plan_name}
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
                  {problem.status === 'Resolve'
                    ? 'Đã giải quyết'
                    : 'Chưa giải quyết'}
                </Text>
              </HStack>
            </BoxUI>
          </HStack>

          {/* Farmer information */}
          <BoxUI className='rounded-lg border border-typography-200 p-2'>
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

          {/* Problem description */}
          <Text className='text-sm text-typography-700'>
            {problem.description || 'Không có mô tả'}
          </Text>

          {/* Problem details */}
          <VStack space='xs'>
            <HStack space='sm' className='items-center'>
              <Icon as={Calendar} size='xs' className='text-typography-500' />
              <Text className='text-xs text-typography-500'>
                {dayjs(problem.created_date).format('DD/MM/YYYY HH:mm')}
              </Text>
            </HStack>

            {/* Show result if available */}
            {problem.result_content && (
              <BoxUI className='mt-2 rounded-lg bg-typography-50 p-2'>
                <Text className='text-xs text-typography-700'>
                  {problem.result_content}
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
              onPress={() => router.push(`/problem/${problem.id}`)}
            >
              <ButtonText>Chi tiết</ButtonText>
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
  activeTab: 'All' | 'Resolve' | 'Pending';
  setActiveTab: React.Dispatch<
    React.SetStateAction<'All' | 'Resolve' | 'Pending'>
  >;
}) => {
  const tabs: {
    id: 'All' | 'Resolve' | 'Pending';
    label: string;
  }[] = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Resolve', label: 'Đã giải quyết' },
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

export const ProblemsScreen = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Resolve' | 'Pending'>(
    'All',
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, currentPlan } = useSession();
  const { useFetchByParamsQuery } = useProblem();

  // Create params for API call
  const problemParams = {
    plan_id: currentPlan?.id,
    farmer_id: user?.id,
    page_number: pageNumber,
    page_size: pageSize,
    ...(activeTab !== 'All' && { status: activeTab }),
    ...(searchQuery && { name: searchQuery }),
  };

  const problemQuery = useFetchByParamsQuery(problemParams);
  const {
    data: problemsData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = problemQuery;
  const problems = problemsData?.data || [];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPageSize(10);
    setHasMore(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPageSize(prev => prev + 10);
    }
  }, [isLoading, hasMore]);

  // Update hasMore based on data length
  useEffect(() => {
    if (problems && problems.length < pageSize) {
      setHasMore(false);
    }
  }, [problems, pageSize]);

  const renderFooter = () => {
    if (isLoading) {
      return (
        <VStack className='items-center justify-center py-4'>
          <Spinner size='small' color='$primary600' />
        </VStack>
      );
    }

    if (!hasMore && problems.length > 0) {
      return (
        <VStack className='items-center justify-center py-4'>
          <Text className='text-sm text-typography-500'>Đã hết dữ liệu</Text>
        </VStack>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className='flex-1 bg-background-0'>
      {/* Header */}
      <BoxUI className='px-4 py-4'>
        <HStack className='items-center justify-between'>
          <HStack space='md' className='items-center'>
            <Heading size='lg'>Quản lý vấn đề</Heading>
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
            placeholder='Tìm kiếm vấn đề...'
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
      </BoxUI>

      {/* Create button */}
      <BoxUI className='px-4 py-3'>
        <Button
          onPress={() => router.push('/problem/create')}
          className='bg-primary-600'
        >
          <ButtonText className='text-white'>Tạo mới</ButtonText>
        </Button>
      </BoxUI>

      {/* List Section */}
      <BoxUI className='flex-1'>
        {isError && !isLoading && (
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
          <FlashList
            data={problems}
            renderItem={({ item }) => (
              <BoxUI className='px-4 py-2'>
                <ProblemCard problem={item} />
              </BoxUI>
            )}
            keyExtractor={item => 'problem_' + item.id}
            estimatedItemSize={200}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              !isLoading ? (
                <VStack className='items-center justify-center py-10'>
                  <BoxUI className='mb-4 rounded-full bg-typography-100 p-4'>
                    <Icon
                      as={AlertTriangle}
                      size='xl'
                      className='text-typography-400'
                    />
                  </BoxUI>
                  <Text className='text-center text-typography-500'>
                    Không tìm thấy vấn đề phù hợp
                  </Text>
                  <Text className='mt-1 text-center text-xs text-typography-400'>
                    Thử thay đổi bộ lọc hoặc tìm kiếm
                  </Text>
                  <Button
                    className='mt-4'
                    variant='outline'
                    onPress={() => {
                      setActiveTab('All');
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
    </SafeAreaView>
  );
};

export const CreateScreen = () => {
  const { user, currentPlan } = useSession();
  const { useCreateProblemMutation, useUploadImagesMutation } = useProblem();
  const createProblemMutation = useCreateProblemMutation({
    id: 0,
    problem_name: '',
    date: new Date(),
    status: 'pending',
    farmer_id: user?.id ?? 0,
    plan_id: currentPlan?.id ?? 0,
    description: '',
    list_of_images: [],
  });
  const uploadImagesMutation = useUploadImagesMutation();

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ICreateProblem>({
    defaultValues: {
      farmer_id: user?.id ?? 0,
      problem_name: '',
      plan_id: currentPlan?.id ?? 0,
      description: '',
    },
  });
  const [images, setImages] = useState<string[]>([]);

  // Update form values when plan changes
  useEffect(() => {
    if (currentPlan?.id) {
      setValue('plan_id', currentPlan.id);
    }
  }, [currentPlan, setValue]);

  const pickImageFromGallery = async () => {
    if (images.length >= 3) {
      Alert.alert('Lỗi', 'Chỉ được tải lên tối đa 3 ảnh');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
        allowsEditing: true,
      });

      if (result.canceled) {
        return;
      }

      setIsUploading(true);

      const file = result.assets[0];
      const fileData = {
        uri: file.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };

      const uploadResult = await uploadImagesMutation.mutateAsync([
        fileData as any,
      ]);
      if (uploadResult.data) {
        setImages(prev => [...prev, ...uploadResult.data]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Hãy thử lại!');
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 3) {
      Alert.alert('Lỗi', 'Chỉ được tải lên tối đa 3 ảnh');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (result.canceled) {
        return;
      }

      setIsUploading(true);

      const file = result.assets[0];
      const fileData = {
        uri: file.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };

      const uploadResult = await uploadImagesMutation.mutateAsync([
        fileData as any,
      ]);
      if (uploadResult.data) {
        setImages(prev => [...prev, ...uploadResult.data]);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Hãy thử lại!');
    } finally {
      setIsUploading(false);
    }
  };

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
    try {
      // Ensure we're using the current plan
      const currentPlanId = currentPlan?.id;
      if (!currentPlanId) {
        Alert.alert('Lỗi', 'Vui lòng chọn kế hoạch trước khi tạo vấn đề');
        return;
      }

      const result = await createProblemMutation.mutateAsync({
        data: {
          ...report,
          plan_id: currentPlanId, // Use current plan ID
          list_of_images: images,
          description: report.description || '',
        },
      });

      if (result.data) {
        Alert.alert('Thành công', 'Báo cáo thành công');
        reset({
          farmer_id: user?.id ?? 0,
          problem_name: '',
          plan_id: currentPlanId,
          description: '',
        });
        setImages([]);
        router.push({
          pathname: '/problem/[id]',
          params: { id: result.data.id?.toString() },
        });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại!');
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
            <Pressable onPress={() => router.push('/problem')}>
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
        <VStack className='w-full items-center justify-center p-4' space='lg'>
          {/* Current Plan Info */}
          <Card className='w-full p-4'>
            <VStack space='sm'>
              <Heading size='sm'>Kế hoạch hiện tại</Heading>
              <Box className='rounded-lg border border-primary-200 bg-primary-50 p-3'>
                <Text className='text-sm font-medium text-primary-800'>
                  {currentPlan?.plan_name || 'Chưa chọn kế hoạch'}
                </Text>
                {!currentPlan && (
                  <Text className='mt-1 text-xs text-typography-500'>
                    Vui lòng chọn kế hoạch trước khi tạo vấn đề
                  </Text>
                )}
              </Box>
            </VStack>
          </Card>

          {/* Image Section */}
          <Card className='w-full p-4'>
            <VStack space='md'>
              <Heading size='sm'>Hình ảnh</Heading>
              <Text className='text-xs text-typography-500'>
                Tối đa 3 ảnh (bắt buộc)
              </Text>

              {/* Selected images */}
              {images.length > 0 && (
                <Box className='mt-2'>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space='sm'>
                      {images.map((image, index) => (
                        <Box
                          key={index}
                          className='relative h-20 w-20 overflow-hidden rounded-md'
                        >
                          <Image
                            source={{ uri: image }}
                            style={styles.previewImage}
                          />
                          <Pressable
                            className='absolute right-1 top-1 rounded-full bg-black/50 p-1'
                            onPress={() => removeImage(image)}
                          >
                            <Icon as={X} size='xs' color='white' />
                          </Pressable>
                        </Box>
                      ))}
                    </HStack>
                  </ScrollView>
                </Box>
              )}

              {/* Image picker buttons */}
              <HStack className='mt-2 flex-wrap items-center'>
                <Pressable
                  className='mb-2 mr-2 items-center justify-center rounded-lg border border-dashed border-typography-300 p-2'
                  onPress={takePhoto}
                >
                  <VStack className='items-center'>
                    <Icon as={Camera} className='text-typography-500' />
                    <Text className='text-xs text-typography-500'>
                      Chụp ảnh
                    </Text>
                  </VStack>
                </Pressable>

                <Pressable
                  className='mb-2 mr-2 items-center justify-center rounded-lg border border-dashed border-typography-300 p-2'
                  onPress={pickImageFromGallery}
                >
                  <VStack className='items-center'>
                    <Icon as={ImageIcon} className='text-typography-500' />
                    <Text className='text-xs text-typography-500'>
                      Thư viện
                    </Text>
                  </VStack>
                </Pressable>
              </HStack>
            </VStack>
          </Card>

          {/* Form Section */}
          <Card className='w-full p-4'>
            <VStack space='lg'>
              <Heading size='sm'>Thông tin vấn đề</Heading>

              <FormControl isInvalid={!!errors.problem_name}>
                <FormControlLabel>
                  <FormControlLabelText>Tên vấn đề</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ?? ''}
                        placeholder='Nhập tên vấn đề'
                      />
                    </Input>
                  )}
                  name='problem_name'
                  rules={{ required: 'Tên vấn đề không được để trống' }}
                />
                {errors.problem_name && (
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.problem_name.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Mô tả</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        onBlur={onBlur}
                        multiline
                        numberOfLines={4}
                        onChangeText={onChange}
                        value={value ?? ''}
                        placeholder='Nhập mô tả vấn đề'
                      />
                    </Input>
                  )}
                  name='description'
                />
                <FormControlHelper>
                  <FormControlHelperText>
                    Mô tả chi tiết về vấn đề bạn gặp phải
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>

              <Button
                size='lg'
                variant='solid'
                onPress={handleSubmit(onSubmit)}
                isDisabled={isUploading || images.length === 0 || !currentPlan}
              >
                {isUploading ? (
                  <HStack space='sm'>
                    <Spinner size='small' color='white' />
                    <ButtonText>Đang tải lên...</ButtonText>
                  </HStack>
                ) : !currentPlan ? (
                  <ButtonText>Vui lòng chọn kế hoạch</ButtonText>
                ) : (
                  <ButtonText>Tạo vấn đề</ButtonText>
                )}
              </Button>
            </VStack>
          </Card>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  detailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

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
            <Pressable onPress={() => router.push('/problem')}>
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

      {!isError && problem && (
        <ScrollView className='flex-1'>
          <VStack className='p-4' space='lg'>
            {/* Problem Header */}
            <Card className='w-full p-4'>
              <VStack space='md'>
                <HStack className='items-center justify-between'>
                  <VStack space='xs'>
                    <Heading size='lg'>{problem.problem_name}</Heading>
                    <Text className='text-sm text-typography-500'>
                      {problem.plan_name}
                    </Text>
                  </VStack>
                  <Box className='rounded-full px-3 py-1'>
                    <StatusProblem status={problem.status || 'Pending'} />
                  </Box>
                </HStack>

                <Divider />

                {/* Farmer Info */}
                <Box className='rounded-lg border border-typography-200 p-3'>
                  <HStack space='sm' className='items-center'>
                    <Icon
                      as={UserIcon}
                      size='sm'
                      className='text-primary-600'
                    />
                    <VStack space='xs'>
                      <Text className='font-medium'>Người báo cáo</Text>
                      <Text className='text-sm text-typography-600'>
                        {problem.farmer_name ||
                          `Nông dân #${problem.farmer_id}`}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Problem Details */}
                <VStack space='md'>
                  <HStack space='sm' className='items-center'>
                    <Icon
                      as={Calendar}
                      size='sm'
                      className='text-typography-500'
                    />
                    <Text className='text-sm text-typography-600'>
                      {dayjs(problem.created_date).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </HStack>

                  <VStack space='xs'>
                    <Text className='font-medium'>Mô tả vấn đề</Text>
                    <Text className='text-sm text-typography-600'>
                      {problem.description || 'Không có mô tả'}
                    </Text>
                  </VStack>
                </VStack>
              </VStack>
            </Card>

            {/* Problem Images */}
            {problem.problem_images && problem.problem_images.length > 0 && (
              <Card className='w-full p-4'>
                <VStack space='md'>
                  <Heading size='sm'>Hình ảnh</Heading>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack space='sm'>
                      {problem.problem_images.map((image, index) => (
                        <Box
                          key={index}
                          className='h-48 w-48 overflow-hidden rounded-xl'
                        >
                          <Image
                            source={{ uri: image.url }}
                            style={styles.detailImage}
                          />
                        </Box>
                      ))}
                    </HStack>
                  </ScrollView>
                </VStack>
              </Card>
            )}

            {/* Problem Result */}
            {problem.result_content && (
              <Card className='w-full p-4'>
                <VStack space='md'>
                  <HStack space='sm' className='items-center'>
                    <Icon
                      as={CheckCircle2}
                      size='sm'
                      className='text-success-600'
                    />
                    <Heading size='sm'>Kết quả xử lý</Heading>
                  </HStack>
                  <Box className='rounded-lg border border-success-200 bg-success-50 p-3'>
                    <Text className='text-sm text-success-800'>
                      {problem.result_content}
                    </Text>
                  </Box>
                </VStack>
              </Card>
            )}
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

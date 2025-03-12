import React, { useEffect, useState } from 'react';

import { Alert } from 'react-native';

import { Link, useLocalSearchParams, router } from 'expo-router';
import Moment from 'moment';
import { useForm, Controller, Form } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
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
  SearchIcon,
  CalendarDaysIcon,
  Image,
  SelectInput,
  SelectItem,
  View,
  Button,
  Slider,
  UISlider,
  ButtonText,
} from '@/components/ui';
import {
  createProblem,
  getProblemsByFarmerId,
  getProblemsById,
  uploadProblemImage,
} from '@/services/problems';

const exmaple_plan: ISelectPlan[] = [
  {
    id: 1,
    plan_name: 'Plan A',
  },
  {
    id: 2,
    plan_name: 'Plan B',
  },
  {
    id: 3,
    plan_name: 'Plan C',
  },
  {
    id: 4,
    plan_name: 'Plan D',
  },
];

export const ProblemsScreen = () => {
  const [data, setData] = useState<IProblem[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProblemsByFarmerId(1);
        if (response?.data) {
          setData(response.data);
        }
        setMessage(response.message as string);
        setStatus(response.status);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <VStack
      className='mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6'
      space='2xl'
    >
      <VStack className='w-full' space='2xl'>
        <Input className='rounded text-center md:hidden'>
          <InputField placeholder='Search' />
          <InputSlot className='pr-3'>
            <InputIcon as={SearchIcon} />
          </InputSlot>
        </Input>
        <VStack className='w-full flex-row' space='2xl'>
          <View className='h-10 w-40 rounded md:hidden'>
            <RNPickerSelect
              textInputProps={{
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
              placeholder={{ label: 'Tất cả', value: null }}
              onValueChange={value => console.log(value)}
              items={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Resolved', value: 'Resolved' },
              ]}
            />
          </View>

          <Input className='h-10 w-40 rounded text-center md:hidden'>
            <InputField
              onFocus={false}
              pointerEvents='none'
              onPress={() => setOpen(true)}
              value={date ? date?.toLocaleDateString('vi-VN') : ''}
              placeholder='Chọn ngày'
            />
            <InputSlot className='pr-3'>
              <InputIcon as={CalendarDaysIcon} />
            </InputSlot>
          </Input>
          <DatePicker
            modal
            open={open}
            date={date ?? new Date()}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </VStack>
      </VStack>
      <VStack className='mt-4 w-full flex-row justify-between' space='2xl'>
        <Heading size='2xl' className='font-roboto'>
          Các vấn đề
        </Heading>
        <Button onPress={() => router.push('/problem/create')}>
          <ButtonText>Tạo mới</ButtonText>
        </Button>
      </VStack>
      <HStack space='2xl' className='h-full w-full flex-1'>
        <ScrollView
          className='max-w-[900px] flex-1 md:mb-2'
          contentContainerStyle={{
            paddingBottom: isWeb ? 0 : 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className='w-full gap-3' space='2xl'>
            {data?.map((item, index) => {
              return (
                <Link
                  className='w-full'
                  href={{
                    pathname: '/problem/[id]',
                    params: { id: `${item.id}` },
                  }}
                  key={index}
                >
                  <VStack
                    className='border-border-300 w-full rounded-xl border p-5'
                    key={index}
                  >
                    <VStack className='mt-4' space='md'>
                      <VStack className='flex-row justify-between' space='md'>
                        <Heading size='md'>{item.problem_name}</Heading>
                        <StatusProblem status={item.status} />
                      </VStack>
                      <VStack className='ml-4' space='md'>
                        <Text className='text-sm'>
                          {Moment(item.date).format('hh:mm DD/MM/YYYY') ||
                            'Không có'}
                        </Text>
                        <Text className='line-clamp-2'>
                          Vấn đề: {item.problem_type}
                        </Text>
                      </VStack>
                    </VStack>
                  </VStack>
                </Link>
              );
            })}
          </VStack>
        </ScrollView>
      </HStack>
    </VStack>
  );
};

export const DetailProblemScreen = () => {
  const searchParams = useLocalSearchParams();

  const [data, setData] = useState<IProblem | null>(null);
  const id = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;
  console.log('id', id);
  useEffect(() => {
    const fetchData = async () => {
      const { data, message, status } = await getProblemsById(
        (id as unknown as number) || 1,
      );
      setData(data);
      console.log('message', message);
    };
    fetchData();
  }, []);
  Moment.locale('vi');
  return (
    <VStack
      className='mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6'
      space='2xl'
    >
      <ScrollView
        className='h-full w-full flex-1'
        contentContainerStyle={{
          paddingBottom: isWeb ? 0 : 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack
          space='2xl'
          className='w-full flex-col items-center justify-center'
        >
          <Box className='align-center h-60 w-5/6 flex-row justify-center rounded-lg'>
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
              data={data?.problem_images || []}
              renderItem={({ item }) => (
                <View key={item.image_id}>
                  {item?.url ? (
                    <Image
                      resizeMode='cover'
                      key={`image-${item.image_id}`}
                      source={{ uri: item.url }}
                      alt={`image-${item.image_id}`}
                      className='mx-2 h-60 w-full rounded-lg object-cover'
                    />
                  ) : (
                    <Text>No Image</Text>
                  )}
                </View>
              )}
            />
          </Box>
          <VStack
            className='flex w-5/6 min-w-40 flex-col gap-1 rounded-lg border p-4'
            space='2xl'
          >
            <Text className='text-center text-2xl font-bold'>
              Chi tiết vấn đề
            </Text>
            <VStack className='flex-row justify-between' space='md'>
              <Heading size='md'>{data?.problem_name}</Heading>
              <StatusProblem status={data?.status ?? ''} />
            </VStack>
            <VStack className='line-clamp-2 justify-end' space='md'>
              <Text className='text-sm'>
                <Text className='font-bold'>Thời gian: </Text>
                {Moment(data?.date).format('hh:mm DD/MM/YYYY') ||
                  'Không có thời gian'}
              </Text>
              <Text className='line-clamp-2'>
                <Text className='font-bold'>Vấn đề:</Text> {data?.problem_type}
              </Text>
              <Text className='line-clamp-2'>
                <Text className='font-bold'>Kế hoạch:</Text>{' '}
                {exmaple_plan?.find(x => x.id === data?.plan_id)?.plan_name ||
                  'Không thuộc kế hoạch nào'}
              </Text>
              <Text className='line-clamp-2'>
                {' '}
                <Text className='font-bold'>Mô tả:</Text>{' '}
                {data?.description || 'Không có mô tả'}
              </Text>
            </VStack>
          </VStack>
          <VStack
            className='flex min-h-32 w-5/6 flex-col gap-4 rounded-lg border p-4'
            space='2xl'
          >
            <Text className='mb-5 text-center text-2xl font-bold'>
              Kết quả xử lý
            </Text>
            {data?.result_content ? (
              <Text className='line-clamp-2 text-center'>
                <Text className='font-bold'>Kết quả: </Text>{' '}
                {data?.result_content}
              </Text>
            ) : (
              <Text>Chưa có kết quả</Text>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export const CreateScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateProblem>({
    defaultValues: {
      problem_name: '',
      problem_type: '',
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
      { mediaType: 'photo', selectionLimit: 3 },
      async response => {
        if (response.errorMessage) {
          Alert.alert('Lỗi', 'Lỗi tải ảnh: ' + response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const { message, status, data } = await uploadProblemImage(
              response.assets,
            );
            console.log(data);
            if (status === 200 && data) {
              console.log(data);

              setImages([...images, ...data]);
            } else {
              Alert.alert('Lỗi', 'Không thể tải ảnh lên. Hãy thử lại!');
            }
          }
        }
      },
    );
  };
  if (!control) {
    return <Text>Loading...</Text>;
  }
  const onSubmit = async (report: ICreateProblem) => {
    const income_data = { ...report, problem_images: images } as ICreateProblem;
    const { status, data, message } = await createProblem(income_data);

    if (status && data) {
      Alert.alert('Thành công', 'Báo cáo thành công');
      router.push({
        pathname: '/problem/[id]',
        params: { id: data?.id?.toString() },
      });
    } else {
      Alert.alert('Lỗi', 'Không thể báo cáo. Hãy thử lại!');
    }
  };

  const removeImage = (index: string) => {
    setImages(images.filter(image => image !== index));
  };
  return (
    <VStack
      className='mb-20 flex h-full w-full max-w-[1500px] justify-center self-center p-4 pb-0 align-middle md:mb-2 md:px-10 md:pb-0 md:pt-6'
      space='2xl'
    >
      <ScrollView
        className='h-full w-full flex-1'
        contentContainerStyle={{
          paddingBottom: isWeb ? 0 : 140,
        }}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={{ color: 'red', fontSize: 8 }}>
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
                  <Text className='ml-2 font-bold'>Loại vấn đề</Text>

                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <RNPickerSelect
                        textInputProps={{
                          textAlign: 'center',
                          textAlignVertical: 'center',
                        }}
                        onValueChange={onChange}
                        items={[
                          { label: 'Technical', value: 'Technical' },
                          { label: 'UI/UX', value: 'UI/UX' },
                          { label: 'Performance', value: 'Performance' },
                          { label: 'Security', value: 'Security' },
                        ]}
                      />
                    )}
                    name='problem_type'
                    rules={{ required: 'Loại vấn đề không được để trống' }}
                  />
                  {errors.problem_type && (
                    <Text className='text-red-500'>
                      {errors.problem_type.message}
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
                        items={exmaple_plan.map(item => ({
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
    </VStack>
  );
};

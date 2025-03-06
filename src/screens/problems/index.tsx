import React, { Key, useState } from 'react';

import { Alert, TouchableOpacity } from 'react-native';

import { S } from '@expo/html-elements';
import axios from 'axios';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { useForm, Controller, Form } from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import { TextInput } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import Carousel from 'react-native-reanimated-carousel';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import {
  Box,
  Heading,
  HStack,
  Input,
  InputField,
  InputIcon,
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

interface IProblem {
  id: Key;
  problem_name: string;
  description?: string;
  problem_type: string;
  date: Date;
  status: string;
  plan_id: number;
  result_content?: string;
  problem_images?: IProblemImage[];
}

interface ISelectPlan {
  id: Key;
  plan_name: string;
}

interface IProblemImage {
  image_id: Key;
  image_url: string;
}
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
const example_data: IProblem[] = [
  {
    id: 1,
    problem_name: 'Database Connection Issue',
    description: 'The system fails to connect to the database intermittently.',
    problem_type: 'Technical',
    date: new Date('2025-03-01'),
    status: 'Pending',
    plan_id: 1,
    result_content: 'Investigating possible network issues.',
    problem_images: [
      {
        image_id: 1,
        image_url:
          'https://khoinguonsangtao.vn/wp-content/uploads/2022/10/anh-trai-dep-han-quoc.jpg',
      },
      {
        image_id: 2,
        image_url:
          'https://th.bing.com/th/id/R.1d2a685a03fbba7321e98119f8f1387e?rik=ywJ1cVbg2kEB0g&pid=ImgRaw&r=0',
      },
    ],
  },
  {
    id: 2,
    problem_name: 'UI Rendering Bug',
    description:
      'Some UI components are not displaying correctly in dark mode.',
    problem_type: 'UI/UX',
    date: new Date('2025-03-02'),
    status: 'Pending',
    plan_id: 2,
    problem_images: [
      { image_id: 2, image_url: 'https://example.com/images/ui_bug.png' },
      { image_id: 3, image_url: 'https://example.com/images/ui_bug_2.png' },
    ],
  },
  {
    id: 3,
    problem_name: 'Slow API Response',
    description: 'The API response time is longer than expected.',
    problem_type: 'Performance',
    date: new Date('2025-03-03'),
    status: 'Resolved',
    plan_id: 3,
    result_content: 'Optimized database queries and improved caching.',
  },
  {
    id: 4,
    problem_name: 'User Authentication Failure',
    problem_type: 'Security',
    date: new Date('2025-03-04'),
    status: 'Pending',
    plan_id: 4,
    problem_images: [],
  },
];
export const StatusProblem = ({ status }: { status: string }) => {
  const getValueStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xử lý';
      case 'Resolved':
        return 'Đã xử lý';
      default:
        return 'Unknown';
    }
  };

  const getColorStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return ['#F59E0B', '#FDE68A'];
      case 'Resolved':
        return ['#10B981', '#6EE7B7'];
      default:
        return ['#000000', '#FFFFFF'];
    }
  };
  return (
    <Text
      style={{
        borderRadius: 6,
        borderWidth: 1,
        borderColor: getColorStatus(status)?.[0] || 'transparent',
        backgroundColor: getColorStatus(status)?.[1] || 'transparent',
        paddingBottom: 1,
        paddingTop: 1,
        paddingLeft: 4,
        paddingRight: 4,
        color: getColorStatus(status)?.[0] || 'black',
        fontSize: 11,
        minWidth: 60,
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      {getValueStatus(status)}
    </Text>
  );
};

export const ProblemsScreen = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
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
              pointerEvents='none'
              onPress={() => setOpen(true)}
              value={date.getDate().toString() || ''}
              placeholder='Chọn ngày'
            />
            <InputSlot className='pr-3'>
              <InputIcon as={CalendarDaysIcon} />
            </InputSlot>
          </Input>
          <DatePicker
            modal
            open={open}
            date={date}
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
        <Link
          className='w-full'
          href={{
            pathname: '/problem/create',
          }}
          key={'create-problem-new'}
        >
          <Text>Tạo mới</Text>
        </Link>
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
            {example_data.map((item, index) => {
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
                          {item.date.toDateString()}
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
  const { id } = useLocalSearchParams();
  const data = example_data?.find(item => item.id === Number(id));
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
        <VStack space='2xl' className='w-full flex-col justify-center'>
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
                  {item?.image_url ? (
                    <Image
                      resizeMode='cover'
                      key={`image-${item.image_id}`}
                      source={{ uri: item.image_url }}
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
              <StatusProblem status='Pending' />
            </VStack>
            <VStack className='line-clamp-2 justify-end' space='md'>
              <Text className='text-sm'>
                <Text className='font-bold'>Thời gian: </Text>
                {data?.date.toLocaleDateString('vi-VN') || 'Không có thời gian'}
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
            className='flex min-h-80 w-5/6 flex-col gap-4 rounded-lg border p-4'
            space='2xl'
          >
            <Text className='mb-5 text-center text-2xl font-bold'>
              Kết quả xử lý
            </Text>
            {data?.result_content ? (
              <Text className='line-clamp-2 text-center'>
                <Text className='font-bold'>Kết quả</Text>{' '}
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
  } = useForm<IProblem>({
    defaultValues: {
      problem_name: '',
      problem_type: '',
      plan_id: 0,
      description: '',
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
        Alert.alert('Lỗi', 'Lỗi tải ảnh: ' + response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const flag = await uploadImage(response.assets[0]);
          if (flag === true) {
            Alert.alert('Thành công', 'Tải ảnh lên thành công');
          }
        }
      }
    });
  };
  const uploadImage = async (image: any) => {
    if (!image) {
      Alert.alert('Chưa chọn ảnh', 'Vui lòng chọn ảnh trước khi upload');
      return;
    }

    const formData = new FormData();
    const imageBlob = {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    } as unknown as Blob;
    formData.append('image', imageBlob, image.fileName);

    try {
      const response = await axios.post(
        'https://api.outfit4rent.online/api/problems/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (
        response.data.status === 200 &&
        response.data?.data &&
        response.data
      ) {
        setImages([...images, response.data.data?.[0]]);
        return true;
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Hãy thử lại!');
      return false;
    }
    return false;
  };
  if (!control) {
    return <Text>Loading...</Text>;
  }
  const onSubmit = async (data: IProblem) => {
    try {
      const payload = {
        issue_id: null,
        ...data,
        list_of_images: images,
      };
      console.log(payload);
      const response = await axios.post(
        'https://api.outfit4rent.online/api/problems',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(response.data);
      if (response.data?.data?.id) {
        Alert.alert('Thành công', 'Tạo vấn đề thành công');
        router.push({
          pathname: '/problem/[id]',
          params: { id: response.data.data.id },
        });
      } else {
        Alert.alert('Lỗiaa', 'Không thể tạo vấn đề. Hãy thử lại!');
      }
    } catch (error) {
      Alert.alert('Lỗibb', 'Không thể tạo vấn đề. Hãy thử lại!');
      console.error(error);
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
                        <TouchableOpacity
                          onPress={() => removeImage(item)}
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            backgroundColor: 'red',
                            padding: 5,
                            borderRadius: 50,
                          }}
                        >
                          <Text>X</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text>No Image</Text>
                    )}
                  </View>
                )}
              />
            </Box>
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

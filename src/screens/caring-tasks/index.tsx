import React, { useEffect, useState } from 'react';

import { Text, Image, Alert } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import Moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Carousel from 'react-native-reanimated-carousel';
import { ICaringTask, IReportCaringTask } from 'src/interfaces';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import { StatusTask } from '@/components/status-tag/task-tag';
import {
  Box,
  Button,
  ButtonText,
  CloseIcon,
  Heading,
  Input,
  InputField,
  ScrollView,
  View,
  VStack,
} from '@/components/ui';
import {
  getDetailCaringTasksById,
  putReportCaringTasksById,
  uploadCaringTaskImage,
} from '@/services/caring-tasks';

const exmaple_plan = [
  { id: 1, plan_name: 'Apple Harvesting' },
  { id: 4, plan_name: 'Corn Harvesting' },
];

export const CaringDetail = () => {
  Moment.locale('vi');
  const searchParams = useLocalSearchParams();
  const id = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;
  const [data, setData] = useState<ICaringTask | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getDetailCaringTasksById(
        (id as unknown as number) || 1,
      );
      setData(data);
    };
    fetchData();
  }, []);
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
          {data?.result_content && (
            <VStack
              className='flex min-h-32 w-5/6 flex-col gap-4 rounded-lg border p-4'
              space='2xl'
            >
              <Text className='mb-5 text-center text-2xl font-bold'>
                Kết quả công việc
              </Text>
              <>
                {data?.list_of_images && (
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
                      data={data?.list_of_images || []}
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
                )}
                <Text className='line-clamp-2'>
                  <Text className='font-bold'>Kết quả: </Text>{' '}
                  {data?.result_content}
                </Text>
                <Text className='line-clamp-2'>
                  <Text className='font-bold'>Thời gian thực hiện: </Text>{' '}
                  {Moment(data?.complete_date).format('hh:mm DD/MM/YYYY')}
                </Text>
              </>
            </VStack>
          )}

          <VStack
            className='flex w-5/6 min-w-40 flex-col gap-1 rounded-lg border p-4'
            space='2xl'
          >
            <Text className='text-center text-2xl font-bold'>
              Chi tiết công việc
            </Text>
            <VStack className='flex-row justify-between' space='md'>
              <Heading size='md'>{data?.task_name}</Heading>
              <StatusTask status={data?.status ?? ''} />
            </VStack>
            <VStack className='line-clamp-2 justify-end' space='md'>
              <Text className='text-sm'>
                {Moment(data?.start_date).format('hh:mm DD/MM/YYYY') ||
                  'Không có thời gian'}{' '}
                {' - '}
                {Moment(data?.end_date).format('hh:mm DD/MM/YYYY') ||
                  'Không có thời gian'}
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
              <VStack className='w-full flex-row justify-end'>
                <Button>
                  <ButtonText>Chi tiết vật tư</ButtonText>
                </Button>
              </VStack>
            </VStack>
          </VStack>
          {data?.status === 'Ongoing' && (
            <VStack className='w-full flex-row items-center justify-center gap-2'>
              <Button onPress={() => {}}>
                <ButtonText>Hủy</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  router.push({
                    pathname: '/caring-task/[id]/report',
                    params: { id: data?.task_id as number },
                  });
                }}
              >
                <ButtonText>Hoàn thành</ButtonText>
              </Button>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export const ReportCaringTask = () => {
  const { control, handleSubmit } = useForm<IReportCaringTask>({
    defaultValues: {
      result_content: '',
      list_of_images: [],
    },
  });
  const [images, setImages] = useState<string[]>([]);
  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 3 },
      async response => {
        if (response.errorMessage) {
          Alert.alert('Lỗi', 'Lỗi tải ảnh: ' + response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const { status, data } = await uploadCaringTaskImage(
              response.assets,
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
  if (!control) {
    return <Text>Loading...</Text>;
  }
  const onSubmit = async (report: IReportCaringTask) => {
    const { status, data } = await putReportCaringTasksById(1, {
      result_content: report.result_content,
      list_of_images: images,
    });

    if (status && data) {
      Alert.alert('Thành công', 'Báo cáo thành công');
      router.push({
        pathname: '/caring-tasks/[id]',
        params: { id: data.task_id },
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
            {images.length !== 0 && (
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
            <Button onPress={pickImage}>
              <ButtonText>Chọn ảnh</ButtonText>
            </Button>
          </VStack>

          <VStack
            className='mt-4 w-5/6 flex-col gap-4 rounded-lg border p-4'
            space='2xl'
          >
            <Text className='mb-5 text-center text-2xl font-bold'>
              Báo cáo công việc
            </Text>
            {control && (
              <View>
                <VStack>
                  <Text className='ml-2 font-bold'>Kết quả</Text>
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
                    name='result_content'
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

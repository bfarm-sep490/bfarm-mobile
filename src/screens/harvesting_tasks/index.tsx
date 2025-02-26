import React, { useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from 'react-native';

import { Div } from '@expo/html-elements';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Divide, Scroll } from 'lucide-react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

import { Divider, Modal } from '@/components/ui';

const tasks = [
  {
    id: 1,
    task_name: 'Thu hoạch cà chua',
    start_date: '23/02/2025',
    end_date: '23/02/2025',
    complete_date: '',
    status: 'InProgress',
    quantity_harvested: 200,
    unit_harvested: 'kg',
    result_content: 'Cà chua chín đều, chất lượng tốt',
    create_at: '15/02/2025',
    update_at: '15/02/2025',
    priority: 'High',
    expert_name: 'Nguyễn Văn A',
    land_name: 'Đất số 1',
    seed_name: 'Dưa hấu loại 1',
    seed_image: 'https://example.com/seed_image.jpg',
  },
  {
    id: 2,
    task_name: 'Thu hoạch dưa hấu',
    start_date: '20/02/2025',
    end_date: '23/02/2025',
    complete_date: '23/02/2025',
    status: 'Completed',
    quantity_harvested: 500,
    unit_harvested: 'kg',
    result_content: 'Dưa ngọt, kích thước lớn',
    create_at: '15/02/2025',
    update_at: '15/02/2025',
    priority: 'Medium',
    expert_name: 'Nguyễn Văn A',
    land_name: 'Đất số 1',
    seed_name: 'Dưa hấu loại 1',
    seed_image: 'https://example.com/seed_image.jpg',
  },
];
interface IHarvestingTask {
  id: number;
  task_name: string;
  start_date: string;
  end_date: string;
  complete_date: string;
  status: string;
  quantity_harvested: number;
  unit_harvested: string;
  result_content: string;
  create_at: string;
  update_at: string;
  priority: string;
  expert_name: string;
  land_name: string;
  seed_name: string;
  seed_image: string;
}
const TaskStatusTag = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const statusColorsTag = (value: string) => {
    switch (value) {
      case 'inprogress':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'pending':
        return '#facc15';
      case 'notstarted':
        return '#9ca3af';
      default:
        return '';
    }
  };

  const statusValuesTag = (value: string) => {
    switch (value) {
      case 'inprogress':
        return 'Đang thực hiện';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
        return 'Đang chờ xác nhận';
      case 'notstarted':
        return 'Chưa bắt đầu';
      default:
        return '';
    }
  };

  const lowerStatus = status.toLowerCase();
  return (
    <View
      className={className}
      style={[
        styles.statusTag,
        { backgroundColor: statusColorsTag(lowerStatus) },
      ]}
    >
      <Text style={styles.statusText}>{statusValuesTag(lowerStatus)}</Text>
    </View>
  );
};
const HarvestingTaskScreen = () => {
  const navigation = useNavigation();
  const [selectedTask, setSelectedTask] = useState<IHarvestingTask | null>(
    null,
  );
  const [showCamera, setShowCamera] = useState(false);

  const renderItem = ({ item }: { item: IHarvestingTask }) => (
    <TouchableOpacity
      className='rounded-lg'
      onPress={() => setSelectedTask(item)}
    >
      <View className='mb-3 flex flex-row justify-between rounded-lg border-b-2 border-l-2 border-r-2 border-t-2 border-gray-400 bg-transparent shadow-md'>
        <View>
          <View className='mr-4 flex-1 p-4'>
            <Text className='text-lg font-bold'>{`#${item.id}. ${item.task_name}`}</Text>
            <Text className='ml-1 text-gray-500'>
              Thời gian: {item.start_date} - {item.end_date}
            </Text>
            <Text className='ml-4 mt-1 text-gray-800'>
              Khu đất: {item.land_name ?? 'Chưa cập nhật'}
            </Text>
            <Text className='ml-4 text-gray-800'>
              Giống cây trồng: {item.seed_name ?? 'Chưa cập nhật'}
            </Text>
          </View>
          <View className='mb-2 ml-0'>
            <TaskStatusTag status={item.status} />
          </View>
        </View>
        <Image
          source={{
            uri: 'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg',
          }}
          className='h-50 w-56 rounded-r-lg'
        />
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thu hoạch hôm nay</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      {selectedTask && (
        <View className='absolute bottom-0 left-0 right-0 top-0 flex-1 bg-white p-6'>
          <ScrollView className='flex-1'>
            <Image
              source={{ uri: selectedTask.seed_image }}
              className='h-48 w-full rounded-lg'
            />
            <Text className='mt-4 text-center text-lg font-extrablack text-gray-700'>
              {selectedTask.id + '#.' + selectedTask.task_name}
            </Text>
            <View className='mb-4 mt-4 rounded-lg border border-gray-300 p-4'>
              <Text className='mb-4 mt-4 font-extrabold text-gray-700'>
                CHI TIẾT CÔNG VIỆC
              </Text>
              <View className='flex-col gap-1'>
                <Text className='text-gray-600'>
                  <Text className='font-semibold'> Kế hoạch:</Text>{' '}
                  {'Kế hoạch thu hoạch cà chua'}
                </Text>
                <Text className='text-gray-600'>
                  <Text className='font-semibold'> Giống cây trồng</Text>{' '}
                  {selectedTask.seed_name}
                </Text>
                <Text className='text-gray-600'>
                  <Text className='font-semibold'> Khu đất:</Text>{' '}
                  {selectedTask.land_name}
                </Text>

                <Text className='text-gray-600'>
                  <Text className='font-semibold'>Chuyên gia: </Text>
                  {selectedTask.expert_name}
                </Text>
                <Text className='text-gray-600'>
                  <Text className='font-semibold'>Thời gian:</Text>{' '}
                  {selectedTask.start_date} - {selectedTask.end_date}
                </Text>

                <Text className='text-gray-600'>
                  <Text className='font-semibold'> Trạng thái: </Text>{' '}
                  <TaskStatusTag
                    className='rounded-bl-sm rounded-tl-sm'
                    status={selectedTask.status}
                  />
                </Text>
                <Text className='text-gray-600'>
                  <Text className='font-semibold'> Mô tả: </Text> Cần thu hoạch
                  trong buổi chiều và thu hoạch hết số lượng đã định
                </Text>
              </View>
            </View>

            {selectedTask.status === 'Completed' && (
              <View className='mb-4 rounded-lg border border-gray-300 pb-4 pl-4 pr-4 pt-1'>
                <Text className='mb-2 mt-2 font-extrabold text-gray-700'>
                  KẾT QUẢ THU HOẠCH
                </Text>
                <View className='flex-col gap-1'>
                  <Text className='text-gray-600'>
                    <Text className='font-semibold'>Kết quả:</Text>{' '}
                    {selectedTask.result_content}
                  </Text>
                  <Text className='text-gray-600'>
                    <Text className='font-semibold'>Số lượng thu hoạch:</Text>{' '}
                    {selectedTask.quantity_harvested}{' '}
                    {selectedTask.unit_harvested}
                  </Text>
                  <Text className='text-gray-600'>
                    <Text className='font-semibold'>Ngày thu hoạch:</Text>{' '}
                    {selectedTask.complete_date}
                  </Text>
                </View>
              </View>
            )}
            <View className='flex-grow flex-row items-center justify-center gap-2'>
              {selectedTask && selectedTask.status === 'InProgress' && (
                <Button
                  onPress={() => {
                    setShowCamera(true);
                  }}
                  title='Báo cáo'
                  color='#10b981'
                />
              )}
              <Button
                title='Đóng'
                color='red'
                onPress={() => setSelectedTask(null)}
              />
            </View>
          </ScrollView>
        </View>
      )}
      {selectedTask && showCamera && (
        <View className='absolute bottom-0 left-0 right-0 top-0 flex-1 bg-white p-6'>
          <ReportHarvestingTaskCamera />
        </View>
      )}
    </View>
  );
};

const ReportHarvestingTaskCamera = () => {
  const device = useCameraDevice('back');

  if (device == null) return <NoCameraErrorView />;
  return <Camera device={device} isActive={true} />;
};

const NoCameraErrorView = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>No camera available</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskInfo: {
    fontSize: 14,
    color: 'gray',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  inProgress: {
    backgroundColor: '#ffeb99',
  },
  completed: {
    backgroundColor: '#99ff99',
  },
  statusTag: {
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default HarvestingTaskScreen;

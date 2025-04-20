import React from 'react';

import { Modal } from 'react-native';

import {
  Box,
  Heading,
  Progress,
  ProgressFilledTrack,
  Spinner,
  Text,
  VStack,
} from '@/components/ui';

type SubmitReportProgressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  title?: string;
  description?: string;
};

export const SubmitReportProgressModal = ({
  isOpen,
  onClose,
  progress,
  title = 'Đang cập nhật báo cáo',
  description = 'Vui lòng đợi trong giây lát...',
}: SubmitReportProgressModalProps) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Box className='flex-1 items-center justify-center bg-black/50'>
        <Box className='w-[90%] max-w-[400px] rounded-2xl bg-white p-6'>
          <VStack space='lg' className='items-center'>
            <Spinner size='large' />
            <VStack space='sm' className='items-center'>
              <Heading size='md' className='text-center'>
                {title}
              </Heading>
              <Text className='text-center text-typography-500'>
                {description}
              </Text>
            </VStack>
            <Box className='w-full'>
              <Progress value={progress} className='h-2'>
                <ProgressFilledTrack className='bg-primary-600' />
              </Progress>
              <Text className='mt-2 text-center text-sm text-typography-500'>
                {Math.round(progress)}%
              </Text>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Modal>
  );
};

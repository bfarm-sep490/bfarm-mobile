import React, { useState } from 'react';

import { Image, StyleSheet, Alert } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { XCircle, Camera, ImageIcon, X } from 'lucide-react-native';
import RNPickerSelect from 'react-native-picker-select';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCaringTask } from '@/services/api/caring-tasks/useCaringTask';
import { useHarvestingTask } from '@/services/api/harvesting-tasks/useHarvestingTask';
import { useHarvestingProduct } from '@/services/api/harvesting_products/useHarvestingProduct';
import { usePackagingTask } from '@/services/api/packaging-tasks/usePackagingTask';
import { usePackagingType } from '@/services/api/packaging-types/usePackagingType';

interface ApiError extends Error {
  name: string;
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface CompleteTaskModalProps {
  packaging_type_id?: number;
  idPlan?: number;
  /**
   * Controls whether the modal is visible
   */
  isOpen: boolean;

  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;

  /**
   * Title of the modal
   * @default "Xác nhận hoàn thành"
   */
  title?: string;

  /**
   * Description or prompt text
   * @default "Vui lòng nhập kết quả thực hiện nhiệm vụ:"
   */
  description?: string;

  /**
   * Placeholder text for the input field
   * @default "Nhập kết quả..."
   */
  placeholder?: string;

  /**
   * Button text for the cancel button
   * @default "Hủy"
   */
  cancelText?: string;

  /**
   * Button text for the confirm button
   * @default "Xác nhận"
   */
  confirmText?: string;

  /**
   * The type of task (caring, harvesting, packaging)
   * @default "caring"
   */
  taskType?: 'caring' | 'harvesting' | 'packaging';

  /**
   * Set to true if you want to allow multiple images
   * @default false
   */
  allowMultipleImages?: boolean;

  /**
   * Set to true if you want to show camera button
   * @default true
   */
  showCameraButton?: boolean;

  /**
   * Set to true if you want to show gallery button
   * @default true
   */
  showGalleryButton?: boolean;

  /**
   * Max number of images allowed
   * @default 5
   */
  maxImages?: number;

  /**
   * Function to call when the confirm button is pressed
   */
  onConfirm: (data: {
    resultContent: string;
    images: string[];
    harvesting_task_id?: number;
    total_packaged_weight?: number;
    packaged_item_count?: number;
    harvesting_quantity?: number;
    unpackaging_quantity?: number;
    packaging_quantity?: number;
  }) => void;
}

/**
 * CompleteTaskModal component
 *
 * A reusable modal for completing tasks with content and images
 */
export const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
  packaging_type_id,
  idPlan,
  isOpen,
  onClose,
  title = 'Xác nhận hoàn thành',
  description = 'Vui lòng nhập kết quả thực hiện nhiệm vụ:',
  placeholder = 'Nhập kết quả...',
  cancelText = 'Hủy',
  confirmText = 'Xác nhận',
  taskType = 'caring',
  allowMultipleImages = false,
  showCameraButton = true,
  showGalleryButton = true,
  maxImages = 5,
  onConfirm,
}) => {
  const [resultContent, setResultContent] = useState('');
  const [harvestingQuantity, setHarvestingQuantity] = useState(0);
  const [packagingQuantity, setPackagingQuantity] = useState(0);
  const [unpackagingQuantity, setUnpackagingQuantity] = useState(0);
  const [harvestingProductId, setHarvestingProductId] = useState<number | null>(
    null,
  );
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { useFetchByParamsQuery } = useHarvestingProduct();
  const { data: harvestingProducts } = useFetchByParamsQuery(
    { plan_id: idPlan },
    !!idPlan,
  );
  const { useUploadImagesMutation: caringUpload } = useCaringTask();
  const { useUploadImagesMutation: harvestingUpload } = useHarvestingTask();
  const { useUploadImagesMutation: packagingUpload } = usePackagingTask();

  const { useFetchAllQuery: usePackagingTypeAll } = usePackagingType();
  const { data: packagingTypes } = usePackagingTypeAll({
    enabled: true,
  });

  const { mutateAsync: uploadImages } = useMutation({
    mutationFn: async (formData: FormData) => {
      const endpoint =
        taskType === 'caring'
          ? 'caring-tasks/images/upload'
          : taskType === 'harvesting'
            ? 'harvesting-tasks/images/upload'
            : 'packaging-tasks/images/upload';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/${endpoint}`,
          {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Upload failed');
        }

        const result = await response.json();
        return result;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        if (apiError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        if (apiError.message === 'Network request failed') {
          throw new Error(
            'Network error. Please check your connection and try again.',
          );
        }
        throw apiError;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleClose = () => {
    setResultContent('');
    setImages([]);
    setIsUploading(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (isUploading) {
      Alert.alert('Lỗi', 'Vui lòng đợi quá trình tải ảnh hoàn tất');
      return;
    }

    try {
      setIsUploading(true);

      onConfirm({
        resultContent,
        images,
        harvesting_quantity: harvestingQuantity,
        unpackaging_quantity: unpackagingQuantity,
        packaging_quantity: packagingQuantity,
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Error in handleConfirm:', apiError);
      Alert.alert(
        'Lỗi',
        apiError.message || 'Không thể cập nhật nhiệm vụ. Vui lòng thử lại!',
      );
    } finally {
      setIsUploading(false);
      handleClose();
    }
  };

  const pickImageFromGallery = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Lỗi', `Chỉ được tải lên tối đa ${maxImages} ảnh`);
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: allowMultipleImages,
        selectionLimit: allowMultipleImages ? maxImages - images.length : 1,
        quality: 0.8,
        allowsEditing: true,
      });

      if (result.canceled) {
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      result.assets.forEach((asset, index) => {
        formData.append('image', {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        } as any);
      });

      const uploadResult = await uploadImages(formData);

      if (uploadResult.data && uploadResult.data.length > 0) {
        setImages(prev => [...prev, ...uploadResult.data]);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Upload error:', error);
      Alert.alert(
        'Lỗi',
        error.message || 'Không thể tải ảnh lên. Vui lòng thử lại!',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Lỗi', `Chỉ được tải lên tối đa ${maxImages} ảnh`);
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

      const formData = new FormData();
      result.assets.forEach((asset, index) => {
        formData.append('image', {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        } as any);
      });

      const uploadResult = await uploadImages(formData);

      if (uploadResult.data && uploadResult.data.length > 0) {
        setImages(prev => [...prev, ...uploadResult.data]);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Upload error:', error);
      Alert.alert(
        'Lỗi',
        error.message || 'Không thể tải ảnh lên. Vui lòng thử lại!',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size='md'>{title}</Heading>
          <ModalCloseButton>
            <Icon as={XCircle} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <VStack space='md'>
            <Text>{description}</Text>
            {taskType === 'harvesting' && (
              <>
                <Text className='text-sm font-medium'>
                  Số lượng thu hoạch (kg)
                </Text>
                <Input variant='underlined'>
                  <InputField
                    keyboardType='numeric'
                    placeholder={'Nhập sản lượng thu hoạch'}
                    textAlignVertical='center'
                    value={harvestingQuantity.toString()}
                    onChange={e =>
                      setHarvestingQuantity(Number(e.nativeEvent.text))
                    }
                  />
                </Input>
              </>
            )}
            {taskType === 'packaging' && (
              <>
                <Text className='text-sm font-normal italic text-red-600'>
                  *Lưu ý đóng gói theo{' '}
                  {
                    packagingTypes?.data?.find(x => x.id === packaging_type_id)
                      ?.name
                  }
                </Text>
                <Text className='text-sm font-medium'>
                  Chọn sản lượng đã thu hoạch
                </Text>
                <RNPickerSelect
                  textInputProps={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}
                  onValueChange={value => setHarvestingProductId(value)}
                  items={(harvestingProducts?.data || [])?.map(item => ({
                    label: `Thu hoạch #${item?.harvesting_task_id} - ${item?.available_harvesting_quantity} ${item?.harvesting_unit} chưa đóng gói`,
                    value: item?.harvesting_task_id,
                  }))}
                />
                <Text className='text-sm font-medium'>
                  Số lượng sản phẩm đóng gói
                </Text>
                <Input variant='underlined'>
                  <InputField
                    keyboardType='numeric'
                    placeholder={'Nhập số lượng sản phẩm đóng gói...'}
                    textAlignVertical='center'
                    value={unpackagingQuantity.toString()}
                    onChange={e =>
                      setUnpackagingQuantity(Number(e.nativeEvent.text))
                    }
                  />
                </Input>
                <Text className='text-sm font-medium'>Sản lượng đóng gói</Text>
                <Input variant='underlined'>
                  <InputField
                    keyboardType='numeric'
                    placeholder={'Nhập sản lượng đóng gói'}
                    textAlignVertical='center'
                    value={packagingQuantity.toString()}
                    onChange={e =>
                      setPackagingQuantity(Number(e.nativeEvent.text))
                    }
                  />
                </Input>
              </>
            )}
            <Text className='text-sm font-medium'>Mô tả</Text>
            <Input variant='underlined'>
              <InputField
                placeholder={placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical='center'
                value={resultContent}
                onChangeText={setResultContent}
              />
            </Input>

            {/* Image picker buttons */}
            <HStack className='mt-2 flex-wrap items-center'>
              {showCameraButton && (
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
              )}

              {showGalleryButton && (
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
              )}
            </HStack>

            {/* Selected images */}
            {images.length > 0 && (
              <Box className='mt-2'>
                <Text className='mb-2 text-sm font-medium'>Ảnh đã chọn:</Text>
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
                          onPress={() => removeImage(index)}
                        >
                          <Icon as={X} size='xs' color='white' />
                        </Pressable>
                      </Box>
                    ))}
                  </HStack>
                </ScrollView>
              </Box>
            )}

            {images.length > 0 && allowMultipleImages && (
              <Text className='text-xs text-typography-500'>
                {images.length} / {maxImages} ảnh
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant='outline'
            size='sm'
            onPress={handleClose}
            isDisabled={isUploading}
          >
            <ButtonText>{cancelText}</ButtonText>
          </Button>
          <Button
            size='sm'
            variant='solid'
            className='ml-3'
            onPress={handleConfirm}
            isDisabled={isUploading}
          >
            {isUploading ? (
              <HStack space='sm'>
                <Spinner size='small' color='white' />
                <ButtonText>Đang tải...</ButtonText>
              </HStack>
            ) : (
              <ButtonText>{confirmText}</ButtonText>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});

export default CompleteTaskModal;

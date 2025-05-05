import React, { useState } from 'react';

import { Image, StyleSheet, Alert } from 'react-native';

import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import {
  XCircle,
  Camera,
  ImageIcon,
  X,
  AlertCircle,
} from 'lucide-react-native';
import RNPickerSelect from 'react-native-picker-select';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
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
import { useSession } from '@/context/ctx';
import { useHarvestingProduct } from '@/services/api/harvesting_products/useHarvestingProduct';
import { usePackagingType } from '@/services/api/packaging-types/usePackagingType';
import { instance } from '@/services/instance';

import { Input, InputField } from '../ui';

interface ApiError extends Error {
  name: string;
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface UploadResponse {
  status: number;
  message: string;
  data: string[];
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
   * The order id
   */
  order_id?: number;

  /**
   * The total packaged weight
   */
  total_packaged_weight?: number;
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
  total_packaged_weight,
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
  const { currentPlan } = useSession();
  const [resultContent, setResultContent] = useState('');
  const [harvestingQuantity, setHarvestingQuantity] = useState(0);
  const [packagingQuantity, setPackagingQuantity] = useState(0);
  const [unpackagingQuantity, setUnpackagingQuantity] = useState(0);
  const [harvestingProductId, setHarvestingProductId] = useState<number | null>(
    null,
  );
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { useFetchByParamsQuery } = useHarvestingProduct();
  const { data: harvestingProducts } = useFetchByParamsQuery(
    { plan_id: idPlan, status: 'active' },
    !!idPlan,
  );
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
        const response = await instance.post(endpoint, {
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(errorData.message || 'Upload failed');
        }

        const result = await response.json<UploadResponse>();
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!resultContent.trim()) {
      newErrors.resultContent = 'Vui lòng nhập mô tả';
    }

    if (taskType === 'harvesting' && harvestingQuantity <= 0) {
      newErrors.harvestingQuantity = 'Số lượng phải lớn hơn 0';
    }

    if (taskType === 'packaging') {
      if (!harvestingProductId) {
        newErrors.harvestingProductId = 'Vui lòng chọn sản lượng đã thu hoạch';
      }
      if (unpackagingQuantity <= 0) {
        newErrors.unpackagingQuantity = 'Số lượng thành phẩm phải lớn hơn 0';
      }
      if (packagingQuantity <= 0) {
        newErrors.packagingQuantity = 'Sản lượng đóng gói phải lớn hơn 0';
      }
    }

    if (images.length === 0) {
      newErrors.images = 'Vui lòng tải lên ít nhất một ảnh';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (isUploading) {
      Alert.alert('Lỗi', 'Vui lòng đợi quá trình tải ảnh hoàn tất');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);
      onConfirm({
        resultContent,
        images,
        ...(taskType === 'packaging' &&
          harvestingProductId && {
            harvesting_task_id: harvestingProductId,
            packaged_item_count: unpackagingQuantity,
            total_packaged_weight: packagingQuantity,
          }),
        ...(taskType === 'harvesting' && {
          harvesting_quantity: harvestingQuantity,
        }),
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

      const uploadResult = (await uploadImages(formData)) as UploadResponse;

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

      const uploadResult = (await uploadImages(formData)) as UploadResponse;

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
                {/* Hiển thị thông tin kiểm định */}
                <Box className='rounded-lg bg-primary-50/50 p-3'>
                  <HStack space='xs' className='items-center'>
                    <Icon
                      as={AlertCircle}
                      size='sm'
                      className='text-primary-600'
                    />
                    <Text className='text-sm font-medium text-primary-700'>
                      Thông tin kiểm định:
                    </Text>
                  </HStack>
                  <Text className='mt-1 text-sm text-typography-600'>
                    {currentPlan?.evaluated_result}
                  </Text>
                </Box>

                <FormControl isInvalid={!!errors.harvestingQuantity}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      Số lượng thu hoạch (kg)
                    </FormControlLabelText>
                  </FormControlLabel>
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
                  {errors.harvestingQuantity && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.harvestingQuantity}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </>
            )}
            {taskType === 'packaging' && (
              <>
                <Text className='text-sm font-normal italic text-red-600'>
                  *Thông tin kiểm định: {currentPlan?.evaluated_result}
                </Text>

                <Text className='text-sm font-normal italic text-red-600'>
                  *Lưu ý đóng gói theo{' '}
                  {
                    packagingTypes?.data?.find(x => x.id === packaging_type_id)
                      ?.name
                  }
                </Text>
                {total_packaged_weight && (
                  <Text className='text-sm font-normal italic text-red-600'>
                    *Sản lượng đóng gói tối thiểu {total_packaged_weight} kg
                  </Text>
                )}
                <FormControl isInvalid={!!errors.harvestingProductId}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      Chọn sản lượng đã thu hoạch
                    </FormControlLabelText>
                  </FormControlLabel>
                  <RNPickerSelect
                    placeholder={{
                      label: 'Chọn sản lượng đã thu hoạch',
                    }}
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
                  {errors.harvestingProductId && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.harvestingProductId}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.packagingQuantity}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      Sản lượng đóng gói
                    </FormControlLabelText>
                  </FormControlLabel>
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
                  {errors.packagingQuantity && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.packagingQuantity}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.unpackagingQuantity}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      Thành phẩm đã đóng gói
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input variant='underlined'>
                    <InputField
                      keyboardType='numeric'
                      placeholder={'Nhập số lượng thành phẩm đã đóng gói...'}
                      textAlignVertical='center'
                      value={unpackagingQuantity.toString()}
                      onChange={e =>
                        setUnpackagingQuantity(Number(e.nativeEvent.text))
                      }
                    />
                  </Input>
                  {errors.unpackagingQuantity && (
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.unpackagingQuantity}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </>
            )}
            <FormControl isInvalid={!!errors.resultContent}>
              <FormControlLabel>
                <FormControlLabelText>Mô tả</FormControlLabelText>
              </FormControlLabel>
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
              {errors.resultContent && (
                <FormControlError>
                  <FormControlErrorText>
                    {errors.resultContent}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Image picker buttons */}
            <FormControl isInvalid={!!errors.images}>
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
              {errors.images && (
                <FormControlError>
                  <FormControlErrorText>{errors.images}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

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

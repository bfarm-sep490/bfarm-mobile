import React, { useState } from 'react';

import { Image, StyleSheet, Platform } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { XCircle, Camera, ImageIcon, X } from 'lucide-react-native';

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

export interface CompleteTaskModalProps {
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
  onConfirm: (data: { resultContent: string; images: string[] }) => void;
}

/**
 * CompleteTaskModal component
 *
 * A reusable modal for completing tasks with content and images
 */
export const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
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
  const [selectedImages, setSelectedImages] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  // Reset state when modal is closed
  const handleClose = () => {
    setResultContent('');
    setSelectedImages([]);
    setIsUploading(false);
    onClose();
  };

  // Handle submission
  const handleConfirm = async () => {
    try {
      setIsUploading(true);

      // Chỉ lấy uri của hình ảnh
      const imageUrls = selectedImages.map(image => image.uri);

      // Log data trước khi gửi
      console.log('===== SUBMITTING TASK DATA =====');
      console.log('Task Type:', taskType);
      console.log('Result Content:', resultContent);
      console.log('Image URLs:', imageUrls);
      console.log('==============================');

      // Call the onConfirm handler with result and image URLs
      onConfirm({
        resultContent,
        images: imageUrls,
      });
    } catch (error) {
      console.error('Error in handleConfirm:', error);
    } finally {
      setIsUploading(false);
      handleClose();
    }
  };

  // Request camera permission and take photo
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      // Handle permission denied
      alert('Cần cấp quyền truy cập camera để chụp ảnh!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (!allowMultipleImages) {
        setSelectedImages([result.assets[0]]);
      } else if (selectedImages.length < maxImages) {
        setSelectedImages([...selectedImages, result.assets[0]]);
      } else {
        alert(`Bạn chỉ được chọn tối đa ${maxImages} ảnh!`);
      }
    }
  };

  // Request gallery permission and pick images
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      // Handle permission denied
      alert('Cần cấp quyền truy cập thư viện ảnh!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: allowMultipleImages,
      selectionLimit: allowMultipleImages
        ? maxImages - selectedImages.length
        : 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (!allowMultipleImages) {
        setSelectedImages([result.assets[0]]);
      } else if (selectedImages.length + result.assets.length <= maxImages) {
        setSelectedImages([...selectedImages, ...result.assets]);
      } else {
        alert(`Bạn chỉ được chọn tối đa ${maxImages} ảnh!`);
      }
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
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
                  onPress={pickImages}
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
            {selectedImages.length > 0 && (
              <Box className='mt-2'>
                <Text className='mb-2 text-sm font-medium'>Ảnh đã chọn:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack space='sm'>
                    {selectedImages.map((image, index) => (
                      <Box
                        key={index}
                        className='relative h-20 w-20 overflow-hidden rounded-md'
                      >
                        <Image
                          source={{ uri: image.uri }}
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

            {selectedImages.length > 0 && allowMultipleImages && (
              <Text className='text-xs text-typography-500'>
                {selectedImages.length} / {maxImages} ảnh
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

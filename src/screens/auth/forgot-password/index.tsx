import React from 'react';

import { useRouter } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Icon,
  Input,
  InputField,
  Pressable,
  Spinner,
  Text,
  VStack,
  useToast,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui';
import { AuthService } from '@/services/api/auth/authService';

import { AuthLayout } from '../layout';

type ForgotPasswordForm = {
  email: string;
};

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      const response = await AuthService.forgotPassword(data.email);

      if (response.status === 200) {
        setSuccessMessage(response.message);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.show({
        placement: 'top',
        render: () => (
          <Box className='mb-5 rounded-sm bg-error-500 px-4 py-3'>
            <Text className='text-white'>
              Có lỗi xảy ra. Vui lòng thử lại sau.
            </Text>
          </Box>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/sign-in');
  };

  return (
    <VStack className='w-full max-w-[440px]' space='md'>
      <VStack space='md'>
        <Pressable onPress={() => router.back()}>
          <Icon as={ArrowLeft} className='text-background-800' size='xl' />
        </Pressable>
        <VStack>
          <Heading size='3xl'>Quên mật khẩu</Heading>
          <Text>BfarmX</Text>
        </VStack>
      </VStack>

      <VStack className='w-full' space='xl'>
        <FormControl isInvalid={!!errors.email}>
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Nhập email của bạn'
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </Input>
            )}
            name='email'
            rules={{
              required: 'Email không được để trống',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ',
              },
            }}
          />
          {errors.email && (
            <FormControlError>
              <FormControlErrorText>
                {errors.email.message}
              </FormControlErrorText>
            </FormControlError>
          )}
          <FormControlHelper>
            <FormControlHelperText>
              Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn
            </FormControlHelperText>
          </FormControlHelper>
        </FormControl>

        <VStack className='my-7 w-full' space='lg'>
          <Button
            className='w-full'
            onPress={handleSubmit(onSubmit)}
            isDisabled={isLoading}
          >
            <ButtonText className='font-medium'>
              {isLoading ? 'Đang gửi...' : 'Gửi liên kết'}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>

      <Modal isOpen={showSuccessModal} onClose={handleModalClose}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size='lg'>Thông báo</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <VStack space='md'>
              <Text className='text-center'>{successMessage}</Text>
              <Text className='text-center text-gray-500'>
                Vui lòng kiểm tra email của bạn và làm theo hướng dẫn để đặt lại
                mật khẩu.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              className='mr-3'
              variant='outline'
              size='sm'
              action='secondary'
              onPress={handleModalClose}
            >
              <ButtonText>Đóng</ButtonText>
            </Button>
            <Button size='sm' action='positive' onPress={handleModalClose}>
              <ButtonText>Đăng nhập</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export const ForgotPasswordScreen = () => {
  return (
    <AuthLayout>
      <ForgotPassword />
    </AuthLayout>
  );
};

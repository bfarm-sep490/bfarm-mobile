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
} from '@/components/ui';

import { AuthLayout } from '../layout';

type ForgotPasswordForm = {
  email: string;
};

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

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
      // TODO: Implement forgot password logic
      console.log('Forgot password data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success message and redirect
      router.push('/auth/reset-password');
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
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

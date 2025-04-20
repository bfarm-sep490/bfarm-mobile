import React from 'react';

import { SafeAreaView } from 'react-native';

import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
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

type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      // TODO: Implement reset password logic
      console.log('Reset password data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success message and redirect
      router.push('/auth/signin');
    } catch (error) {
      console.error('Reset password error:', error);
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
          <Heading size='3xl'>Đặt lại mật khẩu</Heading>
          <Text>BfarmX</Text>
        </VStack>
      </VStack>

      <VStack className='w-full' space='xl'>
        <FormControl isInvalid={!!errors.password}>
          <FormControlLabel>
            <FormControlLabelText>Mật khẩu mới</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Nhập mật khẩu mới'
                  type='password'
                  secureTextEntry
                />
              </Input>
            )}
            name='password'
            rules={{
              required: 'Mật khẩu không được để trống',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
              },
            }}
          />
          {errors.password && (
            <FormControlError>
              <FormControlErrorText>
                {errors.password.message}
              </FormControlErrorText>
            </FormControlError>
          )}
          <FormControlHelper>
            <FormControlHelperText>
              Mật khẩu phải có ít nhất 6 ký tự
            </FormControlHelperText>
          </FormControlHelper>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormControlLabel>
            <FormControlLabelText>Xác nhận mật khẩu</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Nhập lại mật khẩu mới'
                  type='password'
                  secureTextEntry
                />
              </Input>
            )}
            name='confirmPassword'
            rules={{
              required: 'Vui lòng xác nhận mật khẩu',
              validate: value => value === password || 'Mật khẩu không khớp',
            }}
          />
          {errors.confirmPassword && (
            <FormControlError>
              <FormControlErrorText>
                {errors.confirmPassword.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <VStack className='my-7 w-full' space='lg'>
          <Button
            className='w-full'
            onPress={handleSubmit(onSubmit)}
            isDisabled={isLoading}
          >
            <ButtonText className='font-medium'>
              {isLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export const ResetPasswordScreen = () => {
  return (
    <AuthLayout>
      <ResetPassword />
    </AuthLayout>
  );
};

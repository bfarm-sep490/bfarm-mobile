import React, { useState } from 'react';

import { Keyboard } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';

import { Button, ButtonText } from '@/components/ui/button';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import {
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { Session, useSession } from '@/context/ctx';
import { AuthService, safelyDecodeJwt } from '@/services/api/auth/authService';

import { AuthLayout } from '../layout';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required'),
  rememberme: z.boolean().optional(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn }: Session = useSession();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const toast = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        const { accessToken } = response.data;
        const decodedToken = safelyDecodeJwt(accessToken);

        const userData = {
          name:
            decodedToken?.[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
            ] || 'Unknown',
          email:
            decodedToken?.[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
            ] || data.email,
          id:
            decodedToken?.[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
            ] || '0',
          role: decodedToken?.[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ],
        };

        signIn(accessToken, userData);

        toast.show({
          placement: 'bottom right',
          render: ({ id }) => (
            <Toast nativeID={id} variant='outline' action='success'>
              <ToastTitle>Logged in successfully!</ToastTitle>
            </Toast>
          ),
        });

        reset();
        router.replace('(dashboard)/(tabs)/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.show({
        placement: 'bottom right',
        render: ({ id }) => (
          <Toast nativeID={id} variant='outline' action='error'>
            <ToastTitle>Login failed. Check your credentials.</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleState = () => {
    setShowPassword(showState => !showState);
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <VStack className='w-full max-w-[440px]' space='md'>
      <VStack space='md'>
        <Pressable onPress={() => router.back()}>
          <Icon as={ArrowLeftIcon} className='text-background-800' size='xl' />
        </Pressable>
        <VStack>
          <Heading size='3xl'>Log in</Heading>
          <Text>BfarmX</Text>
        </VStack>
      </VStack>
      <VStack className='w-full'>
        <VStack space='xl' className='w-full'>
          <FormControl isInvalid={!!errors?.email} className='w-full'>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=''
              name='email'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder='Enter email'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType='done'
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <FormControl isInvalid={!!errors.password} className='w-full'>
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=''
              name='password'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter password'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType='done'
                  />
                  <InputSlot onPress={handleState} className='pr-3'>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <HStack className='w-full justify-between'>
            <Controller
              name='rememberme'
              defaultValue={false}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  size='sm'
                  value='Remember me'
                  isChecked={value}
                  onChange={onChange}
                  aria-label='Remember me'
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Remember me</CheckboxLabel>
                </Checkbox>
              )}
            />
            <Pressable onPress={() => router.push('/forgot-password')}>
              <Text className='text-sm text-primary-600'>Quên mật khẩu?</Text>
            </Pressable>
          </HStack>
        </VStack>
        <VStack className='my-7 w-full' space='lg'>
          <Button
            className='w-full'
            onPress={handleSubmit(onSubmit)}
            isDisabled={isLoading}
          >
            <ButtonText className='font-medium'>
              {isLoading ? 'Logging in...' : 'Log in'}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

const SignIn = () => {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};

export default SignIn;

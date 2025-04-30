import React, { useState } from 'react';

import { Keyboard } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ToastManager, { Toast } from 'toastify-react-native';
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
import { VStack } from '@/components/ui/vstack';
import { Session, useSession } from '@/context/ctx';
import { AuthService, safelyDecodeJwt } from '@/services/api/auth/authService';

import { AuthLayout } from '../layout';

const loginSchema = z.object({
  email: z.string().min(1, 'Bạn cần nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Bạn cần nhập mật khẩu'),
  rememberme: z.boolean().optional(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const Login = () => {
  const { t } = useTranslation();
  const { signIn }: Session = useSession();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (
    type: 'success' | 'error',
    title: string,
    description?: string,
  ) => {
    const message = description ? `${title}\n${description}` : title;
    if (type === 'success') {
      Toast.success(message);
    } else {
      Toast.error(message);
    }
  };

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 && response.data) {
        const { accessToken } = response.data;
        const decodedToken = safelyDecodeJwt(accessToken);

        // Check if user has Farmer role
        const userRole =
          decodedToken?.[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];

        if (userRole !== 'Farmer') {
          showToast(
            'error',
            t('signIn:toast:error:title'),
            t('signIn:toast:error:notFarmer'),
          );
          return;
        }

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
          role: userRole,
        };

        signIn(accessToken, userData);

        showToast('success', t('signIn:toast:success:title'));

        reset();
        router.replace('(dashboard)/(tabs)/home');
      } else {
        // Handle incorrect email/password
        showToast(
          'error',
          t('signIn:toast:error:title'),
          t('signIn:toast:error:incorrectCredentials'),
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('error', t('signIn:toast:error:title'));
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
          <Heading size='3xl'>{t('signIn:title')}</Heading>
          <Text>{t('signIn:subtitle')}</Text>
        </VStack>
      </VStack>
      <VStack className='w-full'>
        <VStack space='xl' className='w-full'>
          <FormControl isInvalid={!!errors?.email} className='w-full'>
            <FormControlLabel>
              <FormControlLabelText>
                {t('signIn:form:email:label')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=''
              name='email'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder={t('signIn:form:email:placeholder')}
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
              <FormControlLabelText>
                {t('signIn:form:password:label')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=''
              name='password'
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('signIn:form:password:placeholder')}
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
                  aria-label={t('signIn:form:rememberMe:label')}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>
                    {t('signIn:form:rememberMe:label')}
                  </CheckboxLabel>
                </Checkbox>
              )}
            />
            <Pressable onPress={() => router.push('/forgot-password')}>
              <Text className='text-sm text-primary-600'>
                {t('signIn:form:forgotPassword')}
              </Text>
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
              {isLoading
                ? t('signIn:button:loggingIn')
                : t('signIn:button:login')}
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

import React from 'react';

import { useRouter } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
              {t('signIn:forgotPassword:error:title')}
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
          <Heading size='3xl'>{t('signIn:forgotPassword:title')}</Heading>
          <Text>{t('signIn:forgotPassword:subtitle')}</Text>
        </VStack>
      </VStack>

      <VStack className='w-full' space='xl'>
        <FormControl isInvalid={!!errors.email}>
          <FormControlLabel>
            <FormControlLabelText>
              {t('signIn:forgotPassword:form:email:label')}
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={t(
                    'signIn:forgotPassword:form:email:placeholder',
                  )}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </Input>
            )}
            name='email'
            rules={{
              required: t('signIn:forgotPassword:form:email:required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('signIn:forgotPassword:form:email:invalid'),
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
              {t('signIn:forgotPassword:form:email:helper')}
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
              {isLoading
                ? t('signIn:forgotPassword:button:sending')
                : t('signIn:forgotPassword:button:sendLink')}
            </ButtonText>
          </Button>
        </VStack>
      </VStack>

      <Modal isOpen={showSuccessModal} onClose={handleModalClose}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size='lg'>
              {t('signIn:forgotPassword:modal:title')}
            </Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <VStack space='md'>
              <Text className='text-center'>{successMessage}</Text>
              <Text className='text-center text-gray-500'>
                {t('signIn:forgotPassword:modal:message')}
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
              <ButtonText>{t('signIn:forgotPassword:modal:close')}</ButtonText>
            </Button>
            <Button size='sm' action='positive' onPress={handleModalClose}>
              <ButtonText>{t('signIn:forgotPassword:modal:login')}</ButtonText>
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

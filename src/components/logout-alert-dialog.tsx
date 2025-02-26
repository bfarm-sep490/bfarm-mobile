import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Text,
  Heading,
  Icon,
  Button,
  CloseIcon,
  ButtonText,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui';

import { useSession } from '../context/ctx';

const LogoutAlertDialog = ({
  openLogoutAlertDialog,
  setOpenLogoutAlertDialog,
}: any) => {
  const { signOut }: any = useSession();
  const { t } = useTranslation();
  const handleClose = () => {
    signOut();
    setOpenLogoutAlertDialog(false);
  };

  return (
    <AlertDialog isOpen={openLogoutAlertDialog} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className='p-4'>
        <AlertDialogHeader>
          <Heading>{t('profile:signOut')}</Heading>
          <AlertDialogCloseButton>
            <Icon as={CloseIcon} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody className='' contentContainerClassName=''>
          <Text className='mb-6'>Are you sure, you want to logout?</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant='outline' action='secondary' onPress={handleClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button action='negative' onPress={handleClose}>
            <ButtonText className='text-white'>Logout</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlertDialog;

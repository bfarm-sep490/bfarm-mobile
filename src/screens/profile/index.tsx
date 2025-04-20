import React, { useState } from 'react';

import {
  ChevronRightIcon,
  X,
  GlobeIcon,
  BellIcon,
  LockIcon,
  HelpCircleIcon,
  type LucideIcon,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import LogoutAlertDialog from '@/components/logout-alert-dialog';
import { Image } from '@/components/ui';
import { Avatar, AvatarBadge, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { setAppLanguage } from '@/store/slices/appSlice';

import MobileHeader from './mobile-header';

const DashboardLayout = (props: any) => {
  return (
    <VStack className='h-full w-full bg-background-0'>
      <Box className='md:hidden'>
        <MobileHeader
          onSettingsPress={() => {
            // Handle settings press
          }}
          onNotificationPress={() => {
            // Handle notification press
          }}
          title={props.title}
        />
      </Box>
      <VStack className='h-full w-full'>
        <HStack className='h-full w-full'>
          <VStack className='w-full flex-1'>{props.children}</VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
interface MenuItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isSelected?: boolean;
}

const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  isSelected,
}: MenuItemProps) => (
  <Pressable onPress={onPress} className='w-full'>
    <HStack
      space='2xl'
      className='w-full flex-1 items-center justify-between px-4 py-4'
    >
      <HStack className='items-center' space='md'>
        <Box className='rounded-lg bg-primary-100 p-2'>
          <Icon as={icon} className='h-5 w-5 stroke-primary-600' />
        </Box>
        <VStack space='xs'>
          <Text size='lg' className='font-medium'>
            {title}
          </Text>
          {subtitle && (
            <Text className='text-muted-foreground text-sm'>{subtitle}</Text>
          )}
        </VStack>
      </HStack>
      {showChevron && (
        <Icon as={ChevronRightIcon} className='stroke-muted-foreground' />
      )}
      {isSelected && <Box className='h-2 w-2 rounded-full bg-primary-600' />}
    </HStack>
  </Pressable>
);

const MainContent = () => {
  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { user } = useSession();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = useSelector((state: any) => state.app.language);

  const handleLanguageChange = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      dispatch(setAppLanguage(language));
      setShowLanguageModal(false);
    } catch (err) {
      console.error('Error changing language:', err);
    }
  };

  return (
    <VStack className='mb-16 h-full w-full md:mb-0'>
      <LogoutAlertDialog
        setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
        openLogoutAlertDialog={openLogoutAlertDialog}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 160,
          flexGrow: 1,
        }}
      >
        <VStack className='h-full w-full pb-8' space='2xl'>
          <Box className='relative h-[165px] w-full'>
            <Image
              source={require('@/assets/images/bg-profile.png')}
              className='h-full w-full rounded-2xl object-contain'
              height={200}
              width={200}
              alt='Banner Image'
            />
          </Box>
          <Center className='absolute mt-6 w-full pb-4'>
            <VStack space='lg' className='items-center'>
              <Avatar size='2xl' className='bg-primary-600'>
                <AvatarImage
                  alt='Profile Image'
                  height={100}
                  width={100}
                  source={require('@/assets/images/profile.png')}
                />
                <AvatarBadge />
              </Avatar>
              <VStack className='w-full items-center gap-1'>
                <Text size='2xl' className='text-foreground font-bold'>
                  {user?.name}
                </Text>
                <Text className='text-muted-foreground'>{user?.email}</Text>
              </VStack>
            </VStack>
          </Center>
          <VStack className='mx-6 mt-24' space='2xl'>
            <Heading className='font-bold' size='xl'>
              {t('profile:account')}
            </Heading>
            <VStack className='rounded-xl bg-background-0 shadow-sm'>
              <MenuItem
                icon={GlobeIcon}
                title={t('profile:language')}
                subtitle={currentLanguage === 'en' ? 'English' : 'Tiếng Việt'}
                onPress={() => setShowLanguageModal(true)}
              />
              <Divider className='mx-4' />
              <MenuItem
                icon={BellIcon}
                title={t('profile:notifications')}
                subtitle={t('profile:manageNotifications')}
              />
              <Divider className='mx-4' />
              <MenuItem
                icon={LockIcon}
                title={t('profile:privacy')}
                subtitle={t('profile:managePrivacy')}
              />
            </VStack>

            <Heading className='font-bold' size='xl'>
              {t('profile:preferences')}
            </Heading>
            <VStack className='rounded-xl bg-background-0 shadow-sm'>
              <MenuItem
                icon={HelpCircleIcon}
                title={t('profile:helpAndSupport')}
                subtitle={t('profile:getHelp')}
              />
            </VStack>

            <Button
              variant='outline'
              className='mt-4'
              onPress={() => setOpenLogoutAlertDialog(true)}
            >
              <ButtonText className='text-destructive'>
                {t('profile:logout')}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>

      <Modal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size='lg'>{t('profile:selectLanguage')}</Heading>
            <ModalCloseButton>
              <Icon as={X} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space='md'>
              <Pressable
                onPress={() => handleLanguageChange('en')}
                className={`rounded-lg p-4 ${
                  currentLanguage === 'en' ? 'bg-primary-100' : ''
                }`}
              >
                <Text
                  size='lg'
                  className={currentLanguage === 'en' ? 'text-primary-600' : ''}
                >
                  English
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleLanguageChange('vi')}
                className={`rounded-lg p-4 ${
                  currentLanguage === 'vi' ? 'bg-primary-100' : ''
                }`}
              >
                <Text
                  size='lg'
                  className={currentLanguage === 'vi' ? 'text-primary-600' : ''}
                >
                  Tiếng Việt
                </Text>
              </Pressable>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export const Profile = () => {
  return (
    <SafeAreaView className='h-full w-full'>
      <DashboardLayout title='Profile'>
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};

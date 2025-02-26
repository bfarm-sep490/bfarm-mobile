import React, { useRef, useState } from 'react';

import { Keyboard, Platform } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  GripVerticalIcon,
  HeartIcon,
  MenuIcon,
  PhoneIcon,
  SettingsIcon,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import LogoutAlertDialog from '@/components/logout-alert-dialog';
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
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
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
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
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import MobileHeader from './mobile-header';

type MobileHeaderProps = {
  title: string;
};

type HeaderProps = {
  title: string;
  toggleSidebar: () => void;
};

type Icons = {
  iconName: LucideIcon | typeof Icon;
  iconText: string;
};
const SettingsList: Icons[] = [
  {
    iconName: GripVerticalIcon,
    iconText: 'Profile',
  },
  {
    iconName: GripVerticalIcon,
    iconText: 'Preferences',
  },
  {
    iconName: GripVerticalIcon,
    iconText: 'Subscription',
  },
];
const ResourcesList: Icons[] = [
  {
    iconName: GripVerticalIcon,
    iconText: 'Downloads',
  },
  {
    iconName: GripVerticalIcon,
    iconText: 'FAQs',
  },
  {
    iconName: GripVerticalIcon,
    iconText: 'News & Blogs',
  },
];
interface UserStats {
  friends: string;
  friendsText: string;
  followers: string;
  followersText: string;
  rewards: string;
  rewardsText: string;
  posts: string;
  postsText: string;
}
const userData: UserStats[] = [
  {
    friends: '45K',
    friendsText: 'Friends',
    followers: '500M',
    followersText: 'Followers',
    rewards: '40',
    rewardsText: 'Rewards',
    posts: '346',
    postsText: 'Posts',
  },
];

const Sidebar = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedIndexResources, setSelectedIndexResources] =
    useState<number>(0);
  const handlePress = (index: number) => {
    setSelectedIndex(index);
    // router.push("/profile/profile");
  };
  const handlePressResources = (index: number) => {
    setSelectedIndexResources(index);
    // router.push("/profile/profile");
  };
  return (
    <ScrollView className='h-full' contentContainerStyle={{ flexGrow: 1 }}>
      <VStack
        className='border-border-300 h-full w-[280px] flex-1 items-center border-r py-4 pl-8 pr-4'
        space='xl'
      >
        <VStack className='w-full px-2 pb-4 pt-3' space='xs'>
          <Text className='px-4 py-2 text-typography-600'>SETTINGS</Text>
          {SettingsList.map((item, index) => {
            return (
              <Pressable
                onPress={() => handlePress(index)}
                key={index}
                className={`flex-row items-center gap-2 rounded px-4 py-3 ${
                  index === selectedIndex
                    ? 'bg-background-950'
                    : 'bg-background-0'
                } `}
              >
                <Icon
                  as={item.iconName}
                  className={` ${
                    index === selectedIndex
                      ? 'fill-background-800 stroke-background-0'
                      : 'fill-none stroke-background-800'
                  } `}
                />
                <Text
                  className={` ${
                    index === selectedIndex
                      ? 'text-typography-0'
                      : 'text-typography-700'
                  } `}
                >
                  {item.iconText}
                </Text>
              </Pressable>
            );
          })}
        </VStack>
        <VStack className='w-full px-2 pb-4 pt-3' space='xs'>
          <Text className='px-4 py-2 text-typography-600'>RESOURCES</Text>
          {ResourcesList.map((item, index) => {
            return (
              <Pressable
                onPress={() => handlePressResources(index)}
                key={index}
                className={`flex-row items-center gap-2 rounded px-4 py-3 ${
                  index === selectedIndexResources
                    ? 'bg-background-950'
                    : 'bg-background-0'
                } `}
              >
                <Icon
                  as={item.iconName}
                  className={` ${
                    index === selectedIndexResources
                      ? 'stroke-background-0'
                      : 'stroke-background-800'
                  } h-10 w-10`}
                />
                <Text
                  className={` ${
                    index === selectedIndexResources
                      ? 'text-typography-0'
                      : 'text-typography-700'
                  } `}
                >
                  {item.iconText}
                </Text>
              </Pressable>
            );
          })}
        </VStack>
      </VStack>
    </ScrollView>
  );
};

const DashboardLayout = (props: any) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    props.isSidebarVisible,
  );
  function toggleSidebar() {
    setIsSidebarVisible(!isSidebarVisible);
  }

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
      <Box className='hidden md:flex'>
        <WebHeader toggleSidebar={toggleSidebar} title={props.title} />
      </Box>
      <VStack className='h-full w-full'>
        <HStack className='h-full w-full'>
          <Box className='hidden h-full md:flex'>
            {isSidebarVisible && <Sidebar />}
          </Box>
          <VStack className='w-full flex-1'>{props.children}</VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};

function WebHeader(props: HeaderProps) {
  return (
    <HStack className='border-border-300 items-center justify-between border-b bg-background-0 pb-3 pr-10 pt-4'>
      <HStack className='items-center'>
        <Pressable
          onPress={() => {
            props.toggleSidebar();
          }}
        >
          <Icon as={MenuIcon} size='lg' className='mx-5' />
        </Pressable>
        <Text className='text-2xl'>{props.title}</Text>
      </HStack>

      <Avatar className='h-9 w-9'>
        <AvatarFallbackText className='font-light'>A</AvatarFallbackText>
      </Avatar>
    </HStack>
  );
}

type userSchemaDetails = z.infer<typeof userSchema>;

// Define the Zod schema
const userSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  gender: z.enum(['male', 'female', 'other']),
  phoneNumber: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      'Phone number must be a valid international phone number',
    ),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
  zipcode: z
    .string()
    .min(1, 'Zipcode is required')
    .max(20, 'Zipcode must be less than 20 characters'),
});

interface AccountCardType {
  iconName: LucideIcon | typeof Icon;
  subText: string;
  endIcon: LucideIcon | typeof Icon;
}
const accountData: AccountCardType[] = [
  {
    iconName: GripVerticalIcon,
    subText: 'Settings',
    endIcon: ChevronRightIcon,
  },
  {
    iconName: SettingsIcon,
    subText: 'Notifications',
    endIcon: ChevronRightIcon,
  },
  {
    iconName: PhoneIcon,
    subText: 'Rewards',
    endIcon: ChevronRightIcon,
  },
];
const MainContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] = useState(false);
  return (
    <VStack className='mb-16 h-full w-full md:mb-0'>
      <ModalComponent showModal={showModal} setShowModal={setShowModal} />
      <LogoutAlertDialog
        setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
        openLogoutAlertDialog={openLogoutAlertDialog}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isWeb ? 0 : 160,
          flexGrow: 1,
        }}
      >
        <VStack className='h-full w-full pb-8' space='2xl'>
          <Box className='relative h-[380px] w-full md:h-[478px]'>
            {/* <Image
              source={require('assets/profile-screens/profile/image2.png')}
              height={'100%'}
              width={'100%'}
              alt='Banner Image'
              contentFit='cover'
            /> */}
          </Box>
          <HStack className='absolute hidden px-10 pt-6 md:flex'>
            <Text className='font-roboto text-typography-900'>home &gt; </Text>
            <Text className='font-semibold text-typography-900'>profile</Text>
          </HStack>
          <Center className='absolute mt-6 w-full pb-4 md:mt-14 md:px-10 md:pt-6'>
            <VStack space='lg' className='items-center'>
              <Avatar size='2xl' className='bg-primary-600'>
                {/* <AvatarImage
                  alt='Profile Image'
                  height={'100%'}
                  width={'100%'}
                  source={require('assets/profile-screens/profile/image.png')}
                /> */}
                <AvatarBadge />
              </Avatar>
              <VStack className='w-full items-center gap-1'>
                <Text size='2xl' className='text-dark font-roboto'>
                  Khanh Lee
                </Text>
                <Text className='text-typograpphy-700 font-roboto text-sm'>
                  Việt Nam
                </Text>
              </VStack>
              <>
                {userData.map((item, index) => {
                  return (
                    <HStack className='items-center gap-1' key={index}>
                      <VStack className='items-center px-4 py-3' space='xs'>
                        <Text className='text-dark items-center justify-center font-roboto font-semibold'>
                          {item.friends}
                        </Text>
                        <Text className='text-dark font-roboto text-xs'>
                          {item.friendsText}
                        </Text>
                      </VStack>
                      <Divider orientation='vertical' className='h-10' />
                      <VStack className='items-center px-4 py-3' space='xs'>
                        <Text className='text-dark font-roboto font-semibold'>
                          {item.followers}
                        </Text>
                        <Text className='text-dark font-roboto text-xs'>
                          {item.followersText}
                        </Text>
                      </VStack>
                      <Divider orientation='vertical' className='h-10' />
                      <VStack className='items-center px-4 py-3' space='xs'>
                        <Text className='text-dark font-roboto font-semibold'>
                          {item.rewards}
                        </Text>
                        <Text className='text-dark font-roboto text-xs'>
                          {item.rewardsText}
                        </Text>
                      </VStack>
                      <Divider orientation='vertical' className='h-10' />
                      <VStack className='items-center px-4 py-3' space='xs'>
                        <Text className='text-dark font-roboto font-semibold'>
                          {item.posts}
                        </Text>
                        <Text className='text-dark font-roboto text-xs'>
                          {item.postsText}
                        </Text>
                      </VStack>
                    </HStack>
                  );
                })}
              </>
              <Button
                variant='outline'
                action='secondary'
                onPress={() => setShowModal(true)}
                className='relative gap-3'
              >
                <ButtonText className='text-dark'>Edit Profile</ButtonText>
                <ButtonIcon as={EditIcon} />
              </Button>
            </VStack>
          </Center>
          <VStack className='mx-6' space='2xl'>
            <HStack
              className='border-border-300 items-center justify-between rounded-xl border px-6 py-5'
              space='2xl'
            >
              <HStack space='2xl' className='items-center'>
                <Box className='h-10 w-10 md:h-20 md:w-20'>
                  {/* <Image
                    source={require('assets/profile-screens/profile/image1.png')}
                    height={'100%'}
                    width={'100%'}
                    alt='Promo Image'
                  /> */}
                </Box>
                <VStack>
                  <Text className='text-lg text-typography-900' size='lg'>
                    Invite & get rewards
                  </Text>
                  <Text className='font-roboto text-sm md:text-[16px]'>
                    Your code r45dAsdeK8
                  </Text>
                </VStack>
              </HStack>
              <Button className='bg-background-0 p-0 active:bg-background-0 md:bg-background-900 md:px-4 md:py-2'>
                <ButtonText className='text-sm text-typography-800 md:text-typography-0'>
                  Invite
                </ButtonText>
              </Button>
            </HStack>
            <Heading className='font-roboto' size='xl'>
              Account
            </Heading>
            <VStack className='border-border-300 items-center justify-between rounded-xl border px-4 py-2'>
              {accountData.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <HStack
                      space='2xl'
                      className='w-full flex-1 items-center justify-between px-2 py-3'
                    >
                      <HStack className='items-center' space='md'>
                        <Icon as={item.iconName} className='stroke-[#747474]' />
                        <Text size='lg'>{item.subText}</Text>
                      </HStack>
                      <Icon as={item.endIcon} />
                    </HStack>
                    {accountData.length - 1 !== index && (
                      <Divider className='my-1' />
                    )}
                  </React.Fragment>
                );
              })}
            </VStack>
            <Heading className='font-roboto' size='xl'>
              Preferences
            </Heading>
            <VStack className='border-border-300 items-center justify-between rounded-xl border px-4 py-2'>
              {accountData.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <HStack
                      space='2xl'
                      className='w-full flex-1 items-center justify-between px-2 py-3'
                      key={index}
                    >
                      <HStack className='items-center' space='md'>
                        <Icon as={item.iconName} className='stroke-[#747474]' />
                        <Text size='lg'>{item.subText}</Text>
                      </HStack>
                      <Icon as={item.endIcon} />
                    </HStack>
                    {accountData.length - 1 !== index && (
                      <Divider className='my-1' />
                    )}
                  </React.Fragment>
                );
              })}
            </VStack>
            <LogoutButton
              openLogoutAlertDialog={openLogoutAlertDialog}
              setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
};

const ModalComponent = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const ref = useRef(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<userSchemaDetails>({
    resolver: zodResolver(userSchema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
  };
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const onSubmit = (_data: userSchemaDetails) => {
    setShowModal(false);
    reset();
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
      finalFocusRef={ref}
      size='lg'
    >
      <ModalBackdrop />
      <ModalContent>
        <Box className={'h-[215px] w-full'}>
          {/* <Image
            source={require('assets/profile-screens/profile/image2.png')}
            height={'100%'}
            width={'100%'}
            alt='Banner Image'
          /> */}
        </Box>
        <Pressable className='absolute right-6 top-44 h-8 w-8 items-center justify-center rounded-full bg-background-500'>
          <Icon as={SettingsIcon} />
        </Pressable>
        <ModalHeader className='absolute w-full'>
          <Heading size='2xl' className='pl-4 pt-4 text-typography-800'>
            Edit Profile
          </Heading>
          <ModalCloseButton>
            <Icon
              as={X}
              size='md'
              className='stroke-background-400 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 group-[:hover]/modal-close-button:stroke-background-700'
            />
          </ModalCloseButton>
        </ModalHeader>
        <Center className='absolute top-16 w-full'>
          <Avatar size='2xl'>
            {/* <AvatarImage
              source={require('assets/profile-screens/profile/image.png')}
            /> */}
            <AvatarBadge className='items-center justify-center bg-background-500'>
              <Icon as={SettingsIcon} />
            </AvatarBadge>
          </Avatar>
        </Center>
        <ModalBody className='px-10 py-6'>
          <VStack space='2xl'>
            <HStack className='items-center justify-between'>
              <FormControl
                isInvalid={!!errors.firstName || isNameFocused}
                className='w-[47%]'
              >
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>First Name</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({
                          firstName: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder='First Name'
                        type='text'
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
                  <FormControlErrorIcon as={AlertCircleIcon} size='md' />
                  <FormControlErrorText>
                    {errors?.firstName?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl
                isInvalid={!!errors.lastName || isNameFocused}
                className='w-[47%]'
              >
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>Last Name</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='lastName'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({
                          lastName: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder='Last Name'
                        type='text'
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
                  <FormControlErrorIcon as={AlertCircleIcon} size='md' />
                  <FormControlErrorText>
                    {errors?.lastName?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </HStack>
            <HStack className='items-center justify-between'>
              <FormControl className='w-[47%]' isInvalid={!!errors.gender}>
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>Gender</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='gender'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({ city: value });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Select onValueChange={onChange} selectedValue={value}>
                      <SelectTrigger variant='outline' size='md'>
                        <SelectInput placeholder='Select' />
                        <SelectIcon className='mr-3' as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label='Male' value='male' />
                          <SelectItem label='Female' value='female' />
                          <SelectItem label='Others' value='others' />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} size='md' />
                  <FormControlErrorText>
                    {errors?.gender?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl className='w-[47%]' isInvalid={!!errors.phoneNumber}>
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>Phone number</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='phoneNumber'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({ phoneNumber: value });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <HStack className='gap-1'>
                      <Select className='w-[28%]'>
                        <SelectTrigger variant='outline' size='md'>
                          <SelectInput placeholder='+91' />
                          <SelectIcon className='mr-1' as={ChevronDownIcon} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectItem label='93' value='93' />
                            <SelectItem label='155' value='155' />
                            <SelectItem label='1-684' value='-1684' />
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                      <Input className='flex-1'>
                        <InputField
                          placeholder='89867292632'
                          type='text'
                          value={value}
                          onChangeText={onChange}
                          keyboardType='number-pad'
                          onBlur={onBlur}
                          onSubmitEditing={handleKeyPress}
                          returnKeyType='done'
                        />
                      </Input>
                    </HStack>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} size='md' />
                  <FormControlErrorText>
                    {errors?.phoneNumber?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </HStack>
            <HStack className='items-center justify-between'>
              <FormControl
                className='w-[47%]'
                isInvalid={(!!errors.city || isEmailFocused) && !!errors.city}
              >
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>City</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='city'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({ city: value });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select onValueChange={onChange} selectedValue={value}>
                      <SelectTrigger variant='outline' size='md'>
                        <SelectInput placeholder='Select' />
                        <SelectIcon className='mr-3' as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label='Bengaluru' value='Bengaluru' />
                          <SelectItem label='Udupi' value='Udupi' />
                          <SelectItem label='Others' value='Others' />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} size='md' />
                  <FormControlErrorText>
                    {errors?.city?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                className='w-[47%]'
                isInvalid={(!!errors.state || isEmailFocused) && !!errors.state}
              >
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>State</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='state'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({ state: value });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select onValueChange={onChange} selectedValue={value}>
                      <SelectTrigger variant='outline' size='md'>
                        <SelectInput placeholder='Select' />
                        <SelectIcon className='mr-3' as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label='Karnataka' value='Karnataka' />
                          <SelectItem label='Haryana' value='Haryana' />
                          <SelectItem label='Others' value='Others' />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} size='md' />
                  <FormControlErrorText>
                    {errors?.state?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </HStack>
            <HStack className='items-center justify-between'>
              <FormControl
                className='w-[47%]'
                isInvalid={
                  (!!errors.country || isEmailFocused) && !!errors.country
                }
              >
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>Country</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='country'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({ country: value });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select onValueChange={onChange} selectedValue={value}>
                      <SelectTrigger variant='outline' size='md'>
                        <SelectInput placeholder='Select' />
                        <SelectIcon className='mr-3' as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label='India' value='India' />
                          <SelectItem label='Sri Lanka' value='Sri Lanka' />
                          <SelectItem label='Others' value='Others' />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} size='md' />
                  <FormControlErrorText>
                    {errors?.country?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl
                className='w-[47%]'
                isInvalid={!!errors.zipcode || isEmailFocused}
              >
                <FormControlLabel className='mb-2'>
                  <FormControlLabelText>Zipcode</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name='zipcode'
                  control={control}
                  rules={{
                    validate: async value => {
                      try {
                        await userSchema.parseAsync({
                          zipCode: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder='Enter 6 - digit zip code'
                        type='text'
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
                  <FormControlErrorIcon as={AlertCircle} size='md' />
                  <FormControlErrorText>
                    {errors?.zipcode?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </HStack>
            <Button
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              className='flex-1 p-2'
            >
              <ButtonText>Save Changes</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
const LogoutButton = ({ setOpenLogoutAlertDialog }: any) => {
  return (
    <Button
      action='secondary'
      className='rounded-xl'
      variant='outline'
      onPress={() => {
        setOpenLogoutAlertDialog(true);
      }}
    >
      <ButtonText>Logout</ButtonText>
    </Button>
  );
};
export const Profile = () => {
  return (
    <SafeAreaView className='h-full w-full'>
      <DashboardLayout title='Profile' isSidebarVisible={true}>
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};

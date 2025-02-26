import { useState } from 'react';

import { useRouter } from 'expo-router';
import {
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  NewspaperIcon,
  type LucideIcon,
} from 'lucide-react-native';

import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import {
  ChevronLeftIcon,
  DownloadIcon,
  Icon,
  MenuIcon,
  SearchIcon,
} from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type MobileHeaderProps = {
  title: string;
};

type HeaderProps = {
  title: string;
  toggleSidebar: () => void;
};

type Icons = {
  iconName: LucideIcon | typeof Icon;
};
const list: Icons[] = [
  {
    iconName: HomeIcon,
  },
  {
    iconName: NewspaperIcon,
  },
  {
    iconName: GlobeIcon,
  },
  {
    iconName: HeartIcon,
  },
];

interface BlogData {
  bannerUri: string;
  title: string;
  description: string;
  publishedDate: string;
}
interface CreatorData {
  bannerUri: string;
  name: string;
  description: string;
}

const WORLD_DATA: BlogData[] = [
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2024',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2025',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2025',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2025',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2025',
  },
];
const BLOGS_DATA: BlogData[] = [
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2025',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2025',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    title: 'The Power of Positive Thinking',
    description:
      'Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges. Explore practical tips and techniques to cultivate a positive mindset for greater happiness and success.',
    publishedDate: 'May 15, 2025',
  },
];
const CREATORS_DATA: CreatorData[] = [
  {
    bannerUri: require('@/assets/images/splash.png'),
    name: 'Emily Zho',
    description: 'Designer by heart, writer by profession, talks about design',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    name: 'Ram Narayan',
    description: 'Founder of Fortune 500 company Alo, talks about',
  },
  {
    bannerUri: require('@/assets/images/splash.png'),
    name: 'David John',
    description: 'Creator of all things metal, talks about music and art. ',
  },
];

const Sidebar = () => {
  return (
    <VStack
      className='border-border-300 h-full w-14 items-center border-r pt-5'
      space='xl'
    >
      {list.map((item, index) => {
        return (
          <Pressable key={index}>
            <Icon as={item.iconName} size='xl' />
          </Pressable>
        );
      })}
    </VStack>
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
        <MobileHeader title={'News feed'} />
      </Box>
      <Box className='hidden md:flex'>
        <WebHeader toggleSidebar={toggleSidebar} title={props.title} />
      </Box>
      <VStack className='h-full w-full'>
        <HStack className='h-full w-full'>
          <Box className='hidden h-full md:flex'>
            {isSidebarVisible && <Sidebar />}
          </Box>
          <VStack className='w-full'>{props.children}</VStack>
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

function MobileHeader(props: MobileHeaderProps) {
  const router = useRouter();
  return (
    <HStack
      className='border-border-300 items-center border-b bg-background-0 px-4 py-6'
      space='md'
    >
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Icon as={ChevronLeftIcon} />
      </Pressable>
      <Text className='text-xl'>{props.title}</Text>
    </HStack>
  );
}

const MainContent = () => {
  return (
    <VStack
      className='mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6'
      space='2xl'
    >
      <Input className='border-border-100 text-center md:hidden'>
        <InputField placeholder='Search' />
        <InputSlot className='pr-3'>
          <InputIcon as={SearchIcon} />
        </InputSlot>
      </Input>
      <Heading size='2xl' className='font-roboto'>
        What's new?
      </Heading>
      <HStack space='2xl' className='h-full w-full flex-1'>
        <ScrollView
          className='max-w-[900px] flex-1 md:mb-2'
          contentContainerStyle={{
            paddingBottom: isWeb ? 0 : 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className='w-full' space='2xl'>
            {BLOGS_DATA.map((item, index) => {
              return (
                <VStack
                  className='border-border-300 rounded-xl border p-5'
                  key={index}
                >
                  <Box className='h-64 w-full rounded'>
                    {/* <Image
                      height={100}
                      width={100}
                      source={item.bannerUri}
                      alt={item.bannerUri}
                      resizeMode='cover'
                    /> */}
                  </Box>
                  <VStack className='mt-4' space='md'>
                    <Text className='text-sm'>{item.publishedDate}</Text>
                    <Heading size='md'>{item.title}</Heading>
                    <Text className='line-clamp-2'>{item.description}</Text>
                  </VStack>
                </VStack>
              );
            })}
          </VStack>
        </ScrollView>
        <VStack className='hidden max-w-[500px] lg:flex' space='2xl'>
          <Input className='text-center'>
            <InputField placeholder='Search' />
            <InputSlot className='pr-3'>
              <InputIcon as={SearchIcon} />
            </InputSlot>
          </Input>
          <VStack>
            <ScrollView showsVerticalScrollIndicator={false} className='gap-7'>
              <VStack space='lg'>
                <Heading size='lg'>From around the world</Heading>
                <VStack className='h-full' space='md'>
                  {WORLD_DATA.map((item, index) => {
                    return (
                      <HStack
                        className='border-border-300 h-full items-center rounded-xl border p-3'
                        space='lg'
                        key={index}
                      >
                        <Box className='relative h-full w-40 rounded'>
                          {/* <Image
                            height={100}
                            width={100}
                            resizeMode='cover'
                            source={item.bannerUri}
                            alt={item.title}
                          /> */}
                        </Box>
                        <VStack className='h-full justify-between' space='md'>
                          <Text className='text-sm'>{item.publishedDate}</Text>
                          <Heading size='md'>{item.title}</Heading>
                          <Text className='line-clamp-2'>
                            {item.description}
                          </Text>
                        </VStack>
                      </HStack>
                    );
                  })}
                </VStack>
              </VStack>
              <VStack space='lg' className='mt-7'>
                <Heading size='lg'>Find creators</Heading>
                <VStack className='h-full' space='md'>
                  {CREATORS_DATA.map((item, index) => {
                    return (
                      <HStack
                        className='border-border-300 h-full items-center rounded-xl border p-4'
                        space='lg'
                        key={index}
                      >
                        <Avatar>
                          <Avatar>
                            <AvatarFallbackText>
                              {item.name?.[0] ?? 'U'}
                            </AvatarFallbackText>
                          </Avatar>
                        </Avatar>
                        <Button
                          variant='outline'
                          action='secondary'
                          className='p-2'
                        >
                          <ButtonIcon as={DownloadIcon} />
                        </Button>
                        <VStack>
                          <Text className='font-semibold text-typography-900'>
                            {item.name}
                          </Text>
                          <Text className='line-clamp-1 text-sm'>
                            {item.description}
                          </Text>
                        </VStack>
                        <Button action='secondary' variant='outline'>
                          <ButtonText>Follow</ButtonText>
                        </Button>
                      </HStack>
                    );
                  })}
                </VStack>
              </VStack>
            </ScrollView>
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
};
const NewsFeed = () => {
  return (
    <SafeAreaView className='h-full w-full'>
      <DashboardLayout title='News Feed' isSidebarVisible={true}>
        <MainContent />
      </DashboardLayout>
    </SafeAreaView>
  );
};

export default NewsFeed;

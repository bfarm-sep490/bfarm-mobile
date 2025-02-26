import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { Button, ButtonText } from '@/components/ui/button';
import { AddIcon, Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';

import { AuthLayout } from '../layout';

const SplashScreenWithLeftBackground = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  return (
    <VStack
      className='h-full w-full max-w-[440px] items-center justify-center'
      space='lg'
    >
      {colorScheme === 'dark' ? (
        <Icon as={AddIcon} className='h-10 w-[219px]' />
      ) : (
        <Icon as={AddIcon} className='h-10 w-[219px]' />
      )}
      <VStack className='w-full' space='lg'>
        <Button
          className='w-full'
          onPress={() => {
            router.push('/sign-in');
          }}
        >
          <ButtonText className='font-medium'>Log in</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push('/signup');
          }}
        >
          <ButtonText className='font-medium'>Sign Up</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

export const SplashScreen = () => {
  return (
    <AuthLayout>
      <SplashScreenWithLeftBackground />
    </AuthLayout>
  );
};

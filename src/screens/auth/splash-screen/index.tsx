import { useRouter } from 'expo-router';
import { t } from 'i18next';

import { Image } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

const SplashScreen = () => {
  const router = useRouter();

  return (
    <VStack
      className='h-full w-full items-center justify-center px-6'
      space='2xl'
    >
      <VStack className='items-center' space='xl'>
        <Image
          source={require('@/assets/images/icon.png')}
          className='h-40 w-40'
          alt='App Logo'
        />
        <VStack className='items-center' space='sm'>
          <Text className='text-foreground text-3xl font-bold'>
            {t('splash:welcome')}
          </Text>
          <Text className='text-muted-foreground text-center text-base'>
            {t('splash:tagline')}
          </Text>
        </VStack>
      </VStack>

      <VStack className='w-full' space='md'>
        <Button
          className='w-full'
          onPress={() => {
            router.push('/sign-in');
          }}
        >
          <ButtonText className='font-medium'>
            {t('splash:getStarted')}
          </ButtonText>
        </Button>
        <Text className='text-muted-foreground text-center text-sm'>
          {t('splash:signInDescription')}
        </Text>
      </VStack>
    </VStack>
  );
};

export default SplashScreen;

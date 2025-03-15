import { Redirect, Stack } from 'expo-router';

import { Text } from '@/components/ui';
import { Session, useSession } from '@/context/ctx';
import { NotificationProvider } from '@/context/notifications';

export default function AppLayout() {
  const { isLoading, session }: Session = useSession();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href='/splash-screen' />;
  }

  return (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name='profile/index'
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

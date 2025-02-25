import { Session, useSession } from 'context/ctx';
import { Redirect, Stack } from 'expo-router';

import { Text } from '@/src/components/ui/Themed';

export default function AppLayout() {
  const { isLoading, session }: Session = useSession();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
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
    </Stack>
  );
}

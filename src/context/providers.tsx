import React, { ReactNode } from 'react';

import { useColorScheme } from 'react-native';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import { SessionProvider } from './ctx';
import { store } from '../store';

// Query Client Configuration
const queryClientConfig = {
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);

// Styled Components
const GestureWrapper = ({ children }: { children: ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {children}
  </GestureHandlerRootView>
);

interface ProvidersWrapperProps {
  children: ReactNode;
}

const ProvidersWrapper = ({ children }: ProvidersWrapperProps) => {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode={(colorScheme ?? 'light') as 'light' | 'dark'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <GestureWrapper>
            <SessionProvider>
              <QueryClientProvider client={queryClient}>
                <Provider store={store}>{children}</Provider>
              </QueryClientProvider>
            </SessionProvider>
          </GestureWrapper>
        </SafeAreaProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

export default ProvidersWrapper;

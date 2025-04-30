import React, { ReactNode } from 'react';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import ToastManager, { Toast } from 'toastify-react-native';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import { SessionProvider } from './ctx';
import { store } from '../store';
import { NotificationProvider } from './notification';

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
  return (
    <GluestackUIProvider mode='light'>
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaProvider>
          <GestureWrapper>
            <SessionProvider>
              <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                  <Provider store={store}>
                    <ToastManager
                      position='top'
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme='light'
                    />
                    {children}
                  </Provider>
                </NotificationProvider>
              </QueryClientProvider>
            </SessionProvider>
          </GestureWrapper>
        </SafeAreaProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

export default ProvidersWrapper;

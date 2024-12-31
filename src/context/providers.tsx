import React, { ReactNode, createContext, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';

import { SessionProvider } from './ctx';
import { store } from '../store';

// Constants
const DEFAULT_THEME = 'light' as const;

// Types
type ColorMode = 'dark' | 'light';

interface ThemeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

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

// Context
export const ThemeContext = createContext<ThemeContextType>({
  colorMode: DEFAULT_THEME,
  toggleColorMode: () => null,
});

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
  const [colorMode, setColorMode] = useState<ColorMode>(DEFAULT_THEME);

  const toggleColorMode = () => {
    setColorMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const themeContextValue = {
    colorMode,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <GluestackUIProvider mode={colorMode}>
        <SafeAreaProvider>
          <GestureWrapper>
            <SessionProvider>
              <QueryClientProvider client={queryClient}>
                <Provider store={store}>{children}</Provider>
              </QueryClientProvider>
            </SessionProvider>
          </GestureWrapper>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
};

export default ProvidersWrapper;

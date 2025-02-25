import colors from 'constants/Colors';

import { StatusBar, useColorScheme, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { DefaultError } from '@/src/components/molecules';
import { ErrorBoundary } from '@/src/components/organisms';

import type { SafeAreaViewProps } from 'react-native-safe-area-context';

// Fixed Props type definition
type Props = SafeAreaViewProps & {
  isError?: boolean;
  onResetError?: () => void;
  children?: React.ReactNode;
};

function SafeScreen({
  children = undefined,
  isError = false,
  onResetError = undefined,
  style,
  ...props
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <SafeAreaView
      {...props}
      mode='padding'
      style={[
        styles.container,
        { backgroundColor: colors[colorScheme].background },
        style,
      ]}
    >
      <StatusBar
        backgroundColor={colors[colorScheme].background}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ErrorBoundary onReset={onResetError}>
        {isError ? <DefaultError onReset={onResetError} /> : children}
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeScreen;

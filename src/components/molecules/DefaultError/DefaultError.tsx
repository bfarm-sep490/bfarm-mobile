import { StyleSheet, TouchableOpacity } from 'react-native';

import { useErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { Text, View } from '../../ui/Themed';

type Props = {
  onReset?: () => void;
};

function DefaultErrorScreen({ onReset = undefined }: Props) {
  const { t } = useTranslation();
  const { resetBoundary } = useErrorBoundary();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('error:title')}</Text>
      <Text style={styles.description}>{t('error:description')}</Text>

      {onReset && (
        <TouchableOpacity
          onPress={() => {
            resetBoundary();
            onReset?.();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{t('error:cta')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default DefaultErrorScreen;

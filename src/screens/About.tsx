import { useState } from 'react';

import { Button, StyleSheet, TouchableOpacity } from 'react-native';

import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Box } from '@/src/components/ui/box';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/Themed';

import { Skeleton } from '../components/atoms';
import { SafeScreen } from '../components/templates';
import { useUser } from '../hooks/domain';
import { useAppDispatch } from '../store';
import { setAppLanguage } from '../store/slices/appSlice';

const About = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { useFetchOneQuery } = useUser();

  const changeLang = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      dispatch(setAppLanguage(lng));
    } catch (err) {
      console.log(err);
    }
  };

  const [currentId, setCurrentId] = useState(-1);

  const fetchOneUserQuery = useFetchOneQuery(currentId);

  return (
    <SafeScreen
      isError={fetchOneUserQuery.isError}
      onResetError={fetchOneUserQuery.refetch}
    >
      <Box className='bg-primary-950 p-5'>
        <Text className='text-typography-0'>This is the Box</Text>
      </Box>
      <Skeleton height={64} loading={fetchOneUserQuery.isLoading} width={64}>
        <TouchableOpacity
          onPress={() => setCurrentId(Math.ceil(Math.random() * 9 + 1))}
          testID='fetch-user-button'
        >
          <Text>{t('home:title')}</Text>
        </TouchableOpacity>
      </Skeleton>
      <View style={styles.container} testID='home-screen'>
        <Text>{t('home:title')}</Text>
        <Link href='/about'>
          <Text style={styles.link}>{t('home:goToAboutScreen')}</Text>
        </Link>
        <Text>{t('home:changeLang')}</Text>
        <View style={styles.btnContainer}>
          <Button title={t('home:english')} onPress={() => changeLang('en')} />
          <Button title={t('home:vietnam')} onPress={() => changeLang('vi')} />
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 20,
  },
  link: {
    color: 'blue',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default About;

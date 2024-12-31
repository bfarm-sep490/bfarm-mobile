import { StyleSheet } from 'react-native';

import { Link } from 'expo-router';

import { Text, View } from '@/src/components/ui/Themed';

const About = () => {
  return (
    <View style={styles.container}>
      <Text>About screen</Text>
      <Link href='/home'>
        <Text style={styles.link}>Go to home screen</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  link: {
    color: 'blue',
  },
});

export default About;

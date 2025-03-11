import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from 'redux-persist';

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    return AsyncStorage.setItem(key, value);
  },
  getItem: key => {
    return AsyncStorage.getItem(key);
  },
  removeItem: key => {
    return AsyncStorage.removeItem(key);
  },
};

import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { store, persistor } from '../store';
import { reduxStorage } from '../store/storage';
import enError from './locales/en/error.json';
import enFarmerTask from './locales/en/farmer-task.json';
import enHome from './locales/en/home.json';
import enLayout from './locales/en/layout.json';
import enNotification from './locales/en/notification.json';
import enProblem from './locales/en/problem.json';
import enProfile from './locales/en/profile.json';
import enSignIn from './locales/en/sign-in.json';
import enSplash from './locales/en/splash.json';
import enTodo from './locales/en/todo.json';
import viError from './locales/vi/error.json';
import viFarmerTask from './locales/vi/farmer-task.json';
import viHome from './locales/vi/home.json';
import viLayout from './locales/vi/layout.json';
import viNotification from './locales/vi/notification.json';
import viProblem from './locales/vi/problem.json';
import viProfile from './locales/vi/profile.json';
import viSignIn from './locales/vi/sign-in.json';
import viSplash from './locales/vi/splash.json';
import viTodo from './locales/vi/todo.json';

// the translations
const resources: any = {
  en: {
    home: enHome,
    profile: enProfile,
    farmerTask: enFarmerTask,
    signIn: enSignIn,
    error: enError,
    notification: enNotification,
    problem: enProblem,
    todo: enTodo,
    splash: enSplash,
    layout: enLayout,
  },
  vi: {
    home: viHome,
    profile: viProfile,
    farmerTask: viFarmerTask,
    signIn: viSignIn,
    error: viError,
    notification: viNotification,
    problem: viProblem,
    todo: viTodo,
    splash: viSplash,
    layout: viLayout,
  },
} as const;

// Generally, we should use the locale language as the default language.
const localeLng = getLocales()[0].languageCode as string;
const isLocaleLngSupported = resources?.[localeLng];
const defaultLocale = 'en';

// Initialize i18n with default language
i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  resources,
  lng: defaultLocale,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

// Wait for Redux store to be rehydrated
persistor.subscribe(() => {
  const state = store.getState();
  const language = state.app.language;

  if (language && language !== i18next.language) {
    i18next.changeLanguage(language);
  }
});

// Subscribe to language changes in Redux store
let currentLanguage = store.getState().app.language;
store.subscribe(() => {
  const newLanguage = store.getState().app.language;
  if (newLanguage !== currentLanguage) {
    currentLanguage = newLanguage;
    if (newLanguage) {
      i18next.changeLanguage(newLanguage);
    }
  }
});

const t = i18next.t.bind(i18next);
export { t };

import { getLocales } from 'expo-localization';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { reduxStorage } from '../store/storage';
import enError from './locales/en/error.json';
import enFarmerTask from './locales/en/farmer-task.json';
import enHome from './locales/en/home.json';
import enNotification from './locales/en/notification.json';
import enProblem from './locales/en/problem.json';
import enProfile from './locales/en/profile.json';
import enSignIn from './locales/en/sign-in.json';
import enSplash from './locales/en/splash.json';
import enTodo from './locales/en/todo.json';
import viError from './locales/vi/error.json';
import viFarmerTask from './locales/vi/farmer-task.json';
import viHome from './locales/vi/home.json';
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
  },
} as const;
// This is for situations where the user can change the language in the app.
const rootStorage: string = reduxStorage.getItem('persist:root')?.[
  '_j'
] as string;
let lng: string | null = null;

try {
  lng = rootStorage ? JSON.parse(JSON.parse(rootStorage).app).language : null;
} catch (e) {
  console.error(e);
}

// Generally, we should use the locale language as the default language.
const localeLng = getLocales()[0].languageCode as string;
const isLocaleLngSupported = resources?.[localeLng];

const defaultLocale = 'en';
export const currentLanguage = i18next.language || defaultLocale;

i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  resources,
  lng: lng ? lng : isLocaleLngSupported ? localeLng : defaultLocale,

  keySeparator: false,

  interpolation: {
    escapeValue: false,
  },
});

const t = i18next.t.bind(i18next);
export { t };

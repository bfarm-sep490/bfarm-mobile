import ky from 'ky';

const prefixUrl = `${process.env.EXPO_PUBLIC_API_URL ?? ''}/`;

export const instance = ky.extend({
  headers: {
    Accept: 'application/json',
  },
  prefixUrl,
});

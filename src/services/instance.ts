import ky from 'ky';

const prefixUrl = `${process.env.EXPO_PUBLIC_API_URL ?? 'https://api.bfarmx.space'}/api`;

let tokenGetter: (() => string | null) | null = null;

export const setTokenGetter = (getter: () => string | null) => {
  tokenGetter = getter;
};

export const instance = ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        if (tokenGetter) {
          const token = tokenGetter();
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      },
    ],
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  prefixUrl,
});

export interface IResponse {
  message: string;
  status: number;
  data: any;
}

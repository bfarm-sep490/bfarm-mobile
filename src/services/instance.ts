import ky from 'ky';

const prefixUrl = `${process.env.EXPO_PUBLIC_API_URL ?? 'https://api.bfarmx.space'}/api`;

export const instance = ky.extend({
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

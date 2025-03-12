import ky from 'ky';

const prefixUrl = 'https://api.outfit4rent.online/api/';

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

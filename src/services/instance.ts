import ky from 'ky';

const prefixUrl = `${
  process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL : ''
}/`;

export const instance = ky.extend({
  headers: {
    Accept: 'application/json',
  },
  prefixUrl,
  hooks: {
    beforeRequest: [
      request => {
        if (!request.headers.get('Skip-Auth')) {
          const token = localStorage.getItem('jwt_token');
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        } else {
          request.headers.delete('Skip-Auth');
        }
      },
    ],
  },
});

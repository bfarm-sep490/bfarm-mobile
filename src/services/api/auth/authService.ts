import { instance } from '@/services/instance';

interface LoginResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await instance
      .post('auth/login', { json: credentials })
      .json<LoginResponse>();
    return response;
  },

  sendToken: async (
    farmer_id: number,
    token: string,
  ): Promise<LoginResponse> => {
    const response = await instance
      .post('auth/' + farmer_id + '/device-token', { json: { token } })
      .json<LoginResponse>();
    return response;
  },
};

export function safelyDecodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

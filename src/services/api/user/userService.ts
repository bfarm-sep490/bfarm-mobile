import { instance } from '@/services/instance';

import { userSchema } from './schema';

import type { UpdateUser, User } from './schema';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const UserServices = {
  fetchOne: async (id: number) => {
    const response = await instance
      .get(`farmers/${id}`)
      .json<ApiResponse<User>>();
    return userSchema.parse(response.data);
  },

  update: async (id: number, data: UpdateUser) => {
    const response = await instance
      .put(`farmers/${id}`, {
        json: data,
      })
      .json<ApiResponse<User>>();
    return userSchema.parse(response.data);
  },
};

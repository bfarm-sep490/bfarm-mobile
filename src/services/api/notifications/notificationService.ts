import { instance } from '@/services/instance';

import { notifcationResponseSchema } from './notificationSchema';

export const NotificationServices = {
  fetchAllByUserId: async (id: number) => {
    const response = await instance.get(`farmers/${id}/notifications`).json();
    return notifcationResponseSchema.parse(response);
  },
  markAsRead: async (id: number) => {
    const response = await instance
      .put(`farmers/notification-read/${id}`)
      .json();
    return response;
  },
  markAllAsRead: async (id: number) => {
    const response = await instance
      .put(`farmers/${id}/notifications-read`)
      .json();
    return response;
  },
  saveDeviceToken: async (userId: number, token: string) => {
    const response = await instance
      .post(
        `farmers/${userId}/device-token?tokenDevice=${encodeURIComponent(token)}`,
      )
      .json();
    return response;
  },
};

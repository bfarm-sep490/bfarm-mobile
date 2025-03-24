import { instance } from '@/services/instance';

import { notifcationResponseSchema } from './notificationSchema';

export const NotificationServices = {
  fetchAllByUserId: async (id: number) => {
    const response = await instance.get(`farmers/${id}/notifications`).json();
    return notifcationResponseSchema.parse(response);
  },
};

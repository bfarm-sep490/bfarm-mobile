import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationServices } from './notificationService';

const enum NotificationQueryKey {
  fetchAll = 'fetchAllNotification',
}

export const useNotification = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: NotificationQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  const useFetchAllByUserIdQuery = (id: number) =>
    useQuery({
      queryFn: () => NotificationServices.fetchAllByUserId(id),
      queryKey: [NotificationQueryKey.fetchAll],
    });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => NotificationServices.markAsRead(id),
    onSuccess: () => {
      invalidateQuery([NotificationQueryKey.fetchAll]);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: (id: number) => NotificationServices.markAllAsRead(id),
    onSuccess: () => {
      invalidateQuery([NotificationQueryKey.fetchAll]);
    },
  });

  const saveDeviceTokenMutation = useMutation({
    mutationFn: ({ userId, token }: { userId: number; token: string }) =>
      NotificationServices.saveDeviceToken(userId, token),
  });

  return {
    invalidateQuery,
    useFetchAllByUserIdQuery,
    markAsReadMutation,
    markAllAsReadMutation,
    saveDeviceTokenMutation,
  };
};

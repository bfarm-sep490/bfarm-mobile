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

  return {
    invalidateQuery,
    useFetchAllByUserIdQuery,
  };
};

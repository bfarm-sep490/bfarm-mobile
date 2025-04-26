import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UserServices } from './userService';

import type { UpdateUser, User } from './schema';

const enum UserQueryKey {
  fetchOne = 'fetchOneUser',
}

const useFetchOneQuery = (currentId: User['id']) =>
  useQuery({
    enabled: currentId >= 0,
    queryFn: () => UserServices.fetchOne(currentId),
    queryKey: [UserQueryKey.fetchOne, currentId],
  });

const useUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: User['id']; data: UpdateUser }) =>
      UserServices.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [UserQueryKey.fetchOne, id],
      });
    },
  });
};

export const useUser = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: UserQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  return {
    invalidateQuery,
    useFetchOneQuery,
    useUpdateMutation,
  };
};

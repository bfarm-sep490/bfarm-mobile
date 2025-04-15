import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { PackagingTypeServices } from './packagingTypeService';

const enum PackagingTypeQueryKey {
  fetchAll = 'fetchAllPackagingTypes',
}

export const usePackagingType = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: PackagingTypeQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  /**
   * Hook để lấy danh sách tất cả công việc chăm sóc
   */
  const useFetchAllQuery = (p0: { enabled: boolean }) =>
    useQuery({
      queryFn: () => PackagingTypeServices.fetchAll(),
      queryKey: [PackagingTypeQueryKey.fetchAll],
    });

  return {
    invalidateQuery,
    useFetchAllQuery,
  };
};

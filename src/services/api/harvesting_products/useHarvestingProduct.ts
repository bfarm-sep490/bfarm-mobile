import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  HarvestingProductServices,
  HarvestingProductParams,
} from './harvestingProductService';

const enum HarvestingProductQueryKey {
  fetchAll = 'fetchAllHarvestingProducts',
  fetchOne = 'fetchOneHarvestingProduct',
  fetchByParams = 'fetchByParamsHarvestingProducts',
}

export const useHarvestingProduct = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: HarvestingProductQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });
  /**
   * Hook để lấy danh sách công việc thu hoạch theo các tham số
   */
  const useFetchByParamsQuery = (
    params: HarvestingProductParams,
    enabled = true,
  ) =>
    useQuery({
      enabled,
      queryFn: () => HarvestingProductServices.fetchByParams(params),
      queryKey: [HarvestingProductQueryKey.fetchByParams, params],
    });

  return {
    invalidateQuery,

    useFetchByParamsQuery,
  };
};

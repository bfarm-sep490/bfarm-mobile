import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { PlanServices, type PlanParams } from './planService';

import type { Plan } from './planSchema';

const enum PlanQueryKey {
  fetchAll = 'fetchAllPlans',
  fetchOne = 'fetchOnePlan',
  fetchByParams = 'fetchByParamsPlans',
  fetchByFarmer = 'fetchByFarmerPlans',
  fetchByPlant = 'fetchByPlantPlans',
  fetchByExpert = 'fetchByExpertPlans',
}

export const usePlan = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: PlanQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  // Query hooks
  const useFetchAllQuery = (enabled = true) =>
    useQuery({
      queryFn: () => PlanServices.fetchAll(),
      queryKey: [PlanQueryKey.fetchAll],
      enabled,
    });

  const useFetchOneQuery = (planId: Plan['id'], enabled = true) =>
    useQuery({
      enabled: enabled && planId > 0,
      queryFn: () => PlanServices.fetchOne(planId),
      queryKey: [PlanQueryKey.fetchOne, planId],
    });

  const useFetchByParamsQuery = (params: PlanParams, enabled = true) =>
    useQuery({
      enabled,
      queryFn: () => PlanServices.fetchByParams(params),
      queryKey: [PlanQueryKey.fetchByParams, params],
    });

  const useFetchByFarmerQuery = (farmerId: number, enabled = true) =>
    useQuery({
      enabled: enabled && farmerId > 0,
      queryFn: () => PlanServices.fetchByFarmer(farmerId),
      queryKey: [PlanQueryKey.fetchByFarmer, farmerId],
    });

  const useFetchByPlantQuery = (plantId: number, enabled = true) =>
    useQuery({
      enabled: enabled && plantId > 0,
      queryFn: () => PlanServices.fetchByPlant(plantId),
      queryKey: [PlanQueryKey.fetchByPlant, plantId],
    });

  const useFetchByExpertQuery = (expertId: number, enabled = true) =>
    useQuery({
      enabled: enabled && expertId > 0,
      queryFn: () => PlanServices.fetchByExpert(expertId),
      queryKey: [PlanQueryKey.fetchByExpert, expertId],
    });

  // Mutation hooks
  const useCreateMutation = () =>
    useMutation({
      mutationFn: (data: any) => PlanServices.create(data),
      onSuccess: () => {
        invalidateQuery([
          PlanQueryKey.fetchAll,
          PlanQueryKey.fetchByFarmer,
          PlanQueryKey.fetchByPlant,
          PlanQueryKey.fetchByExpert,
          PlanQueryKey.fetchByParams,
        ]);
      },
    });

  const useUpdateMutation = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) =>
        PlanServices.update(id, data),
      onSuccess: (_, variables) => {
        invalidateQuery([
          PlanQueryKey.fetchAll,
          PlanQueryKey.fetchByFarmer,
          PlanQueryKey.fetchByPlant,
          PlanQueryKey.fetchByExpert,
          PlanQueryKey.fetchByParams,
        ]);
        client.invalidateQueries({
          queryKey: [PlanQueryKey.fetchOne, variables.id],
        });
      },
    });

  const useApprovePlanMutation = () =>
    useMutation({
      mutationFn: (id: number) => PlanServices.approvePlan(id),
      onSuccess: (_, id) => {
        invalidateQuery([
          PlanQueryKey.fetchAll,
          PlanQueryKey.fetchByFarmer,
          PlanQueryKey.fetchByPlant,
          PlanQueryKey.fetchByExpert,
          PlanQueryKey.fetchByParams,
        ]);
        client.invalidateQueries({
          queryKey: [PlanQueryKey.fetchOne, id],
        });
      },
    });

  const useCompletePlanMutation = () =>
    useMutation({
      mutationFn: ({
        id,
        actualProduct,
      }: {
        id: number;
        actualProduct: number;
      }) => PlanServices.completePlan(id, actualProduct),
      onSuccess: (_, variables) => {
        invalidateQuery([
          PlanQueryKey.fetchAll,
          PlanQueryKey.fetchByFarmer,
          PlanQueryKey.fetchByPlant,
          PlanQueryKey.fetchByExpert,
          PlanQueryKey.fetchByParams,
        ]);
        client.invalidateQueries({
          queryKey: [PlanQueryKey.fetchOne, variables.id],
        });
      },
    });

  const useDeleteMutation = () =>
    useMutation({
      mutationFn: (id: number) => PlanServices.delete(id),
      onSuccess: () => {
        invalidateQuery([
          PlanQueryKey.fetchAll,
          PlanQueryKey.fetchByFarmer,
          PlanQueryKey.fetchByPlant,
          PlanQueryKey.fetchByExpert,
          PlanQueryKey.fetchByParams,
        ]);
      },
    });

  return {
    invalidateQuery,
    useFetchAllQuery,
    useFetchOneQuery,
    useFetchByParamsQuery,
    useFetchByFarmerQuery,
    useFetchByPlantQuery,
    useFetchByExpertQuery,
    useCreateMutation,
    useUpdateMutation,
    useApprovePlanMutation,
    useCompletePlanMutation,
    useDeleteMutation,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CaringTaskParams, CaringTaskServices } from './caringTaskService';

import type { CaringTask } from './caringTaskSchema';

const enum CaringTaskQueryKey {
  fetchAll = 'fetchAllCaringTasks',
  fetchOne = 'fetchOneCaringTask',
  fetchByParams = 'fetchByParamsCaringTasks',
  fetchByFarmer = 'fetchByFarmerCaringTasks',
  fetchByPlan = 'fetchByPlanCaringTasks',
}

export const useCaringTask = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: CaringTaskQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  const useFetchAllQuery = () =>
    useQuery({
      queryFn: () => CaringTaskServices.fetchAll(),
      queryKey: [CaringTaskQueryKey.fetchAll],
    });

  const useFetchOneQuery = (taskId: CaringTask['id']) =>
    useQuery({
      enabled: taskId > 0,
      queryFn: () => CaringTaskServices.fetchOne(taskId),
      queryKey: [CaringTaskQueryKey.fetchOne, taskId],
    });

  const useFetchByFarmerQuery = (farmerId: number) =>
    useQuery({
      enabled: farmerId > 0,
      queryFn: () => CaringTaskServices.fetchByFarmer(farmerId),
      queryKey: [CaringTaskQueryKey.fetchByFarmer, farmerId],
    });

  const useFetchByPlanQuery = (planId: number) =>
    useQuery({
      enabled: planId > 0,
      queryFn: () => CaringTaskServices.fetchByPlan(planId),
      queryKey: [CaringTaskQueryKey.fetchByPlan, planId],
    });

  const useFetchByParamsQuery = (params: CaringTaskParams, enabled = true) =>
    useQuery({
      enabled,
      queryFn: () => CaringTaskServices.fetchByParams(params),
      queryKey: [CaringTaskQueryKey.fetchByParams, params],
    });

  const useCreateMutation = () =>
    useMutation({
      mutationFn: (data: any) => CaringTaskServices.create(data),
      onSuccess: () => {
        invalidateQuery([CaringTaskQueryKey.fetchAll]);
      },
    });

  const useUpdateMutation = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) =>
        CaringTaskServices.update(id, data),
      onSuccess: (_, variables) => {
        invalidateQuery([
          CaringTaskQueryKey.fetchAll,
          CaringTaskQueryKey.fetchOne,
          CaringTaskQueryKey.fetchByFarmer,
          CaringTaskQueryKey.fetchByPlan,
        ]);
        client.invalidateQueries({
          queryKey: [CaringTaskQueryKey.fetchOne, variables.id],
        });
      },
    });

  const useCompleteMutation = () =>
    useMutation({
      mutationFn: ({
        id,
        resultContent,
        images,
      }: {
        id: number;
        resultContent: string;
        images?: string[];
      }) => CaringTaskServices.complete(id, resultContent, images),
      onSuccess: (_, variables) => {
        invalidateQuery([
          CaringTaskQueryKey.fetchAll,
          CaringTaskQueryKey.fetchOne,
          CaringTaskQueryKey.fetchByFarmer,
          CaringTaskQueryKey.fetchByPlan,
        ]);
        client.invalidateQueries({
          queryKey: [CaringTaskQueryKey.fetchOne, variables.id],
        });
      },
    });

  const useDeleteMutation = () =>
    useMutation({
      mutationFn: (id: number) => CaringTaskServices.delete(id),
      onSuccess: () => {
        invalidateQuery([
          CaringTaskQueryKey.fetchAll,
          CaringTaskQueryKey.fetchByFarmer,
          CaringTaskQueryKey.fetchByPlan,
        ]);
      },
    });

  return {
    invalidateQuery,
    useFetchAllQuery,
    useFetchOneQuery,
    useFetchByParamsQuery,
    useFetchByFarmerQuery,
    useFetchByPlanQuery,
    useCreateMutation,
    useUpdateMutation,
    useCompleteMutation,
    useDeleteMutation,
  };
};

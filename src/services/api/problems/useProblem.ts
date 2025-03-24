import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ICreateProblem } from 'src/interfaces';

import { Problem } from './problemSchema';
import {
  CreateProblemData,
  ProblemParams,
  ProblemServices,
} from './problemService';

const enum ProblemQueryKey {
  fetchAll = 'fetchAllProblems',
  fetchOne = 'fetchOneProblem',
  fetchByParams = 'fetchByParamsProblems',
  fetchSelectedPlanByUserId = 'fetchSelectedPlanByUserId',
}

export const useProblem = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: ProblemQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  const useFetchAllQuery = () =>
    useQuery({
      queryFn: () => ProblemServices.fetchAll(),
      queryKey: [ProblemQueryKey.fetchAll],
    });

  const useFetchOneQuery = (taskId: Problem['id']) =>
    useQuery({
      enabled: taskId > 0,
      queryFn: () => ProblemServices.fetchOne(taskId),
      queryKey: [ProblemQueryKey.fetchOne, taskId],
    });
  const useFetchSelectedPlansByUserIdQuery = (
    id: number,
  ): ReturnType<typeof useQuery> =>
    useQuery({
      enabled: id > 0,
      queryFn: () => ProblemServices.fetchSelectedPlanByUserId(id),
      queryKey: [ProblemQueryKey.fetchSelectedPlanByUserId],
    });
  const useFetchByParamsQuery = (params: ProblemParams, enabled = true) =>
    useQuery({
      enabled,
      queryFn: () => ProblemServices.fetchByParams(params),
      queryKey: [ProblemQueryKey.fetchByParams, params],
    });

  const useCreateProblemMutation = (report: ICreateProblem) =>
    useMutation({
      mutationFn: ({ data }: { data: CreateProblemData }) =>
        ProblemServices.createProblem(data),
      onSuccess: () => {
        invalidateQuery([
          ProblemQueryKey.fetchAll,
          ProblemQueryKey.fetchOne,
          ProblemQueryKey.fetchByParams,
        ]);
      },
    });

  const useUploadImagesMutation = () =>
    useMutation({
      mutationFn: (images: File[]) => ProblemServices.uploadImages(images),
    });

  return {
    invalidateQuery,
    useFetchAllQuery,
    useFetchOneQuery,
    useFetchSelectedPlansByUserIdQuery,
    useFetchByParamsQuery,
    useCreateProblemMutation,
    useUploadImagesMutation,
  };
};

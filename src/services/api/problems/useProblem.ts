import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  const useFetchByParamsQuery = (params: ProblemParams, enabled = true) =>
    useQuery({
      enabled,
      queryFn: () => ProblemServices.fetchByParams(params),
      queryKey: [ProblemQueryKey.fetchByParams, params],
    });

  const useCreateProblemMutation = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: CreateProblemData }) =>
        ProblemServices.createProblem(id, data),
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
    useFetchByParamsQuery,
    useCreateProblemMutation,
    useUploadImagesMutation,
  };
};

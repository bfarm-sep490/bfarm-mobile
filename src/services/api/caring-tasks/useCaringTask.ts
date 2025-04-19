import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  CaringTaskParams,
  CaringTaskServices,
  TaskReportData,
} from './caringTaskService';

import type { CaringTask } from './caringTaskSchema';

const enum CaringTaskQueryKey {
  fetchAll = 'fetchAllCaringTasks',
  fetchOne = 'fetchOneCaringTask',
  fetchByParams = 'fetchByParamsCaringTasks',
}

export const useCaringTask = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: CaringTaskQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  /**
   * Hook để lấy danh sách tất cả công việc chăm sóc
   */
  const useFetchAllQuery = () =>
    useQuery({
      queryFn: () => CaringTaskServices.fetchAll(),
      queryKey: [CaringTaskQueryKey.fetchAll],
    });

  /**
   * Hook để lấy thông tin chi tiết của một công việc chăm sóc theo ID
   */
  const useFetchOneQuery = (taskId: CaringTask['id']) =>
    useQuery({
      enabled: taskId > 0,
      queryFn: () => CaringTaskServices.fetchOne(taskId),
      queryKey: [CaringTaskQueryKey.fetchOne, taskId],
    });

  /**
   * Hook để lấy danh sách công việc chăm sóc theo các tham số
   */
  const useFetchByParamsQuery = (params: CaringTaskParams, enabled = true) =>
    useQuery({
      enabled,
      queryFn: () => CaringTaskServices.fetchByParams(params),
      queryKey: [CaringTaskQueryKey.fetchByParams, params],
    });

  /**
   * Hook để cập nhật báo cáo công việc
   */
  const useUpdateTaskReportMutation = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TaskReportData }) =>
        CaringTaskServices.updateTaskReport(id, data),
      onSuccess: () => {
        invalidateQuery([
          CaringTaskQueryKey.fetchAll,
          CaringTaskQueryKey.fetchOne,
          CaringTaskQueryKey.fetchByParams,
        ]);
      },
    });

  /**
   * Hook để upload hình ảnh cho công việc chăm sóc
   */
  const useUploadImagesMutation = (images: File[]) =>
    useMutation({
      mutationFn: () => CaringTaskServices.uploadImages(images),
    });

  return {
    invalidateQuery,
    useFetchAllQuery,
    useFetchOneQuery,
    useFetchByParamsQuery,
    useUpdateTaskReportMutation,
    useUploadImagesMutation,
  };
};

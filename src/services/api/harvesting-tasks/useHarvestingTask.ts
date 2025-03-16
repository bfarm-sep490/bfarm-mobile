import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  HarvestingTaskParams,
  HarvestingTaskServices,
  TaskReportData,
} from './harvestingTaskService';

import type { HarvestingTask } from './harvestingTaskSchema';

const enum HarvestingTaskQueryKey {
  fetchAll = 'fetchAllHarvestingTasks',
  fetchOne = 'fetchOneHarvestingTask',
  fetchByParams = 'fetchByParamsHarvestingTasks',
}

export const useHarvestingTask = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: HarvestingTaskQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  /**
   * Hook để lấy danh sách tất cả công việc thu hoạch
   */
  const useFetchAllQuery = () =>
    useQuery({
      queryFn: () => HarvestingTaskServices.fetchAll(),
      queryKey: [HarvestingTaskQueryKey.fetchAll],
    });

  /**
   * Hook để lấy thông tin chi tiết của một công việc thu hoạch theo ID
   */
  const useFetchOneQuery = (taskId: HarvestingTask['id']) =>
    useQuery({
      enabled: taskId > 0,
      queryFn: () => HarvestingTaskServices.fetchOne(taskId),
      queryKey: [HarvestingTaskQueryKey.fetchOne, taskId],
    });

  /**
   * Hook để lấy danh sách công việc thu hoạch theo các tham số
   */
  const useFetchByParamsQuery = (
    params: HarvestingTaskParams,
    enabled = true,
  ) =>
    useQuery({
      enabled,
      queryFn: () => HarvestingTaskServices.fetchByParams(params),
      queryKey: [HarvestingTaskQueryKey.fetchByParams, params],
    });

  /**
   * Hook để cập nhật báo cáo công việc thu hoạch
   */
  const useUpdateTaskReportMutation = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TaskReportData }) =>
        HarvestingTaskServices.updateTaskReport(id, data),
      onSuccess: () => {
        invalidateQuery([
          HarvestingTaskQueryKey.fetchAll,
          HarvestingTaskQueryKey.fetchOne,
          HarvestingTaskQueryKey.fetchByParams,
        ]);
      },
    });

  /**
   * Hook để upload hình ảnh cho công việc thu hoạch
   */
  const useUploadImagesMutation = () =>
    useMutation({
      mutationFn: (images: File[]) =>
        HarvestingTaskServices.uploadImages(images),
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

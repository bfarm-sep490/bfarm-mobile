import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  PackagingTaskParams,
  PackagingTaskServices,
  TaskReportData,
} from './packagingTaskService';

import type { PackagingTask } from './packagingTaskSchema';

const enum PackagingTaskQueryKey {
  fetchAll = 'fetchAllPackagingTasks',
  fetchOne = 'fetchOnePackagingTask',
  fetchByParams = 'fetchByParamsPackagingTasks',
}

export const usePackagingTask = () => {
  const client = useQueryClient();

  const invalidateQuery = (queryKeys: PackagingTaskQueryKey[]) =>
    client.invalidateQueries({
      queryKey: queryKeys,
    });

  /**
   * Hook để lấy danh sách tất cả công việc đóng gói
   */
  const useFetchAllQuery = () =>
    useQuery({
      queryFn: () => PackagingTaskServices.fetchAll(),
      queryKey: [PackagingTaskQueryKey.fetchAll],
    });

  /**
   * Hook để lấy thông tin chi tiết của một công việc đóng gói theo ID
   */
  const useFetchOneQuery = (taskId: PackagingTask['id']) =>
    useQuery({
      enabled: taskId > 0,
      queryFn: () => PackagingTaskServices.fetchOne(taskId),
      queryKey: [PackagingTaskQueryKey.fetchOne, taskId],
    });

  /**
   * Hook để lấy danh sách công việc đóng gói theo các tham số
   */
  const useFetchByParamsQuery = (params: PackagingTaskParams, enabled = true) =>
    useQuery({
      enabled,
      queryFn: () => PackagingTaskServices.fetchByParams(params),
      queryKey: [PackagingTaskQueryKey.fetchByParams, params],
    });

  /**
   * Hook để cập nhật báo cáo công việc đóng gói
   */
  const useUpdateTaskReportMutation = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TaskReportData }) =>
        PackagingTaskServices.updateTaskReport(id, data),
      onSuccess: () => {
        invalidateQuery([
          PackagingTaskQueryKey.fetchAll,
          PackagingTaskQueryKey.fetchOne,
          PackagingTaskQueryKey.fetchByParams,
        ]);
      },
    });

  /**
   * Hook để upload hình ảnh cho công việc đóng gói
   */
  const useUploadImagesMutation = () =>
    useMutation({
      mutationFn: (images: File[]) =>
        PackagingTaskServices.uploadImages(images),
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

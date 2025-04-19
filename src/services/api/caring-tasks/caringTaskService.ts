import { instance } from '@/services/instance';

import {
  caringTaskListResponseSchema,
  caringTaskDetailResponseSchema,
  taskReportUpdateResponseSchema,
  imageUploadResponseSchema,
} from './caringTaskSchema';

export type CaringTaskParams = {
  plan_id?: number;
  farmer_id?: number;
  status?: string;
  task_type?: string;
  [key: string]: any;
};

export type TaskReportData = {
  result_content: string;
  report_by: string;
  status?: string;
  list_of_image_urls: string[];
};

export const CaringTaskServices = {
  /**
   * Lấy danh sách tất cả công việc chăm sóc
   */
  fetchAll: async () => {
    const response = await instance.get('caring-tasks').json();
    return caringTaskListResponseSchema.parse(response);
  },

  /**
   * Lấy thông tin chi tiết của một công việc chăm sóc theo ID
   */
  fetchOne: async (id: number) => {
    const response = await instance.get(`caring-tasks/${id}`).json();
    return caringTaskDetailResponseSchema.parse(response);
  },

  /**
   * Lấy danh sách công việc chăm sóc theo các tham số
   */
  fetchByParams: async (params: CaringTaskParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `caring-tasks?${queryString}` : 'caring-tasks';

    const response = await instance.get(url).json();
    return caringTaskListResponseSchema.parse(response);
  },

  /**
   * Cập nhật báo cáo công việc
   */
  updateTaskReport: async (id: number, data: TaskReportData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await instance
        .put(`caring-tasks/${id}/task-report`, {
          json: data,
          signal: controller.signal,
          timeout: 30000,
        })
        .json();
      return taskReportUpdateResponseSchema.parse(response);
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Upload hình ảnh cho công việc chăm sóc
   */
  uploadImages: async (images: File[]) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
  },
};

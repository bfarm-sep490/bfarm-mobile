import { instance } from '@/services/instance';

import {
  harvestingTaskListResponseSchema,
  harvestingTaskDetailResponseSchema,
  taskReportUpdateResponseSchema,
  imageUploadResponseSchema,
} from './harvestingTaskSchema';

export type HarvestingTaskParams = {
  plan_id?: number;
  farmer_id?: number;
  status?: string;
  [key: string]: any;
};

export type TaskReportData = {
  status: string;
  result_content?: string;
  list_of_image_urls?: string[];
  harvested_quantity: number;
  product_expired_date?: string;
  fail_quantity?: number;
  report_by: string;
};

export const HarvestingTaskServices = {
  /**
   * Lấy danh sách tất cả công việc thu hoạch
   */
  fetchAll: async () => {
    const response = await instance.get('harvesting-tasks').json();
    return harvestingTaskListResponseSchema.parse(response);
  },

  /**
   * Lấy thông tin chi tiết của một công việc thu hoạch theo ID
   */
  fetchOne: async (id: number) => {
    const response = await instance.get(`harvesting-tasks/${id}`).json();
    return harvestingTaskDetailResponseSchema.parse(response);
  },

  /**
   * Lấy danh sách công việc thu hoạch theo các tham số
   */
  fetchByParams: async (params: HarvestingTaskParams) => {
    // Chuyển đổi params thành chuỗi query
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString
      ? `harvesting-tasks?${queryString}`
      : 'harvesting-tasks';

    const response = await instance.get(url).json();
    return harvestingTaskListResponseSchema.parse(response);
  },

  /**
   * Cập nhật báo cáo công việc thu hoạch
   */
  updateTaskReport: async (id: number, data: TaskReportData) => {
    const response = await instance
      .put(`harvesting-tasks/${id}/task-report`, { json: data })
      .json();
    const responseData = taskReportUpdateResponseSchema.parse(response);
    return responseData;
  },

  /**
   * Upload hình ảnh cho công việc thu hoạch
   */
  uploadImages: async (images: File[]) => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('image', image);
    });

    const response = await instance
      .post('harvesting-tasks/images/upload', {
        body: formData,
        headers: {
          // Remove Content-Type header so that the browser can set it with proper boundary
          'Content-Type': undefined,
        },
      })
      .json();

    return imageUploadResponseSchema.parse(response);
  },
};

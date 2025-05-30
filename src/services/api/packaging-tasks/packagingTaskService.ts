import { instance } from '@/services/instance';

import {
  packagingTaskListResponseSchema,
  packagingTaskDetailResponseSchema,
  taskReportUpdateResponseSchema,
  imageUploadResponseSchema,
} from './packagingTaskSchema';

export type PackagingTaskParams = {
  plan_id?: number;
  farmer_id?: number;
  status?: string | string[];
  task_type?: string;
  [key: string]: any;
};

export type TaskReportData = {
  harvesting_task_id?: number;
  packaged_item_count?: number;
  total_packaged_weight?: number;
  result_content?: string;
  status: string;
  report_by: string;
  list_of_image_urls?: string[];
};

export const PackagingTaskServices = {
  /**
   * Lấy danh sách tất cả công việc đóng gói
   */
  fetchAll: async () => {
    const response = await instance.get('packaging-tasks').json();
    return packagingTaskListResponseSchema.parse(response);
  },

  /**
   * Lấy thông tin chi tiết của một công việc đóng gói theo ID
   */
  fetchOne: async (id: number) => {
    const response = await instance.get(`packaging-tasks/${id}`).json();
    return packagingTaskDetailResponseSchema.parse(response);
  },

  /**
   * Lấy danh sách công việc đóng gói theo các tham số
   */
  fetchByParams: async (params: PackagingTaskParams) => {
    // Chuyển đổi params thành chuỗi query
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'status' && Array.isArray(value)) {
          // Xử lý đặc biệt cho status array
          value.forEach(status => {
            searchParams.append('status', status);
          });
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    const url = queryString
      ? `packaging-tasks?${queryString}`
      : 'packaging-tasks';

    const response = await instance.get(url).json();
    return packagingTaskListResponseSchema.parse(response);
  },

  /**
   * Cập nhật báo cáo công việc đóng gói
   */
  updateTaskReport: async (id: number, data: TaskReportData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await instance
        .put(`packaging-tasks/${id}/task-report`, {
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
   * Upload hình ảnh cho công việc đóng gói
   */
  uploadImages: async (images: File[]) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('image', image);
      });

      const response = await instance
        .post('packaging-tasks/images/upload', {
          body: formData,
          signal: controller.signal,
          timeout: 30000,
          headers: {
            'Content-Type': undefined,
          },
        })
        .json();

      return imageUploadResponseSchema.parse(response);
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

import { instance } from '@/services/instance';

import {
  imageUploadResponseSchema,
  problemDetailResponseSchema,
  problemsResponseSchema,
} from './problemSchema';

export type ProblemParams = {
  plan_id?: number;
  farmer_id?: number;
  status?: string;
  problem_name?: string;
  [key: string]: any;
};

export type CreateProblemData = {
  problem_name: string;
  description: string;
  plan_id: number;
  farmer_id: number;
  images: string[];
};

export const ProblemServices = {
  /**
   * Lấy danh sách tất cả công việc chăm sóc
   */
  fetchAll: async () => {
    const response = await instance.get('problems').json();
    return problemsResponseSchema.parse(response);
  },

  /**
   * Lấy thông tin chi tiết của một công việc chăm sóc theo ID
   */
  fetchOne: async (id: number) => {
    const response = await instance.get(`problems/${id}`).json();
    return problemDetailResponseSchema.parse(response);
  },

  /**
   * Lấy danh sách công việc chăm sóc theo các tham số
   */
  fetchByParams: async (params: ProblemParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `problems?${queryString}` : 'problems';

    const response = await instance.get(url).json();
    return problemsResponseSchema.parse(response);
  },

  /**
   * Cập nhật báo cáo công việc
   */
  createProblem: async (id: number, data: CreateProblemData) => {
    const response = await instance
      .post(`problems/${id}`, { json: data })
      .json();
    return problemDetailResponseSchema.parse(response);
  },

  /**
   * Upload hình ảnh cho công việc chăm sóc
   */
  uploadImages: async (images: File[]) => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('image', image);
    });

    const response = await instance
      .post('problems/images/upload', {
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

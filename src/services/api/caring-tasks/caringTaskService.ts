import { instance } from '@/services/instance';

import { caringTaskSchema, caringTaskResponseSchema } from './caringTaskSchema';

export type CaringTaskParams = {
  plan_id?: number;
  farmer_id?: number;
  is_completed?: boolean;
  status?: string;
  task_type?: string;
  priority?: number;
  [key: string]: any;
};

export const CaringTaskServices = {
  fetchAll: async () => {
    const response = await instance.get('caring-tasks').json();
    return caringTaskResponseSchema.parse(response);
  },

  fetchOne: async (id: number) => {
    const response = await instance.get(`caring-tasks/${id}`).json();
    return caringTaskSchema.parse(response);
  },

  fetchByParams: async (params: CaringTaskParams) => {
    // Convert params object to URLSearchParams string
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `caring-tasks?${queryString}` : 'caring-tasks';

    const response = await instance.get(url).json();
    return caringTaskResponseSchema.parse(response);
  },

  fetchByFarmer: async (farmerId: number) => {
    const response = await instance
      .get(`caring-tasks/farmer/${farmerId}`)
      .json();
    return caringTaskResponseSchema.parse(response);
  },

  fetchByPlan: async (planId: number) => {
    const response = await instance.get(`caring-tasks/plan/${planId}`).json();
    return caringTaskResponseSchema.parse(response);
  },

  create: async (data: any) => {
    const response = await instance.post('caring-tasks', { json: data }).json();
    return caringTaskSchema.parse(response);
  },

  update: async (id: number, data: any) => {
    const response = await instance
      .put(`caring-tasks/${id}`, { json: data })
      .json();
    return caringTaskSchema.parse(response);
  },

  complete: async (
    id: number,
    resultContent: string,
    images: string[] = [],
  ) => {
    const response = await instance
      .patch(`caring-tasks/${id}/complete`, {
        json: {
          result_content: resultContent,
          images,
        },
      })
      .json();
    return caringTaskSchema.parse(response);
  },

  delete: async (id: number) => {
    return await instance.delete(`caring-tasks/${id}`).json();
  },
};

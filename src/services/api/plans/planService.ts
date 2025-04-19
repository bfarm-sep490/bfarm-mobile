import { instance } from '@/services/instance';

import { planResponseSchema, singlePlanResponseSchema } from './planSchema';

// Define the params type for filtering plans
export type PlanParams = {
  plant_id?: number;
  expert_id?: number;
  status?: string;
  is_approved?: boolean;
  is_active_in_plan?: boolean;
  [key: string]: any; // Allow for additional parameters
};

export const PlanServices = {
  fetchAll: async () => {
    const response = await instance.get('plans').json();
    return planResponseSchema.parse(response);
  },

  fetchOne: async (id: number) => {
    const response = await instance.get(`plans/${id}`).json();
    return singlePlanResponseSchema.parse(response);
  },

  fetchByParams: async (params: PlanParams) => {
    // Convert params object to URLSearchParams string
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `plans?${queryString}` : 'plans';

    const response = await instance.get(url).json();
    return planResponseSchema.parse(response);
  },

  fetchByFarmer: async (farmerId: number) => {
    try {
      const response = await instance
        .get(`plans/farmer/${farmerId}?is_active_in_plan=true`)
        .json();
      const parsedResponse = planResponseSchema.parse(response);

      return parsedResponse;
    } catch (error) {
      throw error;
    }
  },

  fetchByPlant: async (plantId: number) => {
    const response = await instance.get(`plans/plant/${plantId}`).json();
    return planResponseSchema.parse(response);
  },

  fetchByExpert: async (expertId: number) => {
    const response = await instance.get(`plans/expert/${expertId}`).json();
    return planResponseSchema.parse(response);
  },

  create: async (data: any) => {
    const response = await instance.post('plans', { json: data }).json();
    return singlePlanResponseSchema.parse(response);
  },

  update: async (id: number, data: any) => {
    const response = await instance.put(`plans/${id}`, { json: data }).json();
    return singlePlanResponseSchema.parse(response);
  },

  approvePlan: async (id: number) => {
    const response = await instance.patch(`plans/${id}/approve`).json();
    return singlePlanResponseSchema.parse(response);
  },

  completePlan: async (id: number, actualProduct: number) => {
    const response = await instance
      .patch(`plans/${id}/complete`, {
        json: { actual_product: actualProduct },
      })
      .json();
    return singlePlanResponseSchema.parse(response);
  },

  delete: async (id: number) => {
    return await instance.delete(`plans/${id}`).json();
  },
};

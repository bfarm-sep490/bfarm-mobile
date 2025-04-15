import { instance } from '@/services/instance';

import { harvestingProductListResponseSchema } from './harvestingProductSchema';

export type HarvestingProductParams = {
  plan_id?: number;
  packaging_task_id?: number;
  status?: string;
  [key: string]: any;
};

export const HarvestingProductServices = {
  /**
   * Lấy danh sách công việc thu hoạch theo các tham số
   */
  fetchByParams: async (params: HarvestingProductParams) => {
    // Chuyển đổi params thành chuỗi query
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString
      ? `harvesting-product?${queryString}`
      : 'harvesting-product';

    const response = await instance.get(url).json();
    return harvestingProductListResponseSchema.parse(response);
  },
};

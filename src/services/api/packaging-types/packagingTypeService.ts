import { instance } from '@/services/instance';

import { packagingTypeListResponseSchema } from './packagingTypeSchema';

export const PackagingTypeServices = {
  /**
   * Lấy danh sách công việc thu hoạch theo các tham số
   */
  fetchAll: async () => {
    const url = 'packaging-types';

    const response = await instance.get(url).json();
    return packagingTypeListResponseSchema.parse(response);
  },
};

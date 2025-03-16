import { z } from 'zod';

// Schema cho ảnh của công việc thu hoạch
export const harvestImageSchema = z.object({
  id: z.number(),
  task_id: z.number(),
  url: z.string(),
});

// Schema cho các vật phẩm sử dụng trong công việc thu hoạch
export const harvestingItemSchema = z.object({
  item_id: z.number(),
  task_id: z.number(),
  quantity: z.number(),
  unit: z.string(),
});

// Schema cho thông tin người làm nông và trạng thái công việc
export const farmerInformationSchema = z.object({
  farmer_id: z.number(),
  farmer_name: z.string(),
  status: z.string(),
});

// Schema cho công việc thu hoạch
export const harvestingTaskSchema = z.object({
  id: z.number(),
  plan_id: z.number(),
  farmer_information: z.array(farmerInformationSchema),
  task_name: z.string(),
  description: z.string(),
  result_content: z.string().nullable().optional(),
  start_date: z.string(),
  end_date: z.string(),
  complete_date: z.string().nullable().optional(),
  harvested_quantity: z.number(),
  status: z.string(),
  product_expired_date: z.string().nullable().optional(),
  fail_quantity: z.number().nullable().optional(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
  harvest_images: z.array(harvestImageSchema).optional(),
  harvesting_items: z.array(harvestingItemSchema).optional(),
});

// Schema cho response khi lấy danh sách công việc thu hoạch
export const harvestingTaskListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(harvestingTaskSchema),
});

// Schema cho response khi lấy một công việc thu hoạch cụ thể
export const harvestingTaskDetailResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(harvestingTaskSchema),
});

// Schema cho response khi cập nhật báo cáo công việc thu hoạch
export const taskReportUpdateResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    planId: z.number(),
    taskName: z.string(),
    description: z.string(),
    resultContent: z.string().nullable().optional(),
    startDate: z.string(),
    endDate: z.string(),
    completeDate: z.string(),
    harvestedQuantity: z.number(),
    status: z.string(),
    productExpiredDate: z.string().nullable().optional(),
    failQuantity: z.number().nullable().optional(),
    createdAt: z.string(),
    createdBy: z.string(),
    updatedAt: z.string(),
    updatedBy: z.string(),
    plan: z.any().nullable(),
    harvestingImages: z.any().nullable(),
    harvestingItems: z.any().nullable(),
    packagingProducts: z.any().nullable(),
    farmerHarvestingTasks: z.any().nullable(),
  }),
});

// Schema cho response khi upload hình ảnh
export const imageUploadResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.string()),
});

// Export types
export type HarvestImage = z.infer<typeof harvestImageSchema>;
export type HarvestingItem = z.infer<typeof harvestingItemSchema>;
export type FarmerInformation = z.infer<typeof farmerInformationSchema>;
export type HarvestingTask = z.infer<typeof harvestingTaskSchema>;
export type HarvestingTaskListResponse = z.infer<
  typeof harvestingTaskListResponseSchema
>;
export type HarvestingTaskDetailResponse = z.infer<
  typeof harvestingTaskDetailResponseSchema
>;
export type TaskReportUpdateResponse = z.infer<
  typeof taskReportUpdateResponseSchema
>;
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>;

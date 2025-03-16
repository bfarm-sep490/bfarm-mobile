import { z } from 'zod';

// Schema cho ảnh của công việc đóng gói
export const packagingImageSchema = z.object({
  id: z.number(),
  task_id: z.number(),
  url: z.string(),
});

// Schema cho các vật phẩm sử dụng trong công việc đóng gói
export const packagingItemSchema = z.object({
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

// Schema cho công việc đóng gói
export const packagingTaskSchema = z.object({
  id: z.number(),
  plan_id: z.number(),
  packaging_type_id: z.number().nullable().optional(),
  farmer_information: z.array(farmerInformationSchema),
  task_name: z.string(),
  packed_quantity: z.number(),
  description: z.string(),
  result_content: z.string().nullable().optional(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.string(),
  complete_date: z.string().nullable().optional(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
  packaging_images: z.array(packagingImageSchema).optional(),
  packaging_items: z.array(packagingItemSchema).optional(),
});

// Schema cho response khi lấy danh sách công việc đóng gói
export const packagingTaskListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(packagingTaskSchema),
});

// Schema cho response khi lấy một công việc đóng gói cụ thể
export const packagingTaskDetailResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(packagingTaskSchema),
});

// Schema cho response khi cập nhật báo cáo công việc đóng gói
export const taskReportUpdateResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    planId: z.number(),
    packagingTypeId: z.number().nullable().optional(),
    taskName: z.string(),
    description: z.string(),
    packedQuantity: z.number(),
    resultContent: z.string().nullable().optional(),
    startDate: z.string(),
    endDate: z.string(),
    completeDate: z.string(),
    status: z.string(),
    createdAt: z.string(),
    createdBy: z.string(),
    updatedAt: z.string(),
    updatedBy: z.string(),
    plan: z.any().nullable(),
    packagingType: z.any().nullable(),
    packagingImages: z.any().nullable(),
    packagingItems: z.any().nullable(),
    packagingProducts: z.any().nullable(),
    farmerPackagingTasks: z.any().nullable(),
  }),
});

// Schema cho response khi upload hình ảnh
export const imageUploadResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.string()),
});

// Export types
export type PackagingImage = z.infer<typeof packagingImageSchema>;
export type PackagingItem = z.infer<typeof packagingItemSchema>;
export type FarmerInformation = z.infer<typeof farmerInformationSchema>;
export type PackagingTask = z.infer<typeof packagingTaskSchema>;
export type PackagingTaskListResponse = z.infer<
  typeof packagingTaskListResponseSchema
>;
export type PackagingTaskDetailResponse = z.infer<
  typeof packagingTaskDetailResponseSchema
>;
export type TaskReportUpdateResponse = z.infer<
  typeof taskReportUpdateResponseSchema
>;
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>;

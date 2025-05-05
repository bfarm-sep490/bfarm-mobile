import { z } from 'zod';

export const packagingImageSchema = z.object({
  id: z.number(),
  task_id: z.number(),
  url: z.string(),
});

export const packagingItemSchema = z.object({
  item_id: z.number(),
  task_id: z.number(),
  quantity: z.number(),
  unit: z.string(),
  item_name: z.string(),
});

export const farmerInformationSchema = z.object({
  farmer_id: z.number(),
  farmer_name: z.string(),
  status: z.string(),
});

export const packagingTaskSchema = z.object({
  id: z.number(),
  plan_id: z.number(),
  packaging_type_id: z.number().nullable().optional(),
  farmer_information: z.array(farmerInformationSchema),
  task_name: z.string(),
  order_id: z.number().nullable().optional(),
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
  total_packaged_weight: z.number().nullable().optional(),
  packaging_images: z.array(packagingImageSchema).optional(),
  packaging_items: z.array(packagingItemSchema).optional(),
});

export const packagingTaskListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(packagingTaskSchema),
});

export const packagingTaskDetailResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(packagingTaskSchema),
});

export const taskReportUpdateResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    plan_id: z.number(),
    packaging_type_id: z.number().nullable().optional(),
    task_name: z.string(),
    description: z.string(),
    packed_quantity: z.number(),
    result_content: z.string().nullable().optional(),
    start_date: z.string(),
    end_date: z.string(),
    complete_date: z.string(),
    status: z.string(),
    created_at: z.string(),
    created_by: z.string(),
    updated_at: z.string(),
    updated_by: z.string(),
    plan: z.any().nullable().optional(),
    packaging_type: z.any().nullable().optional(),
    packaging_images: z.any().nullable().optional(),
    packaging_items: z.any().nullable().optional(),
    packaging_products: z.any().nullable().optional(),
    farmer_information: z.any().nullable().optional(),
  }),
});

export const imageUploadResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.string()),
});

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

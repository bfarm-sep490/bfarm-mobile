import { z } from 'zod';

// Schema cho ảnh của công việc chăm sóc
export const careImageSchema = z.object({
  id: z.number(),
  task_id: z.number(),
  url: z.string(),
});

// Schema cho thuốc trừ sâu sử dụng trong công việc
export const carePesticideSchema = z.object({
  id: z.number(),
  pesticide_id: z.number(),
  pesticide_name: z.string(),
  task_id: z.number(),
  unit: z.string(),
  quantity: z.number(),
});

// Schema cho phân bón sử dụng trong công việc
export const careFertilizerSchema = z.object({
  id: z.number(),
  fertilizer_id: z.number(),
  fertilizer_name: z.string(),
  task_id: z.number(),
  unit: z.string(),
  quantity: z.number(),
});

// Schema cho các vật phẩm sử dụng trong công việc
export const careItemSchema = z.object({
  id: z.number(),
  item_id: z.number(),
  item_name: z.string(),
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

// Schema cho công việc chăm sóc
export const caringTaskSchema = z.object({
  id: z.number(),
  plan_id: z.number(),
  farmer_information: z.array(farmerInformationSchema),
  problem_id: z.number().nullable().optional(),
  task_name: z.string(),
  description: z.string(),
  result_content: z.string().nullable().optional(),
  task_type: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  complete_date: z.string().nullable().optional(),
  status: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
  care_images: z.array(careImageSchema).optional(),
  care_pesticides: z.array(carePesticideSchema).optional(),
  care_fertilizers: z.array(careFertilizerSchema).optional(),
  care_items: z.array(careItemSchema).optional(),
});

// Schema cho response khi lấy danh sách công việc
export const caringTaskListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(caringTaskSchema),
});

// Schema cho response khi lấy một công việc cụ thể
export const caringTaskDetailResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(caringTaskSchema),
});

// Schema cho response khi cập nhật báo cáo công việc
export const taskReportUpdateResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    planId: z.number(),
    problemId: z.number().nullable().optional(),
    taskName: z.string(),
    description: z.string(),
    taskType: z.string(),
    resultContent: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    completeDate: z.string(),
    status: z.string(),
    createdAt: z.string(),
    createdBy: z.string(),
    updatedAt: z.string(),
    updatedBy: z.string(),
    plan: z.any().nullable(),
    problem: z.any().nullable(),
    caringImages: z.any().nullable(),
    caringPesticides: z.any().nullable(),
    caringFertilizers: z.any().nullable(),
    caringItems: z.any().nullable(),
    farmerCaringTasks: z.any().nullable(),
  }),
});

// Schema cho response khi upload hình ảnh
export const imageUploadResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.string()),
});

// Export types
export type CareImage = z.infer<typeof careImageSchema>;
export type CarePesticide = z.infer<typeof carePesticideSchema>;
export type CareFertilizer = z.infer<typeof careFertilizerSchema>;
export type CareItem = z.infer<typeof careItemSchema>;
export type FarmerInformation = z.infer<typeof farmerInformationSchema>;
export type CaringTask = z.infer<typeof caringTaskSchema>;
export type CaringTaskListResponse = z.infer<
  typeof caringTaskListResponseSchema
>;
export type CaringTaskDetailResponse = z.infer<
  typeof caringTaskDetailResponseSchema
>;
export type TaskReportUpdateResponse = z.infer<
  typeof taskReportUpdateResponseSchema
>;
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>;

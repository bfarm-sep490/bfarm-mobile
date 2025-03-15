import { z } from 'zod';

export const careImageSchema = z.object({
  id: z.number(),
  task_id: z.number(),
  url: z.string(),
});

export const carePesticideSchema = z.object({
  id: z.number(),
  pesticide_id: z.number(),
  task_id: z.number(),
  unit: z.string(),
  quantity: z.number(),
});

export const careFertilizerSchema = z.object({
  id: z.number(),
  fertilizer_id: z.number(),
  task_id: z.number(),
  unit: z.string(),
  quantity: z.number(),
});

export const careItemSchema = z.object({
  id: z.number(),
  item_id: z.number(),
  task_id: z.number(),
  quantity: z.number(),
  unit: z.string(),
});

export const caringTaskSchema = z.object({
  id: z.number(),
  plan_id: z.number(),
  farmer_id: z.number(),
  farmer_name: z.string(),
  problem_id: z.number().optional().nullable(),
  task_name: z.string(),
  result_content: z.string().optional().nullable(),
  task_type: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  complete_date: z.string().optional().nullable(),
  is_completed: z.boolean(),
  is_available: z.boolean(),
  priority: z.number(),
  status: z.string(),
  create_at: z.string(),
  update_at: z.string().optional().nullable(),
  care_images: z.array(careImageSchema),
  care_pesticides: z.array(carePesticideSchema),
  care_fertilizers: z.array(careFertilizerSchema),
  care_items: z.array(careItemSchema),
});

export const caringTaskResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(caringTaskSchema),
});

export type CareImage = z.infer<typeof careImageSchema>;
export type CarePesticide = z.infer<typeof carePesticideSchema>;
export type CareFertilizer = z.infer<typeof careFertilizerSchema>;
export type CareItem = z.infer<typeof careItemSchema>;
export type CaringTask = z.infer<typeof caringTaskSchema>;
export type CaringTaskResponse = z.infer<typeof caringTaskResponseSchema>;

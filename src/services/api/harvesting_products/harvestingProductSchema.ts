import { z } from 'zod';

// Schema cho công việc thu hoạch
export const harvestingProductSchema = z.object({
  harvesting_task_id: z.number(),
  plan_id: z.number(),
  plan_name: z.string(),
  plant_id: z.number(),
  plant_name: z.string(),
  harvesting_date: z.string().nullable().optional(),
  expired_date: z.string().nullable().optional(),
  harvesting_quantity: z.number(),
  harvesting_unit: z.string(),
  available_harvesting_quantity: z.number(),
  status: z.string(),
  evaluated_result: z.string(),
});

export const harvestingProductListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(harvestingProductSchema),
});
export type HarvestingTask = z.infer<typeof harvestingProductSchema>;
export type HarvestingTaskListResponse = z.infer<
  typeof harvestingProductSchema
>;

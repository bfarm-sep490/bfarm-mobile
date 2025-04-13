import { z } from 'zod';

export const planSchema = z.object({
  id: z.number(),
  plant_id: z.number(),
  plant_name: z.string().nullable(),
  yield_id: z.number(),
  yield_name: z.string().nullable(),
  expert_id: z.number(),
  expert_name: z.string().nullable(),
  plan_name: z.string(),
  is_active_in_plan: z.boolean(),
  description: z.string().nullable(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.enum([
    'Pending',
    'Ongoing',
    'Complete',
    'Incomplete',
    'Cancel',
    'Draft',
  ]),
  estimated_product: z.number(),
  created_at: z.string(),
  created_by: z.string().nullable(),
  updated_at: z.string().nullable(),
  updated_by: z.string().nullable(),
  is_approved: z.boolean(),
});

export const planResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(planSchema),
});

export const singlePlanResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: planSchema,
});

export type Plan = z.infer<typeof planSchema>;
export type PlanResponse = z.infer<typeof planResponseSchema>;
export type SinglePlanResponse = z.infer<typeof singlePlanResponseSchema>;

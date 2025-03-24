import { z } from 'zod';

export const problemSchema = z.object({
  id: z.number(),
  problem_name: z.string(),
  description: z.string(),
  status: z.string(),
  created_date: z.string(),
  plan_id: z.number(),
  result_content: z.string().nullable().optional(),
  farmer_id: z.number().nullable().optional(),
  farmer_name: z.string().nullable().optional(),
  problem_images: z
    .array(
      z.object({
        image_id: z.number().optional(),
        url: z.string().optional(),
      }),
    )
    .nullable()
    .optional(),
});

export const planWithFarmerId = z.object({
  id: z.number(),
  plan_name: z.string(),
});
export const plansWithFarmerIdResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(planWithFarmerId),
});
export const problemsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(problemSchema),
});
export const problemDetailResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object(problemSchema.shape),
});
export const imageUploadResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.string()),
});
export type Problem = z.infer<typeof problemSchema>;
export type PlanWithFarmerId = z.infer<typeof planWithFarmerId>;
export type PlansWithFarmerIdResponse = z.infer<
  typeof plansWithFarmerIdResponseSchema
>;
export type ProblemsResponse = z.infer<typeof problemsResponseSchema>;
export type ProblemDetailResponse = z.infer<typeof problemDetailResponseSchema>;
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>;

import { z } from 'zod';

// Schema cho công việc thu hoạch
export const packagingTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity_per_pack: z.number(),
  price_per_pack: z.number(),
  status: z.string(),
});

export const packagingTypeListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(packagingTypeSchema),
});
export type PackagingType = z.infer<typeof packagingTypeSchema>;
export type PackagingTypeListResponse = z.infer<
  typeof packagingTypeListResponseSchema
>;

import { z } from 'zod';

const specializationSchema = z.object({
  special_id: z.number(),
  name: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
  avatar_image: z.string().url(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  is_active: z.boolean(),
  list_farmer_specializations: z.array(specializationSchema),
  'complete-tasks': z.number(),
  'incomplete-tasks': z.number(),
  'performance-score': z.number(),
});

export const updateUserSchema = z.object({
  name: z.string(),
  phone: z.string(),
  avatar_url: z.string().url(),
});

export type User = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

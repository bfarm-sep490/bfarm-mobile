import { z } from 'zod';

export const notifcationSchema = z.object({
  id: z.number(),
  title: z.string(),
  message: z.string().optional().nullable(),
  created_date: z.string(),
  is_read: z.boolean(),
  image: z.string().optional().nullable(),
});
export const notifcationResponseSchema = z.object({
  data: z.array(notifcationSchema).optional().nullable(),
  message: z.string(),
  status: z.number(),
});

export type Notification = z.infer<typeof notifcationSchema>;
export type NotificationResponse = z.infer<typeof notifcationResponseSchema>;

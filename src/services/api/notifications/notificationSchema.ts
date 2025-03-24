import { z } from 'zod';

export const notifcationSchema = z.object({
  id: z.number(),
  title: z.string(),
  message: z.string(),
  created_date: z.string(),
  image: z.string(),
});
export const notifcationResponseSchema = z.object({
  data: z.array(notifcationSchema).optional().nullable(),
  message: z.string(),
  status: z.number(),
});

export type Notification = z.infer<typeof notifcationSchema>;
export type NotificationResponse = z.infer<typeof notifcationResponseSchema>;

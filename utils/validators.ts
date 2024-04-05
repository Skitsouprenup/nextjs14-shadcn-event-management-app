import { z } from "zod"

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(450, 'Description must be less than 450 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(350, 'Location must be less than 350 characters'),
  imageUrl: z.string().url(),
  startDate: z.date().min(new Date(Date.now()), { message: 'Date must be higher than current date'}),
  endDate: z.date().min(new Date(Date.now()), { message: 'Date must be higher than current date'}),
  category: z.string(),
  price: z.string(),
  freeEvent: z.boolean().default(false),
  url: z.string().url()
}).refine(data => data.startDate.getTime() >= data.endDate.getTime(), {
  message: "Start Date must be less than End Date",
  path: ['startDate'] // Pointing out which field is invalid
});
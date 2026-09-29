import { z } from "zod";
import { dateOfBirthSchema } from '@/lib/dateOfBirth';

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  phone: z.string().trim().refine(value => !value || /^\+?[0-9 ()-]{10,20}$/.test(value), "Please enter a valid phone number"),

  address: z.string().trim().refine(value => !value || value.length >= 3, "Please enter a valid address"),

  lga: z.string().trim().refine(value => !value || value.length >= 2, "Please enter a valid LGA"),

  dateOfBirth: z.union([z.literal(""), dateOfBirthSchema]),

  profilePicture: z.string().optional(),
});

import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  phone: z.string().trim().min(10, "Please enter a valid phone number"),

  address: z.string().trim().min(3, "Please enter a valid address"),

  lga: z.string().trim().min(2, "Please enter a valid LGA"),

  dateOfBirth: z.string().min(1, "Date of birth is required"),

  profilePicture: z.string().optional(),
});

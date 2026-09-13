import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),

  email: z.string().email("Please enter a valid email address"),

  subject: z.string().min(3, "Please enter a subject"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

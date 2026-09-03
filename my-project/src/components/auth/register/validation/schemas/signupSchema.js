import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().min(4, "Full name must be at least 4 characters"),

    email: z.string().email("Please enter a valid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Please confirm your password"),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the Terms & Conditions and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

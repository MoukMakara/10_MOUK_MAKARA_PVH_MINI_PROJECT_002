import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s]*$/, "Full name can only contain letters and spaces"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),
  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      return age >= 13;
    }, "You must be at least 13 years old"),
});

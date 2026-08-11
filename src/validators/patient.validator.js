import { z } from "zod";

const patientZodSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  age: z
    .number()
    .min(0, "Age cannot be negative")
    .max(120, "Age cannot exceed 120"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(5, "Address is required"),
  phoneNumber: z
    .string()
    .regex(
      /^03\d{9}$/,
      "Phone number must be a valid Pakistani number (e.g. 03001234567)",
    ),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .default("B+"),
});

const patientPartialZodSchema = patientZodSchema.partial().extend({
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
});

export { patientZodSchema, patientPartialZodSchema };

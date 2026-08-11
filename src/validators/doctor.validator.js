import { z } from "zod";

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Time must be in HH:mm 24hr format (e.g. 14:30)",
  );

const availabilitySlotSchema = z
  .object({
    day: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

const doctorZodSchema = z.object({
  name: z.string(),
  specialization: z.string(),
  experience: z
    .number()
    .min(0, "experience cannot be negative")
    .max(80, "experience should be valid (max: 80 years)"),
  phoneNumber: z
    .string()
    .regex(
      /^03\d{9}$/,
      "Phone number must be a valid Pakistani number (e.g. 03001234567)",
    ),
  email: z.string().email(),
  availability: z.array(availabilitySlotSchema).optional()
});

const doctorPartialZodSchema = doctorZodSchema.partial();

export { doctorZodSchema, doctorPartialZodSchema, availabilitySlotSchema };

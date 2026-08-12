import { z } from "zod";

const appointmentZodSchema = z.object({
  patientNumber: z.number(),
  doctorNumber: z.number(),
  date: z.coerce.date(),
  time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Time must be in HH:mm 24hr format (e.g. 14:30)",
    ),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
});

export { appointmentZodSchema };

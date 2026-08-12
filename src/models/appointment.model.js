import mongoose, { Schema } from "mongoose";
import { Counter } from "./counter.model.js";

const appointmentSchema = new Schema(
  {
    appointmentNumber: {
      type: Number,
      unique: true,
    },
    patientNumber: {
      type: Number,
      required: true,
    },
    doctorNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

appointmentSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "appointmentNumber" },
      { $inc: { val: 1 } },
      { new: true, upsert: true },
    );
    this.appointmentNumber = counter.val;
  }
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);

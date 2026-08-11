import mongoose, { Schema } from "mongoose";
import { Counter } from "./counter.model.js";

const doctorSchema = new Schema(
  {
    doctorNumber: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

doctorSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "doctorNumber" },
      { $inc: { val: 1 } },
      { new: true, upsert: true },
    );
    this.doctorNumber = counter.val;
  }
});

export const Doctor = mongoose.model("Doctor", doctorSchema);

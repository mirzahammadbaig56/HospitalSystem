import mongoose, { Schema } from "mongoose";
import { Counter } from "./counter.model.js";

const patientSchema = new Schema(
  {
    patientNumber: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
  },
  { timestamps: true },
);

patientSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "patientNumber" },
      { $inc: { val: 1 } },
      { new: true, upsert: true },
    );
    this.patientNumber = counter.val;
  }
});

export const Patient = mongoose.model("Patient", patientSchema);

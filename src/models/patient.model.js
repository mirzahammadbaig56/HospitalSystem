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
      minlength: 3,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
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
      match: [
        /^03\d{9}$/,
        "Phone number must be a valid Pakistani number (e.g. 03001234567)",
      ],
    },
    bloodGroup: {
      type: String,
      default: "B+",
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
  },
  { timestamps: true },
);

patientSchema.pre("save", async function () {
  if (!this.isNew) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "patientNumber" },
    { $inc: { val: 1 } },
    {
      new: true,
      upsert: true,
    },
  );

  this.patientNumber = counter.val;
});

export const Patient = mongoose.model("Patient", patientSchema);

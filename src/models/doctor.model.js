import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  }
}, { timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema);
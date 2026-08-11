import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  val: {
    type: Number,
    required: true,
    default: 0
  }
})

export const Counter = mongoose.model("Counter", counterSchema);
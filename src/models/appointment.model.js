import mongoose, {Schema} from "mongoose";

const appointmentSchema = new Schema({
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
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
  }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema); 
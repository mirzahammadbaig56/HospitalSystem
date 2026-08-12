import { Appointment } from "../models/appointment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { appointmentZodSchema } from "../validators/appointment.validator.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";

const createAppointment = asyncHandler(async (req, res, next) => {
  const result = appointmentZodSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const patient = await Patient.findOne({
    patientNumber: result.data.patientNumber,
  });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  const doctor = await Doctor.findOne({
    doctorNumber: result.data.doctorNumber,
  });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const requestedDay = days[result.data.date.getDay()];
  const isAvailable = doctor.availability.some((slot) => {
    return (
      slot.day === requestedDay &&
      slot.startTime <= result.data.time &&
      slot.endTime > result.data.time
    );
  });
  if (!isAvailable) {
    throw new ApiError(400, "Doctor is not available at this day/time");
  }
  const conflict = await Appointment.findOne({
    doctorNumber: doctor.doctorNumber,
    date: result.data.date,
    time: result.data.time,
    status: "scheduled",
  });
  if (conflict) {
    throw new ApiError(409, "This slot is already booked");
  }
  const appointment = await Appointment.create(result.data);
  const response = {
    patientName: patient.name,
    doctorName: doctor.name,
    ...appointment.toObject(),
  };
  res
    .status(201)
    .json(new ApiResponse(201, "Appointment scheduled successfully", response));
});

const getAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find();
  const enrichedAppointments = await Promise.all(
    appointments.map(async (appointment) => {
      const patient = await Patient.findOne({
        patientNumber: appointment.patientNumber,
      })
      const doctor = await Doctor.findOne({
        doctorNumber: appointment.doctorNumber,
      });
      return {
        patientName: patient? patient.name: "Unknown",
        doctorName: doctor? doctor.name: "Unknown",
        ...appointment.toObject(),
      };
    })
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, "Appointments retrieved successfully", enrichedAppointments),
    );
});

const getAppointmentByAN = asyncHandler(async (req, res, next) => {
  const { appointmentNumber } = req.params;
  const appointment = await Appointment.findOne({ appointmentNumber });
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }
  const patient = await Patient.findOne({
    patientNumber: appointment.patientNumber,
  });
  const doctor = await Doctor.findOne({
    doctorNumber: appointment.doctorNumber,
  });
  const response = {
    patientName: patient ? patient.name : "Unknown",
    doctorName: doctor ? doctor.name : "Unknown",
    ...appointment.toObject(),
  };
  res
    .status(200)
    .json(new ApiResponse(200, "Appointment retrieved successfully", response));
});

const deleteAppointment = asyncHandler(async (req, res, next) => {
  const {appointmentNumber} = req.params;
  const deleted = await Appointment.findOneAndDelete({appointmentNumber});
  if(!deleted){
    throw new ApiError(404, "Appointment not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Appointment deleted successfully", deleted));
})

export { createAppointment, getAppointments, deleteAppointment, getAppointmentByAN };

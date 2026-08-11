import asyncHandler from "../utils/asyncHandler.js";
import { Doctor } from "../models/doctor.model.js";
import {
  doctorZodSchema,
  doctorPartialZodSchema,
  availabilitySlotSchema,
} from "../validators/doctor.validator.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const getDoctors = asyncHandler(async (req, res, next) => {
  const doctors = await Doctor.find();
  res
    .status(200)
    .json(new ApiResponse(200, "Doctors retrieved successfully", doctors));
});

const createDoctor = asyncHandler(async (req, res, next) => {
  const result = doctorZodSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const doctor = await Doctor.create(result.data);
  res
    .status(201)
    .json(new ApiResponse(201, "Doctor created successfully", doctor));
});

const getDoctorByDN = asyncHandler(async (req, res, next) => {
  const { doctorNumber } = req.params;
  const doctor = await Doctor.findOne({ doctorNumber }).select("-availability");
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Doctor retrieved successfully", doctor));
});

const replaceDoctor = asyncHandler(async (req, res, next) => {
  const { doctorNumber } = req.params;
  const result = doctorZodSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const replacedDoctor = await Doctor.findOneAndReplace(
    { doctorNumber },
    result.data,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!replacedDoctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Doctor replaced successfully", replacedDoctor));
});

const updateDoctor = asyncHandler(async (req, res, next) => {
  const { doctorNumber } = req.params;
  const result = doctorPartialZodSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const updatedDoctor = await Doctor.findOneAndUpdate(
    { doctorNumber },
    result.data,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedDoctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Doctor updated successfully", updatedDoctor));
});

const deleteDoctor = asyncHandler(async (req, res, next) => {
  const { doctorNumber } = req.params;
  const deletedDoctor = await Doctor.findOneAndDelete({ doctorNumber });
  if (!deletedDoctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Doctor deleted successfully", deletedDoctor));
});

const getAvailability = asyncHandler(async (req, res, next) => {
  const { doctorNumber } = req.params;
  const doctor = await Doctor.findOne({ doctorNumber }).select("availability");
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Availability retrieved successfully", doctor));
});

const postAvailability = asyncHandler(async (req, res, next) => {
  const { doctorNumber } = req.params;
  const result = availabilitySlotSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const doctor = await Doctor.findOne({ doctorNumber });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }
  const { day, startTime, endTime } = result.data;
  const hasOverlap = doctor.availability.some(
    (slot) =>
      slot.day === day && slot.startTime < endTime && startTime < slot.endTime,
  );
  if (hasOverlap) {
    throw new ApiError(409, "This slot overlaps with an existing availability");
  }
  doctor.availability.push(result.data);
  await doctor.save();
  res
    .status(200)
    .json(new ApiResponse(200, "Availability added successfully", doctor));
});

export {
  getDoctors,
  createDoctor,
  getDoctorByDN,
  replaceDoctor,
  updateDoctor,
  deleteDoctor,
  getAvailability,
  postAvailability,
};

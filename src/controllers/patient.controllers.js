import { Patient } from "../models/patient.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  patientZodSchema,
  patientPartialZodSchema,
} from "../validators/patient.validator.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

const getPatients = asyncHandler(async (req, res, next) => {
  const patients = await Patient.find();
  res
    .status(200)
    .json(new ApiResponse(200, "Patients retrieved successfully", patients));
});

const createPatient = asyncHandler(async (req, res, next) => {
  const result = patientZodSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const newPatient = await Patient.create(result.data);
  res
    .status(201)
    .json(new ApiResponse(201, "Patient created successfully", newPatient));
});

const getPatientByPN = asyncHandler(async (req, res, next) => {
  const { patientNumber } = req.params;
  const patient = await Patient.findOne({ patientNumber });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Patient retrieved successfully", patient));
});

const replacePatient = asyncHandler(async (req, res, next) => {
  const { patientNumber } = req.params;
  const result = patientZodSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const updatedPatient = await Patient.findOneAndReplace(
    { patientNumber },
    result.data,
    { new: true, runValidators: true },
  );
  if (!updatedPatient) {
    throw new ApiError(404, "Patient not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Patient replaced successfully", updatedPatient));
});

const updatePatient = asyncHandler(async (req, res, next) => {
  const result = patientPartialZodSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation failed", errors);
  }
  const { patientNumber } = req.params;
  const updatedPatient = await Patient.findOneAndUpdate(
    { patientNumber },
    result.data,
    { new: true, runValidators: true },
  );
  if (!updatedPatient) {
    throw new ApiError(404, "Patient not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Patient updated successfully", updatedPatient));
});

const deletePatient = asyncHandler(async (req, res, next) => {
  const { patientNumber } = req.params;
  const deletedPatient = await Patient.findOneAndDelete({ patientNumber });
  if (!deletedPatient) {
    throw new ApiError(404, "Patient not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Patient deleted successfully", deletedPatient));
});

export {
  getPatients,
  createPatient,
  getPatientByPN,
  replacePatient,
  updatePatient,
  deletePatient,
};

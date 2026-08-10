import { Patient } from "../models/patient.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const getPatients = asyncHandler(async (req, res, next) => {
  const patients = await Patient.find();
  res.status(200).json(patients);
})

const createPatient = asyncHandler(async (req, res, next) => {
  const newPatient = await Patient.create(req.body);
  res.status(201).json(newPatient);
})

export { getPatients, createPatient };
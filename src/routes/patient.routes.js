import { Router } from "express";
import { getPatients, createPatient, getPatientByPN, replacePatient, updatePatient, deletePatient } from "../controllers/patient.controllers.js";

const router = Router();

router.route("/").get(getPatients).post(createPatient);
router.route("/:patientNumber").get(getPatientByPN).put(replacePatient).patch(updatePatient).delete(deletePatient);
export default router;
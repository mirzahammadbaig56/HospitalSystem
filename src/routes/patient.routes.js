import { Router } from "express";
import { getPatients, createPatient } from "../controllers/patient.controllers.js";

const router = Router();

router.route("/").get(getPatients).post(createPatient);

export default router;
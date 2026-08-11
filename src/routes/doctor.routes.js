import { Router } from "express";
import {
  getDoctors,
  createDoctor,
  getDoctorByDN,
  replaceDoctor,
  updateDoctor,
  deleteDoctor,
  getAvailability,
  postAvailability,
} from "../controllers/doctor.controllers.js";

const router = Router();

router.route("/").get(getDoctors).post(createDoctor);
router
  .route("/:doctorNumber")
  .get(getDoctorByDN)
  .put(replaceDoctor)
  .patch(updateDoctor)
  .delete(deleteDoctor);
router
  .route("/:doctorNumber/availability")
  .get(getAvailability)
  .post(postAvailability);

export default router;

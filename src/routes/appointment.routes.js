import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  deleteAppointment,
  getAppointmentByAN
} from '../controllers/appointment.controllers.js';

const router = Router();

router.route('/').get(getAppointments).post(createAppointment);
router.route('/:appointmentNumber').get(getAppointmentByAN).delete(deleteAppointment);

export default router;
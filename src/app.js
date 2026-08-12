import express from 'express';
import patientRouter from './routes/patient.routes.js'
import doctorRouter from './routes/doctor.routes.js';
import appointmentRouter from './routes/appointment.routes.js'
import ApiResponse from './utils/apiResponse.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json(new ApiResponse(200, "HospitalSystem API is running"));
});
app.use('/api/patients', patientRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});

export default app;
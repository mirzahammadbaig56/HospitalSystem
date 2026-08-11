import express from 'express';
import patientRouter from './routes/patient.routes.js'
import doctorRouter from './routes/doctor.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/patients', patientRouter);
app.use('/api/doctors', doctorRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});

export default app;
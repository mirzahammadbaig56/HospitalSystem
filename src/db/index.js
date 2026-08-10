import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = `${process.env.MONGODB_URI}/HospitalSystem`;
    const connectionInstance = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    throw new Error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection error:', error);
  }
};
module.exports = connectDB;

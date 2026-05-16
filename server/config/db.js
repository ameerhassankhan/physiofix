const mongoose = require("mongoose");

let isConnected = false;
//mongoose.connect('mongodb://localhost:27017/physiofix')
const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// const { transporter, mailOptions } = require("./services/emailService");
const connectDB = require("./config/db");

const configRoutes = require("./routes/configRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/config", configRoutes);
app.use("/api/bookings", bookingRoutes);

// Test Email Route
// app.get("/send", async (req, res) => {
//   try {
//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email sent:", info.response);

//     res.status(200).json({
//       success: true,
//       message: "Email sent successfully",
//       response: info.response,
//     });
//   } catch (error) {
//     console.error("Email Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to send email",
//       error: error.message,
//     });
//   }
// });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  const isDevelopment = process.env.NODE_ENV === "development";
  const status = err.status || 500;
  const message = isDevelopment ? err.message : "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(isDevelopment && { error: err.message, stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

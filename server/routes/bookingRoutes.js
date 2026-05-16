const express = require("express");
const {
  getBookings,
  createBooking,
} = require("../controllers/bookingController");
const {
  sendApprovalEmail,
  sendRejectionEmail,
} = require("../services/emailService");
const Booking = require("../models/Booking");

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);

// Update booking with email on status change and prevent editing after approval/rejection
router.put("/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const changes = req.body;

    // Check if booking exists and get current status
    const currentBooking = await Booking.findById(bookingId);
    if (!currentBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Prevent editing if already approved or rejected
    if (currentBooking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot edit booking that is already ${currentBooking.status}`,
      });
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, changes, {
      new: true,
    });

    // Send email based on new status
    if (changes.status === "approved") {
      sendApprovalEmail(updatedBooking.email, updatedBooking);
    } else if (changes.status === "rejected") {
      sendRejectionEmail(updatedBooking.email, updatedBooking);
    }

    return res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Backend Error updating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

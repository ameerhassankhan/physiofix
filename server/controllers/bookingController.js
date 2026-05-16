const Booking = require("../models/Booking");

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { name, phone, email, note, date, slot, type } = req.body;

    const bookingDate = date ? new Date(date) : null;

    if (!bookingDate || Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({ error: "Invalid booking date" });
    }

    const booking = await Booking.create({
      name,
      phone,
      email,
      note,
      date: bookingDate,
      slot,
      type,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.date) {
      const bookingDate = new Date(updates.date);
      if (Number.isNaN(bookingDate.getTime())) {
        return res.status(400).json({ error: "Invalid booking date" });
      }
      updates.date = bookingDate;
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBooking,
};

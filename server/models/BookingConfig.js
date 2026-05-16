const mongoose = require("mongoose");

const bookingConfigSchema = new mongoose.Schema(
  {
    hidePastDates: {
      type: Boolean,
      default: true,
    },
    minDate: {
      type: String,
      required: true,
    },
    maxDate: {
      type: String,
      required: true,
    },
    offDays: {
      type: [Number],
      default: [],
    },
    offDates: {
      type: [String],
      default: [],
    },
    slotDuration: {
      type: Number,
      default: 15,
    },
    bookingTypes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("BookingConfig", bookingConfigSchema);

const BookingConfig = require("../models/BookingConfig");
const defaultBookingConfig = require("../config/defaultBookingConfig");

const getConfig = async (req, res, next) => {
  try {
    let config = await BookingConfig.findOne();

    if (!config) {
      config = await BookingConfig.create(defaultBookingConfig);
    }

    res.json(config);
  } catch (error) {
    next(error);
  }
};

const saveConfig = async (req, res, next) => {
  try {
    const existing = await BookingConfig.findOne();
    const payload = {
      hidePastDates:
        req.body.hidePastDates ??
        existing?.hidePastDates ??
        defaultBookingConfig.hidePastDates,
      minDate:
        req.body.minDate ?? existing?.minDate ?? defaultBookingConfig.minDate,
      maxDate:
        req.body.maxDate ?? existing?.maxDate ?? defaultBookingConfig.maxDate,
      offDays:
        req.body.offDays ?? existing?.offDays ?? defaultBookingConfig.offDays,
      offDates:
        req.body.offDates ??
        existing?.offDates ??
        defaultBookingConfig.offDates,
      slotDuration:
        req.body.slotDuration ??
        existing?.slotDuration ??
        defaultBookingConfig.slotDuration,
      bookingTypes:
        req.body.scheduleConfig ??
        existing?.bookingTypes ??
        defaultBookingConfig.bookingTypes,
    };

    const config = await BookingConfig.findOneAndUpdate({}, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    res.json(config);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfig,
  saveConfig,
};

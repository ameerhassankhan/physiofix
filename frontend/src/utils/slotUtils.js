// =========================================
// utils/slotUtils.js
// =========================================

import dayjs from "dayjs";

import { bookingConfig } from "../config/bookingConfig";

// =========================================
// GENERATE TIME SLOTS
// =========================================

export const generateSlots = (start, end, duration) => {
  const slots = [];

  let current = dayjs(`2026-01-01 ${start}`);
  const finish = dayjs(`2026-01-01 ${end}`);

  while (current.isBefore(finish)) {
    slots.push(current.format("HH:mm"));
    current = current.add(duration, "minute");
  }

  return slots;
};

export const formatSlot = (slot) => {
  return dayjs(`2026-01-01 ${slot}`).format("hh:mm A");
};

// =========================================
// GET SLOTS
// =========================================

export const getSlots = (
  date,
  bookingType = "online",
  scheduleConfig,
  slotDuration = 15,
  globalConfig = bookingConfig,
) => {
  const formattedDate = date.format("YYYY-MM-DD");

  if (globalConfig.offDates.includes(formattedDate)) {
    return [];
  }

  const day = date.day();

  if (globalConfig.offDays.includes(day)) {
    return [];
  }

  const schedule =
    scheduleConfig?.[bookingType]?.weeklySchedule ||
    bookingConfig.bookingTypes[bookingType]?.weeklySchedule;

  const dayConfig = schedule?.[day];

  if (!dayConfig?.enabled) {
    return [];
  }

  return generateSlots(dayConfig.start, dayConfig.end, slotDuration);
};

// =========================================
// DISABLE DATE
// =========================================

export const shouldDisableDate = (date, globalConfig = bookingConfig) => {
  const formattedDate = date.format("YYYY-MM-DD");

  if (globalConfig.hidePastDates && date.isBefore(dayjs(), "day")) {
    return true;
  }

  if (date.isBefore(globalConfig.minDate, "day")) {
    return true;
  }

  if (date.isAfter(globalConfig.maxDate, "day")) {
    return true;
  }

  if (globalConfig.offDays.includes(date.day())) {
    return true;
  }

  if (globalConfig.offDates.includes(formattedDate)) {
    return true;
  }

  return false;
};

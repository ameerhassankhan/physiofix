// =========================================
// config/bookingConfig.js
// =========================================

import dayjs from "dayjs";

export const bookingConfig = {
  // =========================================
  // DATE SETTINGS
  // =========================================

  hidePastDates: true,

  minDate: dayjs("2026-05-01"),

  maxDate: dayjs("2026-12-31"),

  // =========================================
  // OFF DAYS
  // =========================================

  // 0 Sunday
  // 5 Friday

  offDays: [],

  // =========================================
  // CUSTOM OFF DATES
  // =========================================

  offDates: [],

  // =========================================
  // SLOT SETTINGS
  // =========================================

  slotDuration: 15,

  // =========================================
  // BOOKING TYPE SCHEDULES
  // =========================================

  bookingTypes: {
    online: {
      label: "Online",
      weeklySchedule: {
        0: {
          enabled: true,
          start: "09:00",
          end: "13:00",
        },

        1: {
          enabled: true,
          start: "09:00",
          end: "17:00",
        },

        2: {
          enabled: true,
          start: "10:00",
          end: "15:00",
        },

        3: {
          enabled: true,
          start: "12:00",
          end: "18:00",
        },

        4: {
          enabled: true,
          start: "09:00",
          end: "16:00",
        },

        5: {
          enabled: false,
        },

        6: {
          enabled: true,
          start: "08:00",
          end: "12:00",
        },
      },
    },

    offline: {
      label: "Offline",
      weeklySchedule: {
        0: {
          enabled: false,
        },

        1: {
          enabled: true,
          start: "10:00",
          end: "14:00",
        },

        2: {
          enabled: true,
          start: "12:00",
          end: "16:00",
        },

        3: {
          enabled: true,
          start: "14:00",
          end: "18:00",
        },

        4: {
          enabled: true,
          start: "09:00",
          end: "13:00",
        },

        5: {
          enabled: false,
        },

        6: {
          enabled: true,
          start: "10:00",
          end: "13:00",
        },
      },
    },
  },
};

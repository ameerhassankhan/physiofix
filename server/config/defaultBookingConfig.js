const defaultBookingConfig = {
  hidePastDates: true,
  minDate: "2026-05-01",
  maxDate: "2026-12-31",
  offDays: [],
  offDates: [],
  slotDuration: 15,
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
          enabled: true,
          start: "09:00",
          end: "16:00",
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
          enabled: true,
          start: "09:00",
          end: "16:00",
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

module.exports = defaultBookingConfig;

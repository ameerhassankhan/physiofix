import React, { createContext, useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { bookingConfig } from "../config/bookingConfig";
import {
  fetchConfig,
  saveConfig,
  fetchBookings,
  createBooking as apiCreateBooking,
  updateBooking as apiUpdateBooking,
} from "../services/api";
import Toast from "../components/Toast";

const BookingContext = createContext();

const normalizeBooking = (booking) => ({
  ...booking,
  id: booking.id || booking._id,
  date: booking.date ? dayjs(booking.date) : dayjs(),
});

export const BookingProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingType, setBookingType] = useState("online");
  const [scheduleConfig, setScheduleConfig] = useState(
    bookingConfig.bookingTypes,
  );
  const [draftScheduleConfig, setDraftScheduleConfig] = useState(
    bookingConfig.bookingTypes,
  );
  const [globalConfig, setGlobalConfig] = useState({
    hidePastDates: bookingConfig.hidePastDates,
    minDate: bookingConfig.minDate,
    maxDate: bookingConfig.maxDate,
    offDays: bookingConfig.offDays,
    offDates: bookingConfig.offDates,
  });
  const [slotDuration, setSlotDuration] = useState(bookingConfig.slotDuration);
  const [bookings, setBookings] = useState([]);
  const [latestBooking, setLatestBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const configResponse = await fetchConfig();
        const configData = configResponse.data;

        setScheduleConfig(configData.bookingTypes);
        setDraftScheduleConfig(configData.bookingTypes);
        setSlotDuration(configData.slotDuration);
        setGlobalConfig({
          hidePastDates: configData.hidePastDates,
          minDate: configData.minDate,
          maxDate: configData.maxDate,
          offDays: configData.offDays,
          offDates: configData.offDates,
        });

        const bookingsResponse = await fetchBookings();
        setBookings(
          bookingsResponse.data.map((booking) => normalizeBooking(booking)),
        );
      } catch (error) {
        console.error("Unable to load booking data:", error);
        showToast("Could not load server data. Please refresh.", "danger");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const updateSchedule = (type, day, changes) => {
    setDraftScheduleConfig((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        weeklySchedule: {
          ...prev[type].weeklySchedule,
          [day]: {
            ...prev[type].weeklySchedule[day],
            ...changes,
          },
        },
      },
    }));
  };

  const showToast = (message, variant = "success", title = "") => {
    setToast({
      id: Date.now(),
      message,
      variant,
      title,
    });
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const saveScheduleConfig = async () => {
    try {
      const payload = {
        scheduleConfig: draftScheduleConfig,
        slotDuration,
        ...globalConfig,
      };

      const response = await saveConfig(payload);
      const saved = response.data;

      setScheduleConfig(saved.bookingTypes);
      setDraftScheduleConfig(saved.bookingTypes);
      setSlotDuration(saved.slotDuration);
      setGlobalConfig({
        hidePastDates: saved.hidePastDates,
        minDate: saved.minDate,
        maxDate: saved.maxDate,
        offDays: saved.offDays,
        offDates: saved.offDates,
      });
      showToast("Schedule saved successfully.", "success", "Saved");
    } catch (error) {
      console.error("Failed to save schedule config:", error);
      showToast("Unable to save schedule. Try again.", "danger", "Save failed");
      throw error;
    }
  };

  const updateBooking = async (id, changes) => {
    try {
      const normalizedChanges = { ...changes };

      if (normalizedChanges.date) {
        normalizedChanges.date = dayjs(normalizedChanges.date).toISOString();
      }

      const response = await apiUpdateBooking(id, normalizedChanges);
      const updatedBooking = normalizeBooking(response.data);

      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? updatedBooking : booking)),
      );

      return updatedBooking;
    } catch (error) {
      console.error("Booking update failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Could not update booking. Please try again.";
      showToast(errorMessage, "danger", "Update failed");
      throw error;
    }
  };

  const approveBooking = async (id) => {
    await updateBooking(id, { status: "approved" });
    showToast(
      "Booking approved and confirmation email sent.",
      "success",
      "Approved",
    );
  };

  const rejectBooking = async (id) => {
    await updateBooking(id, { status: "rejected" });
    showToast(
      "Booking rejected and notification email sent.",
      "danger",
      "Rejected",
    );
  };

  const addBooking = async (bookingData) => {
    try {
      const response = await apiCreateBooking({
        ...bookingData,
        date: bookingData.date.toISOString(),
      });

      const booking = normalizeBooking(response.data);
      setBookings((prev) => [...prev, booking]);
      setLatestBooking(booking);
      showToast("Booking request sent successfully.", "success", "Booked");
      return booking;
    } catch (error) {
      console.error("Failed to create booking:", error);
      showToast(
        "Unable to create booking. Please try again.",
        "danger",
        "Booking failed",
      );
      throw error;
    }
  };

  const rescheduleBooking = async (id, newDate, newSlot) => {
    await updateBooking(id, {
      date: dayjs(newDate).toISOString(),
      slot: newSlot,
      status: "pending",
    });
    showToast("Booking rescheduled.", "info", "Rescheduled");
  };

  const clearLatestBooking = () => {
    setLatestBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        bookingType,
        setBookingType,
        scheduleConfig,
        draftScheduleConfig,
        updateSchedule,
        slotDuration,
        setSlotDuration,
        bookings,
        latestBooking,
        addBooking,
        approveBooking,
        rejectBooking,
        rescheduleBooking,
        saveScheduleConfig,
        clearLatestBooking,
        globalConfig,
        isLoading,
        showToast,
      }}
    >
      {children}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  return useContext(BookingContext);
};

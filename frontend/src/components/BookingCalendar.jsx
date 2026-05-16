import React from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import SlotList from "./SlotList";
import ClientDetailsForm from "./ClientDetailsForm";

import { useBooking } from "../context/BookingContext";

import { getSlots, shouldDisableDate } from "../utils/slotUtils";

export default function BookingCalendar() {
  const {
    selectedDate,
    setSelectedDate,

    selectedSlot,
    setSelectedSlot,

    bookingType,
    setBookingType,

    scheduleConfig,
    slotDuration,
    globalConfig,
    isLoading,
  } = useBooking();

  const slots = getSlots(
    selectedDate,
    bookingType,
    scheduleConfig,
    slotDuration,
    globalConfig,
  );

  if (isLoading) {
    return (
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/30">
        <p className="text-center text-slate-700">
          Loading availability and booking settings…
        </p>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="grid gap-6 lg:grid-cols-[minmax(420px,0.65fr)_minmax(320px,0.35fr)]">
        {/* LEFT SIDE */}
        <div className="space-y-6 rounded-4xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
          {/* BOOKING TYPE */}
          <div>
            <p className="text-sm font-semibold text-slate-600">Booking Type</p>

            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { value: "online", label: "Online" },
                { value: "offline", label: "Offline" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setBookingType(type.value);
                    setSelectedSlot("");
                  }}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    bookingType === type.value
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                      : "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* ATTACHED DATE PICKER */}
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600">
              Select Date
            </p>

            <DatePicker
              format="DD MMM, YYYY"
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                setSelectedSlot("");
              }}
              shouldDisableDate={(date) =>
                shouldDisableDate(date, globalConfig)
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: "Select appointment date",
                },
                popper: {
                  placement: "bottom-start",
                },
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </div>

          {/* SLOTS */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Available Slots
                </p>
              </div>
            </div>

            <SlotList
              slots={slots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <ClientDetailsForm />
        </div>
      </div>
    </LocalizationProvider>
  );
}

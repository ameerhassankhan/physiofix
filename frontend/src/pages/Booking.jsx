import React from "react";

import BookingCalendar from "../components/BookingCalendar";
import BookingReceipt from "../components/BookingReceipt";
import { useBooking } from "../context/BookingContext";

export default function BookingPage() {
  const { latestBooking, clearLatestBooking } = useBooking();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Physiotherapy Booking
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Select your date, choose a booking type, and fill in your
                details.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Smooth responsive booking for desktop and mobile.
            </div>
          </div>
        </header>

        {latestBooking ? (
          <BookingReceipt booking={latestBooking} onBack={clearLatestBooking} />
        ) : (
          <BookingCalendar />
        )}
      </div>
    </div>
  );
}

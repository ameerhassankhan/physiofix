import React, { useState } from "react";

export default function BookingCard({
  booking,
  onApprove,
  onReject,
  onReschedule,
  onCancelReschedule,
  onSaveReschedule,
}) {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: booking.date.format("YYYY-MM-DD"),
    slot: booking.slot,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isDecided = booking.status !== "pending";

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove(booking.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onReject(booking.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReschedule = async () => {
    setIsLoading(true);
    try {
      await onSaveReschedule(
        booking.id,
        rescheduleData.date,
        rescheduleData.slot,
      );
      setIsRescheduling(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReschedule = () => {
    setIsRescheduling(false);
    setRescheduleData({
      date: booking.date.format("YYYY-MM-DD"),
      slot: booking.slot,
    });
  };

  return (
    <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-900">{booking.name}</p>
          <p className="mt-1 text-sm text-slate-500">
            {booking.email} · {booking.phone}
          </p>
          {booking.note && (
            <p className="mt-1 text-sm text-slate-600">{booking.note}</p>
          )}
        </div>

        <div className="space-y-2 text-sm text-slate-600 sm:text-right">
          <div>
            <span className="font-semibold text-slate-800">Type:</span>{" "}
            {booking.type}
          </div>
          <div>
            <span className="font-semibold text-slate-800">Date:</span>{" "}
            {booking.date.format("YYYY-MM-DD")}
          </div>
          <div>
            <span className="font-semibold text-slate-800">Slot:</span>{" "}
            {booking.slot}
          </div>
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                booking.status === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : booking.status === "rejected"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleApprove}
          disabled={isDecided || isLoading}
          className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
            isDecided || isLoading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
          title={isDecided ? "Cannot approve after decision" : ""}
        >
          {isLoading ? "Processing..." : "Approve"}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={isDecided || isLoading}
          className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
            isDecided || isLoading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-rose-600 hover:bg-rose-700"
          }`}
          title={isDecided ? "Cannot reject after decision" : ""}
        >
          {isLoading ? "Processing..." : "Reject"}
        </button>
        <button
          type="button"
          onClick={() => setIsRescheduling(true)}
          disabled={isLoading}
          className={`rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition ${
            isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-slate-200"
          }`}
        >
          Reschedule
        </button>
      </div>

      {isRescheduling && (
        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <input
            type="date"
            value={rescheduleData.date}
            onChange={(event) =>
              setRescheduleData((prev) => ({
                ...prev,
                date: event.target.value,
              }))
            }
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <input
            type="time"
            value={rescheduleData.slot}
            onChange={(event) =>
              setRescheduleData((prev) => ({
                ...prev,
                slot: event.target.value,
              }))
            }
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveReschedule}
              disabled={isLoading}
              className="rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelReschedule}
              disabled={isLoading}
              className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import { toPng } from "html-to-image";
import { useBooking } from "../context/BookingContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const formatDateFull = (date) => date.format("MMM DD, YYYY");
const formatTime = (slot) => dayjs(`2026-01-01 ${slot}`).format("hh:mm A");

const getGoogleCalendarUrl = (booking, duration) => {
  const start = dayjs(`${booking.date.format("YYYY-MM-DD")} ${booking.slot}`);
  const end = start.add(duration, "minute");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const details = encodeURIComponent(
    `Phone: ${booking.phone}\nEmail: ${booking.email}\nNote: ${booking.note}`,
  );
  const text = encodeURIComponent(
    `Physio Therapy ${booking.type} consultation`,
  );
  const location = encodeURIComponent("Physiofix Clinic");
  const dates = `${start.format("YYYYMMDDTHHmmss")}/${end.format("YYYYMMDDTHHmmss")}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&ctz=${encodeURIComponent(timeZone)}`;
};

export default function BookingReceipt({ booking, onBack }) {
  const { slotDuration } = useBooking();
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;

    try {
      setIsDownloading(true);

      // Generate clean PNG data from DOM node
      const dataUrl = await toPng(receiptRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        style: {
          borderRadius: "0px", // Removes wrapper border artifacts during render capture
          transform: "scale(1)",
        },
      });

      // Trigger native browser download layout anchor link
      const link = document.createElement("a");
      const filename = `physiofix-receipt-${booking.id || booking.date.format("YYYYMMDD")}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(
        "Oops, something went wrong with the image download!",
        error,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const bookingDate = dayjs();
  const statusConfig =
    booking.status === "approved"
      ? {
          text: "Approved",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        }
      : booking.status === "rejected"
        ? { text: "Rejected", bg: "bg-rose-50 text-rose-700 border-rose-200" }
        : {
            text: "Pending",
            bg: "bg-amber-50 text-amber-700 border-amber-200",
          };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-2">
      {/* Top Meta Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="text-emerald-500" fontSize="medium" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Booking Confirmed
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Your appointment records have been updated. Save a digital copy
            below.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          <DownloadIcon className="h-4 w-4" />
          {isDownloading ? "Generating Image..." : "Download Receipt (PNG)"}
        </button>
      </div>

      {/* Main Formatted Receipt Section (Captured by html-to-image) */}
      <div
        ref={receiptRef}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50"
      >
        {/* Branding & Base Details Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-slate-100 pb-6 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-2xl font-black tracking-wider text-sky-600">
              PHYSIOFIX
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Medical Consultation Receipt
            </p>
          </div>
          <div className="space-y-2 sm:text-right">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Receipt Date
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {formatDateFull(bookingDate)}
              </p>
            </div>
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusConfig.bg}`}
            >
              {statusConfig.text}
            </span>
          </div>
        </div>

        {/* Transaction Split Meta Columns */}
        <div className="grid gap-6 border-b border-slate-100 py-6 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Booking Identification
            </span>
            <p className="mt-1 text-sm font-mono font-bold text-slate-900">
              {booking.id ||
                "PHY-" + booking.date.format("YYYYMMDD").toUpperCase()}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Payment Status
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {booking.status === "approved"
                ? "Paid / Verified"
                : "Pay at Counter / Pending"}
            </p>
          </div>
        </div>

        {/* Core Information Grid Layout */}
        <div className="grid gap-8 border-b border-slate-100 py-6 md:grid-cols-2">
          {/* Client Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Client Information
            </h3>
            <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-900">
                  {booking.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900 text-right max-w-[180px] truncate">
                  {booking.email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-900">
                  {booking.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Parameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Appointment Parameters
            </h3>
            <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Mode:</span>
                <span className="font-semibold text-slate-900">
                  {booking.type === "online"
                    ? "Online Consultation"
                    : "In-Clinic Visit"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Target Date:</span>
                <span className="font-semibold text-slate-900">
                  {formatDateFull(booking.date)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Allocated Window:</span>
                <span className="font-semibold text-slate-900">
                  {formatTime(booking.slot)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Consult Notes */}
        <div className="border-b border-slate-100 py-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Case Notes / Symptoms
          </span>
          <p className="mt-1 text-sm italic text-slate-600 bg-slate-50 rounded-xl p-3 border border-dashed border-slate-200">
            "
            {booking.note ||
              "No specific therapeutic case notes registered with booking request."}
            "
          </p>
        </div>

        {/* Clean Ledger Pricing Layout */}
        <div className="py-6">
          <div className="ml-auto max-w-sm space-y-3 text-right">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Consultation Subtotal</span>
              <span className="font-medium">PKR 3,500</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Adjustments / Discounts</span>
              <span className="font-medium">PKR 0</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
              <span className="text-base font-bold text-slate-900">
                Total Payable Amount
              </span>
              <span className="text-xl font-black text-sky-600">PKR 3,500</span>
            </div>
          </div>
        </div>

        {/* Professional Footer & Clinic Information */}
        <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <div>
            <p className="font-bold text-slate-700">
              Physiofix Clinic Head Office
            </p>
            <p>123 Medical Plaza, Main Street, Lahore, Pakistan</p>
          </div>
          <div className="sm:text-right">
            <p>Support Line: +92-300-1234567</p>
            <p>Email Desk: info@physiofix.com</p>
          </div>
        </div>
      </div>

      {/* Secondary Interface Navigation Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={getGoogleCalendarUrl(booking, slotDuration)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          <CalendarMonthIcon fontSize="small" />
          Synchronize Google Calendar
        </a>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowBackIcon fontSize="small" />
          Back to Scheduling
        </button>
      </div>
    </div>
  );
}

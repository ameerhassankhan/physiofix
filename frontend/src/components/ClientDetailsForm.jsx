import React, { useState } from "react";
import { useBooking } from "../context/BookingContext";

export default function ClientDetailsForm() {
  const { selectedDate, selectedSlot, bookingType, addBooking } = useBooking();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedSlot) {
      setFeedback("Please pick a date and slot before booking.");
      return;
    }

    if (!formData.name || !formData.phone || !formData.email) {
      setFeedback("Please complete your name, phone, and email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addBooking({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        note: formData.note,
        date: selectedDate,
        slot: selectedSlot,
        type: bookingType,
      });

      setFeedback(
        `Consultation booked for ${formData.name} on ${selectedDate.format("YYYY-MM-DD")} at ${selectedSlot}.`,
      );
      setFormData({ name: "", phone: "", email: "", note: "" });
    } catch (error) {
      console.error(error);
      setFeedback("Unable to save booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Client Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter your contact details and confirm your consultation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              placeholder="Your name"
              type="text"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              placeholder="Phone number"
              type="tel"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              placeholder="you@example.com"
              type="email"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="note"
            >
              Note
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="h-24 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              placeholder="Add any symptoms or questions"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-600">Selected Slot</p>
            <p className="text-base font-semibold text-slate-900">
              {selectedSlot || "No slot selected"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Booking..." : "Book Consultation"}
          </button>
        </div>

        {feedback && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

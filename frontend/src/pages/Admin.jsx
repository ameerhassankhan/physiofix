import React, { useState } from "react";
import { useBooking } from "../context/BookingContext";
import BookingCard from "../components/BookingCard";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AdminPage() {
  const {
    scheduleConfig,
    draftScheduleConfig,
    updateSchedule,
    bookings,
    approveBooking,
    rejectBooking,
    rescheduleBooking,
    slotDuration,
    setSlotDuration,
    saveScheduleConfig,
    globalConfig,
    isLoading,
  } = useBooking();

  const [selectedType, setSelectedType] = useState("online");
  const [saving, setSaving] = useState(false);

  const currentSchedule = draftScheduleConfig[selectedType];

  if (isLoading) {
    return (
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/30">
        <p className="text-center text-slate-700">Loading admin settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Administrator Control
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage consultation schedules for online and in-clinic bookings.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { value: "online", label: "Online" },
              { value: "offline", label: "In-clinic" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedType(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedType === item.value
                    ? "bg-sky-600 text-white"
                    : "border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="slotDuration"
            >
              Slot Duration (minutes)
            </label>
            <input
              id="slotDuration"
              type="number"
              value={slotDuration}
              onChange={(event) => setSlotDuration(Number(event.target.value))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              min="5"
              max="120"
            />
          </div>

          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Enabled</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">End Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dayNames.map((dayName, index) => {
                const dayConfig = currentSchedule.weeklySchedule[index];

                return (
                  <tr key={dayName} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {dayName}
                    </td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={dayConfig?.enabled || false}
                          onChange={(event) =>
                            updateSchedule(selectedType, index, {
                              enabled: event.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        Active
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={dayConfig?.start || "09:00"}
                        disabled={!dayConfig?.enabled}
                        onChange={(event) =>
                          updateSchedule(selectedType, index, {
                            start: event.target.value,
                          })
                        }
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={dayConfig?.end || "17:00"}
                        disabled={!dayConfig?.enabled}
                        onChange={(event) =>
                          updateSchedule(selectedType, index, {
                            end: event.target.value,
                          })
                        }
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              setSaving(true);
              await saveScheduleConfig();
            } catch (error) {
              // error toast already handled in context
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Bookings Management
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Approve, reject, or reschedule consultation requests.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {bookings.filter((item) => item.status === "pending").length}{" "}
              pending
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Booking window</p>
              <p className="mt-2 text-slate-600">
                {globalConfig.minDate} → {globalConfig.maxDate}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Off days</p>
              <p className="mt-2 text-slate-600">
                {globalConfig.offDays.length > 0
                  ? globalConfig.offDays.join(", ")
                  : "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onApprove={approveBooking}
              onReject={rejectBooking}
              onReschedule={() => {}}
              onCancelReschedule={() => {}}
              onSaveReschedule={rescheduleBooking}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

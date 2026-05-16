// =========================================
// SlotList.jsx
// =========================================

import React from "react";

import { formatSlot } from "../utils/slotUtils";

export default function SlotList({ slots, selectedSlot, setSelectedSlot }) {
  return (
    <div className="space-y-4">
      {slots.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No slots available for this day.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`min-w-[110px] rounded-full border px-4 py-3 text-sm font-semibold transition ${
                selectedSlot === slot
                  ? "border-sky-600 bg-sky-600 text-white shadow-lg shadow-sky-500/20"
                  : "border-slate-200 bg-slate-100 text-slate-800 hover:border-slate-300 hover:bg-slate-200"
              }`}
            >
              {formatSlot(slot)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

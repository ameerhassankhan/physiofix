import React from "react";
import BookingPage from "./Booking";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* <div className="flex flex-col gap-4 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/30 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Physiotherapy Booking
            </h1>
          </div>
        </div> */}
        {<BookingPage />}
      </div>
    </div>
  );
};

export default Home;

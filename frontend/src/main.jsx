// =========================================
// main.jsx OR index.jsx
// =========================================

import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { BookingProvider } from "./context/BookingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BookingProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    ,
  </BookingProvider>,
);

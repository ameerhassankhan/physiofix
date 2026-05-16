import React, { useState } from "react";
import AdminPage from "./pages/Admin";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

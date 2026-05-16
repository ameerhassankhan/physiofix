import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const fetchConfig = () => API.get("/api/config");
export const saveConfig = (config) => API.post("/api/config", config);
export const fetchBookings = () => API.get("/api/bookings");
export const createBooking = (booking) => API.post("/api/bookings", booking);
export const updateBooking = (id, changes) =>
  API.put(`/api/bookings/${id}`, changes);

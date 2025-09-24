import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export const Axios = axios.create({
  baseURL: "http://localhost:3000/",
  // timeout:10000,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.all = axios.all;

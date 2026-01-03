import axios from "axios";
import { redirect } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "https://api.devzoon.xyz", // production
  // baseURL: "http://api.local.devzoon.xyz", // local
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (optional)
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on 401
    if (error.response?.status === 401) {
      return redirect("/sign-in");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

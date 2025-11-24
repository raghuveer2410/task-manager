import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-jzey.onrender.com/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Auto attach token on every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Prevent sending empty Bearer
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");

      // Redirect only if user is not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;

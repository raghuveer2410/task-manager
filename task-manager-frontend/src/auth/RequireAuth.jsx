import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || token === "null" || token === "undefined") {
      localStorage.removeItem("token");
      setLoading(false);
      return;
    }

    // Set auth header once
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
    setLoading(false);
  }, [token]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!token || token === "null" || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
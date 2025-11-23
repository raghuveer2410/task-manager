import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from './api/api';

import Login from './Pages/Login';
import Register from './Pages/register';
import DashboardPage from './Pages/dashboard'; // page with fetchTasks & state
import RequireAuth from './auth/RequireAuth';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

          {/* REGISTER */}
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />

          {/* DASHBOARD (Protected) */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />

          {/* DEFAULT REDIRECT */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
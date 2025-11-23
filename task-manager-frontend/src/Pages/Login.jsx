import { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto redirect if already logged in
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null") {
    navigate("/dashboard", { replace: true });
  }
}, [navigate]);
  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/auth/login", form);

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Attach token globally
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Update parent auth state
      if (setIsLoggedIn) setIsLoggedIn(true);

      navigate("/dashboard");
      
    } catch (err) {
      console.log("Login error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
        (err.response?.status === 400 ? "Invalid email or password" : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-600 bg-red-100 py-2 rounded text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
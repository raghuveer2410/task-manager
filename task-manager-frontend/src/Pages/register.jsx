import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

function Register({ setIsLoggedIn }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await API.post('/api/auth/register', form);

      // ✅ Save token in localStorage
      const token = res.data.token;
      if (!token) throw new Error('Token not received');

      localStorage.setItem('token', token);

      // ✅ Set global Axios Authorization header
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // ✅ Update app state
      if (setIsLoggedIn) setIsLoggedIn(true);

      setSuccess('Account created successfully 🎉 Redirecting...');

      // ✅ Redirect after short delay
      setTimeout(() => navigate('/dashboard', { replace: true }), 1000);

    } catch (err) {
      console.error('Register error:', err);

      // Friendly error messages
      const msg =
        err.response?.data?.message ||
        (err.request ? 'Server did not respond. Please try again.' : 'Registration failed.');
      setError(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && <p className="mb-4 text-red-600 text-center bg-red-100 py-2 rounded">{error}</p>}
        {success && <p className="mb-4 text-green-600 text-center bg-green-100 py-2 rounded">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
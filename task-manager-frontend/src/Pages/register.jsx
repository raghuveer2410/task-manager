import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err); // full error for debugging
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Server did not respond. Please try again later.');
      } else {
        setError('Registration failed. Please check your input.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <p className="mb-4 text-red-600 text-center bg-red-100 py-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              value={form.name}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="relative">
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 chars)"
              onChange={handleChange}
              value={form.password}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              required
              minLength="6"
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
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const from = location.state?.from?.pathname;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const redirectByRole = (role) => {
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    switch (role) {
      case 'admin':
        navigate('/dashboard/admin', { replace: true });
        break;
      case 'volunteer':
        navigate('/dashboard/volunteer', { replace: true });
        break;
      case 'ngo':
        navigate('/dashboard/ngo', { replace: true });
        break;
      case 'donor':
      default:
        navigate('/dashboard/donor', { replace: true });
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(formData.email, formData.password);
      redirectByRole(user.role);
    } catch (err) {
      // Toast already shown in AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo Fill
  const setDemoCredentials = (email, password) => {
    setFormData({
      email,
      password,
      rememberMe: true,
    });
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-md">
            <Leaf className="w-7 h-7 text-emeraldBrand-light" />
          </div>
          <span className="text-3xl font-black text-gray-900 tracking-tight">
            Feed<span className="text-forest-800">Forward</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-gray-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-forest-800 hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-card border border-gray-100">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 transition bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 transition bg-gray-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-forest-800 focus:ring-forest-800"
                />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="font-semibold text-forest-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-forest-800 hover:bg-forest-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-800 transition shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Pill Switcher for Easy Demonstration */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center mb-3">
              Quick Demo Logins (Click to autofill)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('donor@greenbites.com', 'Donor@12345')}
                className="p-2 text-left bg-emerald-50/70 hover:bg-emerald-100/80 rounded-xl border border-emerald-200/80 transition"
              >
                <span className="block font-bold text-emerald-900">🍲 Donor</span>
                <span className="text-[10px] text-emerald-700">donor@greenbites.com</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('care@hopeorphanage.org', 'Ngo@12345')}
                className="p-2 text-left bg-blue-50/70 hover:bg-blue-100/80 rounded-xl border border-blue-200/80 transition"
              >
                <span className="block font-bold text-blue-900">🏢 NGO</span>
                <span className="text-[10px] text-blue-700">care@hopeorphanage.org</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('alex@volunteer.org', 'Volunteer@12345')}
                className="p-2 text-left bg-amber-50/70 hover:bg-amber-100/80 rounded-xl border border-amber-200/80 transition"
              >
                <span className="block font-bold text-amber-900">🚴 Volunteer</span>
                <span className="text-[10px] text-amber-700">alex@volunteer.org</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('admin@feedforward.org', 'Admin@12345')}
                className="p-2 text-left bg-purple-50/70 hover:bg-purple-100/80 rounded-xl border border-purple-200/80 transition"
              >
                <span className="block font-bold text-purple-900">👑 Admin</span>
                <span className="text-[10px] text-purple-700">admin@feedforward.org</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-forest-50 text-forest-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Password Recovery</h3>
            <p className="text-xs text-gray-600 mb-6">
              For security reasons or demo mode, default accounts use their respective standard passwords
              (e.g., <code className="bg-gray-100 px-1 py-0.5 rounded">Donor@12345</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">Ngo@12345</code>). You can also contact support@feedforward.org.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-forest-800 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

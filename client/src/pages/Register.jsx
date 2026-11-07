import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building2,
  Heart,
  Truck,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') || 'donor';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: ['donor', 'volunteer', 'ngo'].includes(initialRole) ? initialRole : 'donor',
    address: '',
    city: 'San Francisco',
    organizationName: '',
    organizationType: 'NGO',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['donor', 'volunteer', 'ngo'].includes(roleParam)) {
      setFormData((prev) => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    if (formData.role === 'ngo' && !formData.organizationName) {
      toast.error('Please specify your Organization Name.');
      return;
    }

    try {
      setLoading(true);
      const user = await register(formData);
      switch (user.role) {
        case 'volunteer':
          navigate('/dashboard/volunteer');
          break;
        case 'ngo':
          navigate('/dashboard/ngo');
          break;
        case 'donor':
        default:
          navigate('/dashboard/donor');
          break;
      }
    } catch (err) {
      // Toast displayed in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'donor',
      title: 'Food Donor',
      desc: 'Restaurant, hotel, catering, or event host',
      icon: Heart,
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      desc: 'Courier hero picking up & delivering food',
      icon: Truck,
    },
    {
      id: 'ngo',
      title: 'NGO / Charity',
      desc: 'Orphanage, shelter, old age home, or trust',
      icon: Building2,
    },
  ];

  const orgTypes = [
    'Old Age Home',
    'Orphanage',
    'NGO',
    'Charity',
    'Shelter',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-offwhite flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-md">
            <Leaf className="w-7 h-7 text-emeraldBrand-light" />
          </div>
          <span className="text-3xl font-black text-gray-900 tracking-tight">
            Feed<span className="text-forest-800">Forward</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
          Join the Movement
        </h2>
        <p className="mt-2 text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-forest-800 hover:underline">
            Log in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-card border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Select Role */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. Select Your Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = formData.role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-forest-800 bg-forest-50/80 ring-2 ring-forest-800/20'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected
                              ? 'bg-forest-800 text-white'
                              : 'bg-white text-gray-600 border border-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-forest-800" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{r.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                          {r.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Personal / Contact Info */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                2. Contact & Authentication Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {formData.role === 'ngo' ? 'Representative Name' : 'Full Name'} *
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Doe"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email Address *
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@example.com"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Password (min. 6 characters) *
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="block w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+1 (555) 000-0000"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Street Address *
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="123 Mission St, Suite 400"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Francisco"
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Organization Specifics (Only if NGO) */}
            {formData.role === 'ngo' && (
              <div className="space-y-4 pt-4 border-t border-blue-100 bg-blue-50/40 p-4 rounded-2xl border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    3. Organization Verification Details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Hope Orphanage Center"
                      className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Organization Type *
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-white"
                    >
                      {orgTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-forest-800 hover:bg-forest-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-800 transition shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

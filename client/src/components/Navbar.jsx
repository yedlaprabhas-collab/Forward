import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Menu, X, ArrowRight, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'donor':
        return '/dashboard/donor';
      case 'volunteer':
        return '/dashboard/volunteer';
      case 'ngo':
        return '/dashboard/ngo';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Food', path: '/browse' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'About', path: '/#about' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-6 h-6 text-emeraldBrand-light" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-forest-800 transition">
                Feed<span className="text-forest-800">Forward</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-gray-400 -mt-1">
                Zero Waste Food Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className={`text-sm font-semibold transition ${
                  location.pathname === link.path
                    ? 'text-forest-800 font-bold'
                    : 'text-gray-600 hover:text-forest-800'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200/80 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800 leading-none truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-forest-800 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-sm hover:shadow-md"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <div className="px-3 py-2 bg-gray-50 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-forest-800 rounded-xl"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-forest-800 rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

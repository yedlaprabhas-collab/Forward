import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  LogOut,
  User,
  ChevronRight,
  X,
} from 'lucide-react';

const Sidebar = ({
  title,
  menuItems = [],
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ngo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'volunteer':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'donor':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5 text-emeraldBrand-light" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Feed<span className="text-forest-800">Forward</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {title || `${user?.role?.toUpperCase()} PORTAL`}
            </span>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Navigation Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-forest-50 hover:text-forest-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-emeraldBrand-light' : 'text-gray-400'
                    }`}
                  />
                )}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User info & Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-3 p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
            <span
              className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadgeColor(
                user?.role
              )}`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

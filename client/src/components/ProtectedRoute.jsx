import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-forest-800/20 border-t-forest-800 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading FeedForward...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard
    const dashboardRoutes = {
      donor: '/dashboard/donor',
      volunteer: '/dashboard/volunteer',
      ngo: '/dashboard/ngo',
      admin: '/dashboard/admin',
    };
    const target = dashboardRoutes[user.role] || '/';
    return <Navigate to={target} replace />;
  }

  return children;
};

export default ProtectedRoute;

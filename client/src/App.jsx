import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BrowseFood from './pages/BrowseFood';
import DonationDetails from './pages/DonationDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import DonorDashboard from './dashboards/DonorDashboard';
import VolunteerDashboard from './dashboards/VolunteerDashboard';
import NGODashboard from './dashboards/NGODashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<BrowseFood />} />
      <Route path="/donations/:id" element={<DonationDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Role-Protected Dashboards */}
      <Route
        path="/dashboard/donor"
        element={
          <ProtectedRoute allowedRoles={['donor', 'admin']}>
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/volunteer"
        element={
          <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/ngo"
        element={
          <ProtectedRoute allowedRoles={['ngo', 'admin']}>
            <NGODashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

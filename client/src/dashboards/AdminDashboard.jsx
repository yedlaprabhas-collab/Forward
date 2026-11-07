import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { CategoryBadge, StatusBadge } from '../components/Badge';
import { ConfirmModal } from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Utensils,
  Building,
  Truck,
  PackageCheck,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);
  const [deliveriesList, setDeliveriesList] = useState([]);

  const [loading, setLoading] = useState(true);

  // User Filter & Search
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // User Status Toggle Modal
  const [userToToggle, setUserToToggle] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, donRes, delRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/donations'),
        api.get('/admin/deliveries'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (donRes.data.success) setDonationsList(donRes.data.donations);
      if (delRes.data.success) setDeliveriesList(delRes.data.deliveries);
    } catch (err) {
      toast.error('Failed to load administrator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async () => {
    if (!userToToggle) return;
    try {
      setToggleLoading(true);
      const { data } = await api.put(`/admin/users/${userToToggle._id}/status`);
      if (data.success) {
        toast.success(data.message);
        setUsersList((prev) =>
          prev.map((u) => (u._id === userToToggle._id ? { ...u, isActive: data.user.isActive } : u))
        );
        setUserToToggle(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user status.');
    } finally {
      setToggleLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users Directory', icon: Users, badge: usersList.length },
    { id: 'donations', label: 'All Donations', icon: Utensils, badge: donationsList.length },
    {
      id: 'organizations',
      label: 'Organizations (NGOs)',
      icon: Building,
      badge: usersList.filter((u) => u.role === 'ngo').length,
    },
    {
      id: 'volunteers',
      label: 'Volunteers',
      icon: Truck,
      badge: usersList.filter((u) => u.role === 'volunteer').length,
    },
    { id: 'deliveries', label: 'Deliveries Tracking', icon: PackageCheck, badge: deliveriesList.length },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
  ];

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesRole =
      userRoleFilter === 'all' || u.role.toLowerCase() === userRoleFilter.toLowerCase();
    const matchesSearch =
      !userSearch ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(userSearch.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const COLORS = ['#166534', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-offwhite flex">
      <Sidebar
        title="Admin Console"
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                {activeTab === 'overview' && 'System Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'donations' && 'Donation Audit'}
                {activeTab === 'organizations' && 'Partner Organizations'}
                {activeTab === 'volunteers' && 'Volunteer Fleet'}
                {activeTab === 'deliveries' && 'Delivery Lifecycle'}
                {activeTab === 'analytics' && 'Platform Analytics'}
              </h1>
              <p className="text-xs text-gray-400">Admin Control Panel • FeedForward</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-800 rounded-xl text-xs font-bold border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Root Admin Access
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 6 Key Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Total Registered Users"
                  value={stats?.totalUsers || usersList.length}
                  subtitle="Across all roles"
                  icon={Users}
                  color="purple"
                />
                <StatCard
                  title="Total Food Donations"
                  value={stats?.totalDonations || donationsList.length}
                  subtitle="Created on platform"
                  icon={Utensils}
                  color="forest"
                />
                <StatCard
                  title="Total Servings Rescued"
                  value={stats?.totalServingsRescued || 0}
                  subtitle="Meals saved from waste"
                  icon={CheckCircle}
                  color="emerald"
                />
                <StatCard
                  title="Completed Deliveries"
                  value={stats?.totalCompletedDeliveries || 0}
                  subtitle="Verified by NGOs"
                  icon={PackageCheck}
                  color="blue"
                />
                <StatCard
                  title="Active Volunteers"
                  value={stats?.totalVolunteers || 0}
                  subtitle="Registered couriers"
                  icon={Truck}
                  color="amber"
                />
                <StatCard
                  title="Partner Organizations"
                  value={stats?.totalNGOs || 0}
                  subtitle="Orphanages & Care Centers"
                  icon={Building}
                  color="emerald"
                />
              </div>

              {/* Chart Previews */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Trend Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Food Rescued & Donations Over Time
                  </h3>
                  <div className="h-64 w-full">
                    {stats?.monthlyStats && stats.monthlyStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.monthlyStats}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                          <YAxis stroke="#94a3b8" fontSize={11} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="servings"
                            name="Meals Rescued"
                            stroke="#166534"
                            fill="#dcfce7"
                          />
                          <Area
                            type="monotone"
                            dataKey="donations"
                            name="Donations"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400">
                        Insufficient historical data for monthly trend
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Breakdown Pie */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">
                    Food Category Distribution
                  </h3>
                  <div className="h-64 w-full">
                    {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.categoryStats}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {stats.categoryStats.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400">
                        No category data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Registered Users Directory</h2>
                  <p className="text-xs text-gray-500">
                    Monitor user accounts, verify roles, and toggle platform access.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="donor">Donors</option>
                    <option value="volunteer">Volunteers</option>
                    <option value="ngo">NGOs</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <TableSkeleton rows={6} />
              ) : filteredUsers.length === 0 ? (
                <EmptyState title="No users match the search filters" />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-gray-50/80 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Contact</th>
                          <th className="px-6 py-4">Location / Org</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-gray-50/50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold flex items-center justify-center text-xs">
                                  {u.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-gray-900 block">{u.name}</span>
                                  <span className="text-[11px] text-gray-400">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="uppercase font-bold text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">{u.phone}</td>
                            <td className="px-6 py-4">
                              <span className="block font-medium text-gray-800">
                                {u.organizationName || u.city || '—'}
                              </span>
                              {u.organizationType && (
                                <span className="text-[10px] text-gray-400">{u.organizationType}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {u.isActive ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  <CheckCircle className="w-3 h-3" /> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  <XCircle className="w-3 h-3" /> Deactivated
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {u._id !== user._id && (
                                <button
                                  type="button"
                                  onClick={() => setUserToToggle(u)}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                                    u.isActive
                                      ? 'text-rose-600 hover:bg-rose-50 border-rose-200'
                                      : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                                  }`}
                                >
                                  {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ALL DONATIONS */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">All System Donations</h2>
                <p className="text-xs text-gray-500">
                  Global audit log of every food listing across all statuses.
                </p>
              </div>

              {loading ? (
                <TableSkeleton rows={6} />
              ) : donationsList.length === 0 ? (
                <EmptyState title="No donations recorded on platform yet" />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-gray-50/80 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">Food Item</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Servings</th>
                          <th className="px-6 py-4">Donor</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Pickup Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {donationsList.map((d) => (
                          <tr key={d._id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <span className="font-bold text-gray-900 block">{d.foodName}</span>
                              <span className="text-[11px] text-gray-400 truncate max-w-xs block">
                                {d.city} • {d.pickupAddress}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <CategoryBadge category={d.foodCategory} />
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900">{d.quantity}</td>
                            <td className="px-6 py-4">{d.donor?.name || '—'}</td>
                            <td className="px-6 py-4">
                              <StatusBadge status={d.status} />
                            </td>
                            <td className="px-6 py-4">
                              {new Date(d.pickupDeadline).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ORGANIZATIONS */}
          {activeTab === 'organizations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Partner NGOs & Care Centers</h2>
                <p className="text-xs text-gray-500">
                  Registered charities, orphanages, and shelters receiving surplus nourishment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersList
                  .filter((u) => u.role === 'ngo')
                  .map((ngo) => (
                    <div
                      key={ngo._id}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                          {ngo.organizationType || 'NGO'}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ngo.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      <h3 className="text-base font-bold text-gray-900">
                        {ngo.organizationName || ngo.name}
                      </h3>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p>Contact: <strong>{ngo.name}</strong></p>
                        <p>Phone: {ngo.phone}</p>
                        <p>Address: {ngo.address}, {ngo.city}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Active Volunteer Couriers</h2>
                <p className="text-xs text-gray-500">
                  Drivers and dispatchers handling transport runs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersList
                  .filter((u) => u.role === 'volunteer')
                  .map((vol) => (
                    <div
                      key={vol._id}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-sm">
                          {vol.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{vol.name}</h4>
                          <span className="text-xs text-gray-400">{vol.city || 'Courier'}</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <p>Phone: {vol.phone}</p>
                        <p>Email: {vol.email}</p>
                        <p>Base: {vol.address}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: DELIVERIES TRACKING */}
          {activeTab === 'deliveries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Deliveries Lifecycle Monitor</h2>
                <p className="text-xs text-gray-500">
                  Active transit and completed courier delivery missions.
                </p>
              </div>

              {loading ? (
                <TableSkeleton rows={5} />
              ) : deliveriesList.length === 0 ? (
                <EmptyState title="No delivery records found" />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-gray-50/80 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">Donation</th>
                          <th className="px-6 py-4">From (Donor)</th>
                          <th className="px-6 py-4">To (NGO)</th>
                          <th className="px-6 py-4">Volunteer</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Updated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {deliveriesList.map((del) => (
                          <tr key={del._id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-bold text-gray-900">
                              {del.donation?.foodName || 'Donation Item'}
                              <span className="block text-[11px] font-normal text-gray-400">
                                {del.donation?.quantity} servings
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold block">{del.donor?.name || 'Donor'}</span>
                              <span className="text-[10px] text-gray-400 truncate max-w-xs block">
                                {del.pickupAddress}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold block">
                                {del.ngo?.organizationName || del.ngo?.name || 'NGO'}
                              </span>
                              <span className="text-[10px] text-gray-400 truncate max-w-xs block">
                                {del.deliveryAddress}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {del.volunteer ? (
                                <span className="font-semibold text-purple-700">
                                  {del.volunteer.name}
                                </span>
                              ) : (
                                <span className="text-amber-600 italic">Unassigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={del.status} />
                            </td>
                            <td className="px-6 py-4">
                              {new Date(del.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Platform Analytics & Metrics</h2>
                <p className="text-xs text-gray-500">
                  Dynamic visual aggregations derived from real MongoDB database transactions.
                </p>
              </div>

              {/* Status Breakdown Bar Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Donation Volume by Lifecycle Status
                </h3>
                <div className="h-72 w-full">
                  {stats?.statusStats && stats.statusStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.statusStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="count" name="Donations" fill="#166534" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                      No status data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toggle User Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(userToToggle)}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleToggleUserStatus}
        isLoading={toggleLoading}
        title={`${userToToggle?.isActive ? 'Deactivate' : 'Activate'} User Account?`}
        message={`Are you sure you want to ${
          userToToggle?.isActive ? 'deactivate' : 'activate'
        } ${userToToggle?.name}? ${
          userToToggle?.isActive
            ? 'The user will no longer be able to log in or access their dashboard.'
            : 'The user will regain immediate platform access.'
        }`}
        confirmText={userToToggle?.isActive ? 'Deactivate Account' : 'Activate Account'}
        type={userToToggle?.isActive ? 'danger' : 'forest'}
      />
    </div>
  );
};

export default AdminDashboard;

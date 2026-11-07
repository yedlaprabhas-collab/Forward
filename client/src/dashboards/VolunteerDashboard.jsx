import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import DeliveryCard from '../components/DeliveryCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PackageOpen,
  Truck,
  CheckCircle2,
  User,
  Heart,
  Users,
  Clock,
  Menu,
} from 'lucide-react';
import toast from 'react-hot-toast';

const VolunteerDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeDeliveriesCount: 0,
    completedDeliveriesCount: 0,
    mealsDelivered: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [availRes, myRes] = await Promise.all([
        api.get('/deliveries/available'),
        api.get('/deliveries/my'),
      ]);

      if (availRes.data.success) {
        setAvailableDeliveries(availRes.data.deliveries || []);
      }
      if (myRes.data.success) {
        setMyDeliveries(myRes.data.deliveries || []);
        setStats(myRes.data.stats || {});
      }
    } catch (err) {
      toast.error('Failed to load volunteer deliveries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Volunteer Action: Accept Delivery
  const handleAcceptDelivery = async (deliveryId) => {
    try {
      setLoadingActionId(deliveryId);
      const { data } = await api.put(`/deliveries/${deliveryId}/accept`);
      if (data.success) {
        toast.success('Mission accepted! You are now the assigned courier.');
        fetchData();
        setActiveTab('my-deliveries');
      }
    } catch (err) {
      toast.error(err.message || 'Could not accept delivery.');
    } finally {
      setLoadingActionId(null);
    }
  };

  // Volunteer Action: Mark Picked Up
  const handleMarkPickedUp = async (deliveryId) => {
    try {
      setLoadingActionId(deliveryId);
      const { data } = await api.put(`/deliveries/${deliveryId}/pickup`);
      if (data.success) {
        toast.success('Status updated to In Transit / Picked Up!');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update pickup status.');
    } finally {
      setLoadingActionId(null);
    }
  };

  // Volunteer Action: Mark Delivered
  const handleMarkDelivered = async (deliveryId) => {
    try {
      setLoadingActionId(deliveryId);
      const { data } = await api.put(`/deliveries/${deliveryId}/deliver`);
      if (data.success) {
        toast.success('Food delivered! Awaiting recipient NGO confirmation.');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to mark as delivered.');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await updateProfile(profileData);
    } catch (err) {
      // Toast in context
    } finally {
      setProfileLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'available',
      label: 'Available Pickups',
      icon: PackageOpen,
      badge: availableDeliveries.length,
    },
    {
      id: 'my-deliveries',
      label: 'My Active Deliveries',
      icon: Truck,
      badge: stats.activeDeliveriesCount,
    },
    { id: 'completed', label: 'Completed Deliveries', icon: CheckCircle2 },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const activeDeliveriesList = myDeliveries.filter((d) =>
    ['Assigned', 'Picked Up'].includes(d.status)
  );

  const completedDeliveriesList = myDeliveries.filter((d) =>
    ['Delivered', 'Completed'].includes(d.status)
  );

  return (
    <div className="min-h-screen bg-offwhite flex">
      <Sidebar
        title="Volunteer Hero"
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
                {activeTab === 'overview' && 'Volunteer Dashboard'}
                {activeTab === 'available' && 'Available Pickups'}
                {activeTab === 'my-deliveries' && 'My Active Deliveries'}
                {activeTab === 'completed' && 'Completed Deliveries'}
                {activeTab === 'profile' && 'Volunteer Profile'}
              </h1>
              <p className="text-xs text-gray-400">Welcome, {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl text-xs font-bold border border-amber-200">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              {stats.activeDeliveriesCount} In Transit
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Deliveries"
                  value={stats.totalDeliveries}
                  subtitle="Missions accepted"
                  icon={Truck}
                  color="amber"
                />
                <StatCard
                  title="Active Runs"
                  value={stats.activeDeliveriesCount}
                  subtitle="Assigned & in transit"
                  icon={Clock}
                  color="blue"
                />
                <StatCard
                  title="Completed Deliveries"
                  value={stats.completedDeliveriesCount}
                  subtitle="Safely delivered"
                  icon={CheckCircle2}
                  color="forest"
                />
                <StatCard
                  title="Meals Delivered"
                  value={stats.mealsDelivered}
                  subtitle="Servings transported"
                  icon={Users}
                  color="emerald"
                />
              </div>

              {/* Active Deliveries Quick Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Active Deliveries</h2>
                  <button
                    onClick={() => setActiveTab('my-deliveries')}
                    className="text-xs font-semibold text-forest-800 hover:underline"
                  >
                    View All ({activeDeliveriesList.length})
                  </button>
                </div>

                {loading ? (
                  <CardSkeleton count={2} />
                ) : activeDeliveriesList.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                    <p className="text-sm font-semibold text-gray-700">No active deliveries in progress</p>
                    <p className="text-xs text-gray-400 mt-1 mb-4">
                      Check available pickups requested by nearby NGOs needing a hero courier.
                    </p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900 transition"
                    >
                      View Available Pickups ({availableDeliveries.length})
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeDeliveriesList.map((delivery) => (
                      <DeliveryCard
                        key={delivery._id}
                        delivery={delivery}
                        role="volunteer"
                        onPickup={handleMarkPickedUp}
                        onDeliver={handleMarkDelivered}
                        loadingActionId={loadingActionId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: AVAILABLE PICKUPS */}
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Available Pickups</h2>
                <p className="text-xs text-gray-500">
                  Surplus food requested by NGOs waiting for a volunteer driver to transport.
                </p>
              </div>

              {loading ? (
                <CardSkeleton count={3} />
              ) : availableDeliveries.length === 0 ? (
                <EmptyState
                  icon={PackageOpen}
                  title="No pending pickups right now"
                  description="All current food requests have already been assigned to couriers. Check back shortly!"
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {availableDeliveries.map((delivery) => (
                    <DeliveryCard
                      key={delivery._id}
                      delivery={delivery}
                      role="volunteer"
                      onAccept={handleAcceptDelivery}
                      loadingActionId={loadingActionId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MY ACTIVE DELIVERIES */}
          {activeTab === 'my-deliveries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">My Active Deliveries</h2>
                <p className="text-xs text-gray-500">
                  Update statuses step-by-step as you pick up from donors and deliver to NGOs.
                </p>
              </div>

              {loading ? (
                <CardSkeleton count={2} />
              ) : activeDeliveriesList.length === 0 ? (
                <EmptyState
                  icon={Truck}
                  title="No active deliveries"
                  description="You have not claimed any active delivery runs yet."
                  actionText="Explore Available Pickups"
                  onAction={() => setActiveTab('available')}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeDeliveriesList.map((delivery) => (
                    <DeliveryCard
                      key={delivery._id}
                      delivery={delivery}
                      role="volunteer"
                      onPickup={handleMarkPickedUp}
                      onDeliver={handleMarkDelivered}
                      loadingActionId={loadingActionId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: COMPLETED DELIVERIES */}
          {activeTab === 'completed' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Completed Delivery Missions</h2>
                <p className="text-xs text-gray-500">
                  History of meals successfully transported and received by care centers.
                </p>
              </div>

              {loading ? (
                <CardSkeleton count={2} />
              ) : completedDeliveriesList.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="No completed deliveries yet"
                  description="Once you complete a delivery and the NGO confirms receipt, it will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedDeliveriesList.map((delivery) => (
                    <DeliveryCard
                      key={delivery._id}
                      delivery={delivery}
                      role="volunteer"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-card border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Volunteer Profile</h2>
              <p className="text-xs text-gray-500 mb-6">Manage your contact details and active courier city.</p>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Primary City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address / Base Area</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900 transition shadow-sm"
                >
                  {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

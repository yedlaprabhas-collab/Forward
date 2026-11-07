import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import DonationCard from '../components/DonationCard';
import DeliveryCard from '../components/DeliveryCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Utensils,
  Clock,
  CheckCircle2,
  User,
  Heart,
  Users,
  Building,
  Search,
  Filter,
  Menu,
} from 'lucide-react';
import toast from 'react-hot-toast';

const NGODashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Browse Food State
  const [browseDonations, setBrowseDonations] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cityFilter, setCityFilter] = useState('');

  // NGO Requests & Deliveries State
  const [myRequests, setMyRequests] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    receivedDonations: 0,
    mealsReceived: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    organizationName: user?.organizationName || '',
    organizationType: user?.organizationType || 'NGO',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchNGOData = async () => {
    try {
      setLoading(true);
      const [browseRes, reqRes] = await Promise.all([
        api.get('/donations?status=Available'),
        api.get('/requests/my'),
      ]);

      if (browseRes.data.success) {
        setBrowseDonations(browseRes.data.donations || []);
      }
      if (reqRes.data.success) {
        setMyRequests(reqRes.data.donations || []);
        setMyDeliveries(reqRes.data.deliveries || []);
        setStats(reqRes.data.stats || {});
      }
    } catch (err) {
      toast.error('Failed to load NGO dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOData();
  }, []);

  // Action: Request Food
  const handleRequestFood = async (donationId) => {
    try {
      setLoadingActionId(donationId);
      const { data } = await api.post(`/donations/${donationId}/request`);
      if (data.success) {
        toast.success('Food request sent! Couriers will be notified.');
        fetchNGOData();
        setActiveTab('my-requests');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to request food.');
    } finally {
      setLoadingActionId(null);
    }
  };

  // Action: Cancel Pending Request
  const handleCancelRequest = async (donationId) => {
    try {
      setLoadingActionId(donationId);
      const { data } = await api.put(`/requests/${donationId}/cancel`);
      if (data.success) {
        toast.success('Food request cancelled.');
        fetchNGOData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel request.');
    } finally {
      setLoadingActionId(null);
    }
  };

  // Action: Confirm Food Receipt
  const handleConfirmReceipt = async (deliveryId) => {
    try {
      setLoadingActionId(deliveryId);
      const { data } = await api.put(`/deliveries/${deliveryId}/confirm`);
      if (data.success) {
        toast.success('Food receipt confirmed! Thank you for nourishing our community.');
        fetchNGOData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to confirm delivery receipt.');
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
      id: 'browse',
      label: 'Browse Food',
      icon: Utensils,
      badge: browseDonations.length,
    },
    {
      id: 'my-requests',
      label: 'My Requests',
      icon: Clock,
      badge: stats.pendingRequests,
    },
    { id: 'received', label: 'Received Donations', icon: CheckCircle2 },
    { id: 'profile', label: 'Organization Profile', icon: Building },
  ];

  const filteredBrowse = browseDonations.filter((d) => {
    const matchesCategory = category === 'All' || d.foodCategory === category;
    const matchesSearch =
      !search ||
      d.foodName.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchesCity =
      !cityFilter || d.city?.toLowerCase().includes(cityFilter.toLowerCase());
    return matchesCategory && matchesSearch && matchesCity;
  });

  const pendingRequestsList = myRequests.filter((d) =>
    ['Requested', 'Assigned', 'Picked Up'].includes(d.status)
  );

  const pendingReceiptDeliveries = myDeliveries.filter(
    (d) => d.status === 'Delivered'
  );

  return (
    <div className="min-h-screen bg-offwhite flex">
      <Sidebar
        title="NGO Portal"
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
                {activeTab === 'overview' && 'NGO Dashboard'}
                {activeTab === 'browse' && 'Browse Surplus Food'}
                {activeTab === 'my-requests' && 'Food Requests'}
                {activeTab === 'received' && 'Received Donations'}
                {activeTab === 'profile' && 'Organization Profile'}
              </h1>
              <p className="text-xs text-gray-400">
                {user?.organizationName || user?.name} ({user?.organizationType || 'NGO'})
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('browse')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Utensils className="w-4 h-4" />
            <span className="hidden sm:inline">Browse Food</span>
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  subtitle="Food items requested"
                  icon={Utensils}
                  color="blue"
                />
                <StatCard
                  title="Pending Requests"
                  value={stats.pendingRequests}
                  subtitle="Awaiting transit / delivery"
                  icon={Clock}
                  color="amber"
                />
                <StatCard
                  title="Received Donations"
                  value={stats.receivedDonations}
                  subtitle="Completed meal batches"
                  icon={CheckCircle2}
                  color="forest"
                />
                <StatCard
                  title="Meals Received"
                  value={stats.mealsReceived}
                  subtitle="Beneficiaries served"
                  icon={Users}
                  color="emerald"
                />
              </div>

              {/* Action Needed: Pending Confirmations */}
              {pendingReceiptDeliveries.length > 0 && (
                <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 space-y-4">
                  <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-teal-700" />
                    <span>Deliveries Ready for Receipt Confirmation ({pendingReceiptDeliveries.length})</span>
                  </div>
                  <p className="text-xs text-teal-800">
                    The courier has arrived and marked the following foods as Delivered. Please click "Confirm Food Receipt" to complete the handover.
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pendingReceiptDeliveries.map((delivery) => (
                      <DeliveryCard
                        key={delivery._id}
                        delivery={delivery}
                        role="ngo"
                        onConfirmReceipt={handleConfirmReceipt}
                        loadingActionId={loadingActionId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Live Surplus Catalog Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Available Surplus Food</h2>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="text-xs font-semibold text-forest-800 hover:underline"
                  >
                    View All ({browseDonations.length})
                  </button>
                </div>

                {loading ? (
                  <CardSkeleton count={3} />
                ) : browseDonations.length === 0 ? (
                  <EmptyState
                    title="No food available at this exact moment"
                    description="Donors continuously post surplus batches from events and restaurants. Check back shortly."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {browseDonations.slice(0, 3).map((donation) => (
                      <DonationCard
                        key={donation._id}
                        donation={donation}
                        role="ngo"
                        currentUserId={user?._id}
                        onRequest={handleRequestFood}
                        loadingActionId={loadingActionId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: BROWSE FOOD */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Browse Available Food</h2>
                <p className="text-xs text-gray-500">
                  Select fresh meals to request for your orphanage, shelter, or community home.
                </p>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50"
                  />
                </div>

                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50"
                  >
                    <option value="All">All Categories</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Filter by city..."
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50"
                  />
                </div>
              </div>

              {loading ? (
                <CardSkeleton count={6} />
              ) : filteredBrowse.length === 0 ? (
                <EmptyState
                  title="No listings matched your criteria"
                  description="Try clearing search keywords or category filters."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBrowse.map((donation) => (
                    <DonationCard
                      key={donation._id}
                      donation={donation}
                      role="ngo"
                      currentUserId={user?._id}
                      onRequest={handleRequestFood}
                      loadingActionId={loadingActionId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MY REQUESTS */}
          {activeTab === 'my-requests' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Requested Food Packages</h2>
                <p className="text-xs text-gray-500">
                  Track volunteers assigned and live pickup status for food requested by your center.
                </p>
              </div>

              {loading ? (
                <CardSkeleton count={3} />
              ) : pendingRequestsList.length === 0 ? (
                <EmptyState
                  title="No active requests pending"
                  description="Browse the catalog to request food for your organization."
                  actionText="Browse Available Food"
                  onAction={() => setActiveTab('browse')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingRequestsList.map((donation) => (
                    <DonationCard
                      key={donation._id}
                      donation={donation}
                      role="ngo"
                      currentUserId={user?._id}
                      onCancelRequest={handleCancelRequest}
                      loadingActionId={loadingActionId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: RECEIVED DONATIONS */}
          {activeTab === 'received' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Received Donations & Confirmations</h2>
                <p className="text-xs text-gray-500">
                  Confirm receipt of deliveries or view your past completed donation records.
                </p>
              </div>

              {loading ? (
                <CardSkeleton count={2} />
              ) : myDeliveries.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="No deliveries received yet"
                  description="Once couriers drop off food packages, they will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myDeliveries.map((delivery) => (
                    <DeliveryCard
                      key={delivery._id}
                      delivery={delivery}
                      role="ngo"
                      onConfirmReceipt={handleConfirmReceipt}
                      loadingActionId={loadingActionId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-card border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Organization Profile</h2>
              <p className="text-xs text-gray-500 mb-6">
                Ensure your delivery address and representative contact numbers are accurate.
              </p>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={profileData.organizationName}
                      onChange={(e) => setProfileData({ ...profileData, organizationName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Organization Type
                    </label>
                    <select
                      value={profileData.organizationType}
                      onChange={(e) => setProfileData({ ...profileData, organizationType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    >
                      <option value="Old Age Home">Old Age Home</option>
                      <option value="Orphanage">Orphanage</option>
                      <option value="NGO">NGO</option>
                      <option value="Charity">Charity</option>
                      <option value="Shelter">Shelter</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Representative Contact Person
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Delivery / Drop-off Street Address
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900 transition shadow-sm"
                >
                  {profileLoading ? 'Saving...' : 'Save Organization Profile'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NGODashboard;

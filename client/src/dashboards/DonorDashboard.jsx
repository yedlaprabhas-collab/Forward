import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import DonationCard from '../components/DonationCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Modal, ConfirmModal } from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Utensils,
  PlusCircle,
  History,
  User,
  Heart,
  Users,
  Clock,
  CheckCircle,
  Menu,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DonorDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    mealsDonated: 0,
    activeDonations: 0,
    completedDonations: 0,
  });
  const [loading, setLoading] = useState(true);

  // Form State for Create / Edit
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    foodCategory: 'Vegetarian',
    quantity: '',
    preparationTime: '',
    pickupDeadline: '',
    pickupAddress: user?.address || '',
    city: user?.city || 'San Francisco',
    contactNumber: user?.phone || '',
    instructions: '',
  });

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/donations/my');
      if (data.success) {
        setDonations(data.donations || []);
        setStats(data.stats || {});
      }
    } catch (err) {
      toast.error('Failed to load your donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const openCreateModal = () => {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    setEditingDonation(null);
    setFormData({
      foodName: '',
      description: '',
      foodCategory: 'Vegetarian',
      quantity: '',
      preparationTime: now.toISOString().slice(0, 16),
      pickupDeadline: twoHoursLater.toISOString().slice(0, 16),
      pickupAddress: user?.address || '',
      city: user?.city || 'San Francisco',
      contactNumber: user?.phone || '',
      instructions: '',
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (donation) => {
    setEditingDonation(donation);
    setFormData({
      foodName: donation.foodName,
      description: donation.description,
      foodCategory: donation.foodCategory,
      quantity: donation.quantity,
      preparationTime: new Date(donation.preparationTime).toISOString().slice(0, 16),
      pickupDeadline: new Date(donation.pickupDeadline).toISOString().slice(0, 16),
      pickupAddress: donation.pickupAddress,
      city: donation.city,
      contactNumber: donation.contactNumber,
      instructions: donation.instructions || '',
    });
    setIsFormModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.foodName || !formData.quantity || !formData.pickupAddress) {
      toast.error('Please enter food name, servings, and pickup address.');
      return;
    }

    try {
      setFormLoading(true);
      if (editingDonation) {
        await api.put(`/donations/${editingDonation._id}`, formData);
        toast.success('Donation updated successfully!');
      } else {
        await api.post('/donations', formData);
        toast.success('Food donation created successfully!');
      }
      setIsFormModalOpen(false);
      fetchMyDonations();
    } catch (err) {
      toast.error(err.message || 'Failed to save donation.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDonation = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/donations/${deleteId}`);
      toast.success('Donation cancelled successfully.');
      setDeleteId(null);
      fetchMyDonations();
    } catch (err) {
      toast.error(err.message || 'Failed to delete donation.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await updateProfile(profileData);
    } catch (err) {
      // Toast displayed in context
    } finally {
      setProfileLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-donations', label: 'My Active Donations', icon: Utensils, badge: stats.activeDonations },
    { id: 'create', label: 'Create Donation', icon: PlusCircle },
    { id: 'history', label: 'Donation History', icon: History },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const activeDonationsList = donations.filter((d) =>
    ['Available', 'Requested', 'Assigned', 'Picked Up'].includes(d.status)
  );

  const historyDonationsList = donations.filter((d) =>
    ['Delivered', 'Completed', 'Cancelled'].includes(d.status)
  );

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Sidebar */}
      <Sidebar
        title="Donor Portal"
        menuItems={menuItems}
        activeTab={activeTab === 'create' ? 'my-donations' : activeTab}
        setActiveTab={(tab) => {
          if (tab === 'create') {
            openCreateModal();
          } else {
            setActiveTab(tab);
          }
        }}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
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
                {activeTab === 'overview' && 'Donor Dashboard'}
                {activeTab === 'my-donations' && 'Active Donations'}
                {activeTab === 'history' && 'Donation History'}
                {activeTab === 'profile' && 'Profile Settings'}
              </h1>
              <p className="text-xs text-gray-400">Welcome back, {user?.name}</p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Donation</span>
          </button>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Donations"
                  value={stats.totalDonations}
                  subtitle="Created food listings"
                  icon={Heart}
                  color="forest"
                />
                <StatCard
                  title="Meals Donated"
                  value={stats.mealsDonated}
                  subtitle="Servings provided"
                  icon={Users}
                  color="emerald"
                />
                <StatCard
                  title="Active Runs"
                  value={stats.activeDonations}
                  subtitle="Available or in progress"
                  icon={Clock}
                  color="amber"
                />
                <StatCard
                  title="Completed Deliveries"
                  value={stats.completedDonations}
                  subtitle="Successfully delivered"
                  icon={CheckCircle}
                  color="purple"
                />
              </div>

              {/* Active Donations Preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">Active Donations</h2>
                  <button
                    onClick={() => setActiveTab('my-donations')}
                    className="text-xs font-semibold text-forest-800 hover:underline"
                  >
                    View All ({activeDonationsList.length})
                  </button>
                </div>

                {loading ? (
                  <CardSkeleton count={3} />
                ) : activeDonationsList.length === 0 ? (
                  <EmptyState
                    title="No active donations right now"
                    description="Turn your surplus kitchen food into meals for those in need with one click."
                    actionText="Create Food Donation"
                    onAction={openCreateModal}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeDonationsList.slice(0, 3).map((donation) => (
                      <DonationCard
                        key={donation._id}
                        donation={donation}
                        role="donor"
                        currentUserId={user?._id}
                        onEdit={openEditModal}
                        onDelete={(id) => setDeleteId(id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MY ACTIVE DONATIONS */}
          {activeTab === 'my-donations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">My Active Donations</h2>
                  <p className="text-xs text-gray-500">
                    Manage food currently available, requested by NGOs, or in volunteer transit.
                  </p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900 transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Donation
                </button>
              </div>

              {loading ? (
                <CardSkeleton count={3} />
              ) : activeDonationsList.length === 0 ? (
                <EmptyState
                  title="No active donations found"
                  description="You do not have any pending or in-transit donations."
                  actionText="Create Food Donation"
                  onAction={openCreateModal}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeDonationsList.map((donation) => (
                    <DonationCard
                      key={donation._id}
                      donation={donation}
                      role="donor"
                      currentUserId={user?._id}
                      onEdit={openEditModal}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: DONATION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Donation History</h2>
                <p className="text-xs text-gray-500">
                  Review all previously delivered and completed food contributions.
                </p>
              </div>

              {loading ? (
                <CardSkeleton count={3} />
              ) : historyDonationsList.length === 0 ? (
                <EmptyState
                  title="No past donations yet"
                  description="Completed donations verified by recipient organizations will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {historyDonationsList.map((donation) => (
                    <DonationCard
                      key={donation._id}
                      donation={donation}
                      role="donor"
                      currentUserId={user?._id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-card border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Donor Profile</h2>
              <p className="text-xs text-gray-500 mb-6">
                Update your contact details and default pickup location.
              </p>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Donor / Organization Name
                  </label>
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
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      City
                    </label>
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
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Default Pickup Address
                  </label>
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

      {/* Create / Edit Donation Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingDonation ? 'Edit Food Donation' : 'Create New Food Donation'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Food Item Name *
            </label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleFormChange}
              required
              placeholder="e.g. Mixed Vegetable Biryani & Gravy"
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Food Category *
              </label>
              <select
                name="foodCategory"
                value={formData.foodCategory}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Quantity (Servings / People) *
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleFormChange}
                required
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Food Description & Preparation Notes *
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleFormChange}
              required
              placeholder="Describe dishes, ingredients, freshness, and packaging containers..."
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Preparation Time *
              </label>
              <input
                type="datetime-local"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleFormChange}
                required
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Pickup Deadline *
              </label>
              <input
                type="datetime-local"
                name="pickupDeadline"
                value={formData.pickupDeadline}
                onChange={handleFormChange}
                required
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Pickup Address *
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleFormChange}
                required
                placeholder="Street address or kitchen dock"
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                required
                placeholder="City"
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleFormChange}
                required
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Special Pickup Instructions
              </label>
              <input
                type="text"
                name="instructions"
                value={formData.instructions}
                onChange={handleFormChange}
                placeholder="e.g. Ring kitchen bell, bring crates"
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {formLoading ? 'Submitting...' : editingDonation ? 'Update Donation' : 'Publish Donation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteDonation}
        isLoading={deleteLoading}
        title="Delete Food Listing?"
        message="Are you sure you want to remove this donation? This action is permanent."
        confirmText="Yes, Delete"
      />
    </div>
  );
};

export default DonorDashboard;

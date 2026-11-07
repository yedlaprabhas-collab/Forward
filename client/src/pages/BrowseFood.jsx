import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DonationCard from '../components/DonationCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const BrowseFood = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'Available');
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      if (city) params.append('city', city);
      if (minQuantity) params.append('minQuantity', minQuantity);

      const { data } = await api.get(`/donations?${params.toString()}`);
      if (data.success) {
        setDonations(data.donations || []);
      }
    } catch (err) {
      toast.error('Failed to load available food items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [category, minQuantity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonations();
  };

  // NGO Request Food Action
  const handleRequestFood = async (donationId) => {
    if (!user) {
      toast.error('Please log in with an NGO account to request food.');
      return;
    }
    if (user.role !== 'ngo') {
      toast.error('Only registered NGOs can request food donations.');
      return;
    }

    try {
      setLoadingActionId(donationId);
      const { data } = await api.post(`/donations/${donationId}/request`);
      if (data.success) {
        toast.success('Food request submitted! A volunteer will be notified.');
        fetchDonations();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit food request.');
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner */}
        <div className="bg-forest-800 rounded-3xl p-8 sm:p-10 text-white mb-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-700 text-xs font-bold uppercase tracking-wider text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emeraldBrand-light" />
              Live Available Donations
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Browse Surplus Food
            </h1>
            <p className="text-sm text-forest-100">
              Freshly prepared meals ready for collection by orphanages, shelters, and care homes.
            </p>
          </div>

          <button
            onClick={fetchDonations}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-600 rounded-xl text-xs font-bold transition text-white border border-forest-600"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Listings
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-card border border-gray-100 mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Query */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search food name or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
              />
            </div>

            {/* City */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Filter by city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
              >
                <option value="All">All Categories</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            {/* Min Quantity */}
            <div className="flex gap-2">
              <select
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-800 focus:border-forest-800 bg-gray-50/50"
              >
                <option value="">Any Servings</option>
                <option value="20">20+ Servings</option>
                <option value="50">50+ Servings</option>
                <option value="100">100+ Servings</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition shrink-0"
              >
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <CardSkeleton count={6} />
        ) : donations.length === 0 ? (
          <EmptyState
            title="No food listings currently match your criteria"
            description="Try modifying your category filters or location keyword to see available donations."
            actionText="Reset All Filters"
            onAction={() => {
              setSearch('');
              setCategory('All');
              setCity('');
              setMinQuantity('');
              fetchDonations();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <DonationCard
                key={donation._id}
                donation={donation}
                role={user?.role}
                currentUserId={user?._id}
                onRequest={handleRequestFood}
                loadingActionId={loadingActionId}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseFood;

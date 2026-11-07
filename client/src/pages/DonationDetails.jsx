import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CategoryBadge, StatusBadge } from '../components/Badge';
import { ConfirmModal } from '../components/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Building,
  User,
  Phone,
  ArrowLeft,
  Truck,
  Heart,
  FileText,
  ShieldCheck,
  Send,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [donation, setDonation] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/donations/${id}`);
      if (data.success) {
        setDonation(data.donation);
        setDelivery(data.delivery);
      }
    } catch (err) {
      toast.error('Failed to load donation details.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // NGO Request
  const handleRequest = async () => {
    if (!user || user.role !== 'ngo') {
      toast.error('Only authenticated NGOs can request food.');
      return;
    }
    try {
      setActionLoading(true);
      const { data } = await api.post(`/donations/${id}/request`);
      if (data.success) {
        toast.success('Food successfully requested!');
        fetchDetails();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to request food.');
    } finally {
      setActionLoading(false);
    }
  };

  // Donor Cancel/Delete
  const handleDelete = async () => {
    try {
      setActionLoading(true);
      const { data } = await api.delete(`/donations/${id}`);
      if (data.success) {
        toast.success('Donation cancelled successfully.');
        navigate('/dashboard/donor');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete donation.');
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-offwhite">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-forest-800/20 border-t-forest-800 rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!donation) return null;

  const isOwner = user?._id === donation.donor?._id;
  const isNGO = user?.role === 'ngo';
  const isVolunteer = user?.role === 'volunteer';

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-forest-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-forest-900 to-forest-800 text-white p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CategoryBadge category={donation.foodCategory} />
                <StatusBadge status={donation.status} />
              </div>
              <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-emerald-200">
                Created: {new Date(donation.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {donation.foodName}
            </h1>
            <p className="mt-2 text-sm text-forest-100 max-w-2xl leading-relaxed">
              {donation.description}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-100 divide-x divide-gray-100 bg-gray-50/50">
            <div className="p-4 sm:p-6 text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Quantity
              </span>
              <span className="text-2xl font-black text-forest-800 mt-1 block">
                {donation.quantity}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">Servings</span>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Category
              </span>
              <span className="text-base font-bold text-gray-800 mt-2 block">
                {donation.foodCategory}
              </span>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Prepared At
              </span>
              <span className="text-xs font-bold text-gray-800 mt-2 block">
                {new Date(donation.preparationTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(donation.preparationTime).toLocaleDateString()}
              </span>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Pickup Deadline
              </span>
              <span className="text-xs font-bold text-amber-700 mt-2 block">
                {new Date(donation.pickupDeadline).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-[10px] text-gray-500">
                {new Date(donation.pickupDeadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Pickup & Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Address */}
              <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-forest-800 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  Pickup Location & Contact
                </div>
                <p className="text-sm font-semibold text-gray-900">{donation.pickupAddress}</p>
                <p className="text-xs text-gray-600">City: <strong>{donation.city}</strong></p>
                <p className="text-xs text-gray-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>Contact Number: {donation.contactNumber}</span>
                </p>
                <div className="pt-2 text-xs text-gray-500">
                  Donor: <strong>{donation.donor?.name || 'Verified Donor'}</strong>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-forest-800 font-bold text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  Special Instructions
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  {donation.instructions || 'No special handling instructions specified.'}
                </p>
                <div className="pt-4 flex items-center gap-2 text-xs text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Standard food safety protocols apply.</span>
                </div>
              </div>
            </div>

            {/* In-Transit Participants */}
            {(donation.requestedBy || donation.assignedVolunteer) && (
              <div className="p-6 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-4">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Assigned Redistribution Network
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {donation.requestedBy && (
                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-blue-100">
                      <Building className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">
                          Recipient Organization
                        </span>
                        <strong className="text-gray-900">
                          {donation.requestedBy.organizationName || donation.requestedBy.name}
                        </strong>
                        <p className="text-gray-500">{donation.requestedBy.address}</p>
                      </div>
                    </div>
                  )}

                  {donation.assignedVolunteer && (
                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-blue-100">
                      <Truck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">
                          Assigned Volunteer
                        </span>
                        <strong className="text-gray-900">{donation.assignedVolunteer.name}</strong>
                        <p className="text-gray-500">{donation.assignedVolunteer.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-gray-500">
                Current status:{' '}
                <strong className="text-forest-800">{donation.status}</strong>
              </span>

              <div className="flex items-center gap-3">
                {/* NGO Request Button */}
                {isNGO && donation.status === 'Available' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleRequest}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    {actionLoading ? 'Submitting Request...' : 'Request Food for Our Center'}
                  </button>
                )}

                {/* Volunteer Action Link */}
                {isVolunteer && donation.status === 'Requested' && (
                  <Link
                    to="/dashboard/volunteer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-md"
                  >
                    <Truck className="w-4 h-4" />
                    Accept Delivery in Volunteer Portal
                  </Link>
                )}

                {/* Donor Delete/Cancel */}
                {isOwner && donation.status === 'Available' && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel Donation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={actionLoading}
        title="Cancel Food Donation?"
        message="Are you sure you want to cancel this donation? It will be removed from the public listings."
        confirmText="Cancel Donation"
      />
    </div>
  );
};

export default DonationDetails;

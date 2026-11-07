import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryBadge, StatusBadge } from './Badge';
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Send,
  Building,
  CheckCircle,
} from 'lucide-react';

const DonationCard = ({
  donation,
  role,
  currentUserId,
  onEdit,
  onDelete,
  onRequest,
  onCancelRequest,
  loadingActionId,
}) => {
  const {
    _id,
    foodName,
    description,
    foodCategory,
    quantity,
    pickupDeadline,
    pickupAddress,
    city,
    status,
    donor,
    requestedBy,
    assignedVolunteer,
  } = donation;

  const isOwner = donor?._id === currentUserId || donor === currentUserId;
  const isRequestingNGO =
    requestedBy?._id === currentUserId || requestedBy === currentUserId;

  const formattedDeadline = new Date(pickupDeadline).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <CategoryBadge category={foodCategory} />
            <StatusBadge status={status} />
          </div>

          <h3 className="text-lg font-bold text-gray-900 group-hover:text-forest-800 transition line-clamp-1">
            {foodName}
          </h3>

          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card Specs */}
        <div className="px-6 py-3 bg-gray-50/60 border-y border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-gray-900">{quantity} Servings</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="truncate" title={formattedDeadline}>
              Until {formattedDeadline}
            </span>
          </div>
        </div>

        {/* Address and Details */}
        <div className="p-6 pt-4 space-y-2 text-xs text-gray-500">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="truncate">
              {pickupAddress}, <strong className="text-gray-700">{city}</strong>
            </span>
          </div>

          {donor?.name && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest-700" />
              <span>
                Donor: <strong className="text-gray-800">{donor.name}</strong>
              </span>
            </div>
          )}

          {requestedBy?.organizationName && (
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
              <Building className="w-4 h-4 shrink-0 text-blue-600" />
              <span className="truncate">
                Requested by: <strong>{requestedBy.organizationName}</strong>
              </span>
            </div>
          )}

          {assignedVolunteer?.name && (
            <div className="flex items-center gap-2 text-purple-700 bg-purple-50/60 p-2 rounded-lg border border-purple-100">
              <CheckCircle className="w-4 h-4 shrink-0 text-purple-600" />
              <span className="truncate">
                Volunteer: <strong>{assignedVolunteer.name}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 px-6 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
        <Link
          to={`/donations/${_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-forest-800 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </Link>

        {/* Role-specific Actions */}
        <div className="flex items-center gap-2">
          {/* Donor Controls */}
          {role === 'donor' && isOwner && status === 'Available' && (
            <>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(donation)}
                  className="p-1.5 text-gray-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition"
                  title="Edit Donation"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(_id)}
                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Donation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* NGO Request Action */}
          {role === 'ngo' && status === 'Available' && onRequest && (
            <button
              type="button"
              disabled={loadingActionId === _id}
              onClick={() => onRequest(_id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              {loadingActionId === _id ? 'Requesting...' : 'Request Food'}
            </button>
          )}

          {/* NGO Cancel Request */}
          {role === 'ngo' && isRequestingNGO && status === 'Requested' && onCancelRequest && (
            <button
              type="button"
              disabled={loadingActionId === _id}
              onClick={() => onCancelRequest(_id)}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;

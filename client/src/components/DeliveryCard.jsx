import React from 'react';
import { CategoryBadge, StatusBadge } from './Badge';
import {
  MapPin,
  Clock,
  Phone,
  Building,
  User,
  Truck,
  CheckCircle,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const DeliveryCard = ({
  delivery,
  role,
  onAccept,
  onPickup,
  onDeliver,
  onConfirmReceipt,
  loadingActionId,
}) => {
  const {
    _id,
    donation,
    donor,
    ngo,
    volunteer,
    pickupAddress,
    deliveryAddress,
    status,
    acceptedAt,
    pickedUpAt,
    deliveredAt,
    ngoConfirmedAt,
  } = delivery;

  const steps = [
    { label: 'Requested', done: ['Requested', 'Assigned', 'Picked Up', 'Delivered', 'Completed'].includes(status) },
    { label: 'Assigned', done: ['Assigned', 'Picked Up', 'Delivered', 'Completed'].includes(status) },
    { label: 'In Transit', done: ['Picked Up', 'Delivered', 'Completed'].includes(status) },
    { label: 'Delivered', done: ['Delivered', 'Completed'].includes(status) },
    { label: 'Completed', done: status === 'Completed' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300 p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {donation?.foodCategory && (
                <CategoryBadge category={donation.foodCategory} />
              )}
              <StatusBadge status={status} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {donation?.foodName || 'Food Delivery Package'}
            </h3>
          </div>
          <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl text-sm font-extrabold border border-emerald-100">
            {donation?.quantity || 0} Servings
          </div>
        </div>

        {/* Visual Workflow Stepper */}
        <div className="py-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    step.done
                      ? 'bg-forest-800 text-white shadow-sm ring-4 ring-forest-50'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.done ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] font-semibold text-gray-500 mt-1 hidden sm:block">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 bg-gray-50/70 rounded-xl p-4 border border-gray-100 text-xs">
          {/* Pickup (Donor) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-gray-800">
              <span className="w-2 h-2 rounded-full bg-forest-600" />
              <span>PICKUP FROM (Donor)</span>
            </div>
            <p className="font-semibold text-gray-900">{donor?.name || 'Anonymous Donor'}</p>
            <p className="text-gray-600 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>{pickupAddress}</span>
            </p>
            {donor?.phone && (
              <p className="text-gray-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <a href={`tel:${donor.phone}`} className="hover:text-forest-800">
                  {donor.phone}
                </a>
              </p>
            )}
          </div>

          {/* Delivery (NGO) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>DELIVER TO (NGO / Organization)</span>
            </div>
            <p className="font-semibold text-gray-900">
              {ngo?.organizationName || ngo?.name || 'Beneficiary Organization'}
            </p>
            <p className="text-gray-600 flex items-start gap-1">
              <Building className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>{deliveryAddress}</span>
            </p>
            {ngo?.phone && (
              <p className="text-gray-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <a href={`tel:${ngo.phone}`} className="hover:text-forest-800">
                  {ngo.phone}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Timestamps log */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400">
          {acceptedAt && <span>Accepted: {new Date(acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
          {pickedUpAt && <span>• Picked up: {new Date(pickedUpAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
          {deliveredAt && <span>• Delivered: {new Date(deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
          {ngoConfirmedAt && (
            <span className="text-emerald-600 font-semibold">
              • Verified Received: {new Date(ngoConfirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        {volunteer ? (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="w-4 h-4 text-forest-700" />
            <span>
              Assigned to: <strong>{volunteer.name}</strong>
            </span>
          </div>
        ) : (
          <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Awaiting Volunteer Hero
          </span>
        )}

        {/* Context Actions */}
        <div className="flex items-center gap-2">
          {/* Volunteer: Accept Delivery */}
          {role === 'volunteer' && status === 'Requested' && onAccept && (
            <button
              type="button"
              disabled={loadingActionId === _id}
              onClick={() => onAccept(_id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-sm"
            >
              <Truck className="w-4 h-4" />
              {loadingActionId === _id ? 'Claiming...' : 'Accept Delivery'}
            </button>
          )}

          {/* Volunteer: Mark Picked Up */}
          {role === 'volunteer' && status === 'Assigned' && onPickup && (
            <button
              type="button"
              disabled={loadingActionId === _id}
              onClick={() => onPickup(_id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition shadow-sm"
            >
              <PackageCheck className="w-4 h-4" />
              {loadingActionId === _id ? 'Updating...' : 'Mark as Picked Up'}
            </button>
          )}

          {/* Volunteer: Mark Delivered */}
          {role === 'volunteer' && status === 'Picked Up' && onDeliver && (
            <button
              type="button"
              disabled={loadingActionId === _id}
              onClick={() => onDeliver(_id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              {loadingActionId === _id ? 'Updating...' : 'Mark as Delivered'}
            </button>
          )}

          {/* NGO: Confirm Receipt */}
          {role === 'ngo' && status === 'Delivered' && onConfirmReceipt && (
            <button
              type="button"
              disabled={loadingActionId === _id}
              onClick={() => onConfirmReceipt(_id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-sm animate-pulse-subtle"
            >
              <ShieldCheck className="w-4 h-4" />
              {loadingActionId === _id ? 'Confirming...' : 'Confirm Food Receipt'}
            </button>
          )}

          {status === 'Completed' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;

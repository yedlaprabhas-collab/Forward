import React from 'react';

export const CategoryBadge = ({ category }) => {
  const configs = {
    Vegetarian: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      dot: 'bg-green-600',
    },
    'Non-Vegetarian': {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-600',
    },
    Vegan: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      dot: 'bg-emerald-600',
    },
  };

  const config = configs[category] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    dot: 'bg-gray-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {category}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const configs = {
    Available: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Available',
    },
    Requested: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      label: 'Requested by NGO',
    },
    Assigned: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      label: 'Volunteer Assigned',
    },
    'Picked Up': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'In Transit (Picked Up)',
    },
    Delivered: {
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      label: 'Delivered (Pending NGO Confirm)',
    },
    Completed: {
      bg: 'bg-forest-100 text-forest-800 border-forest-300',
      label: 'Completed',
    },
    Cancelled: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Cancelled',
    },
  };

  const config = configs[status] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg}`}
    >
      {config.label}
    </span>
  );
};

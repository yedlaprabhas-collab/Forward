import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'There is currently no data to display here.',
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-card max-w-lg mx-auto my-8">
      <div className="w-16 h-16 bg-forest-50 text-forest-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-forest-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-forest-800 hover:bg-forest-900 rounded-xl transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

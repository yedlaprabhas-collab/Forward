import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'forest', trend }) => {
  const colorMap = {
    forest: 'bg-forest-50 text-forest-800 border-forest-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  const activeColor = colorMap[color] || colorMap.forest;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-elevated transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 tracking-wide">{title}</span>
        {Icon && (
          <div className={`p-3 rounded-xl border ${activeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default StatCard;

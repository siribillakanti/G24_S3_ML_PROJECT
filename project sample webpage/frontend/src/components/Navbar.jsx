import React from 'react';

export default function Navbar({ currentRoute, onNavigate }) {
  const navItems = [
    { key: 'shop', label: 'Recommendations' },
    { key: 'recent_searches', label: 'Recent Searches' },
    { key: 'model_performance', label: 'Model Performance' },
  ];

  return (
    <header className="border-b border-[#E2E8F0] bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Project title */}
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="text-left shrink-0 min-w-0"
        >
          <span className="text-sm font-semibold text-[#19345C] leading-tight block truncate max-w-xs sm:max-w-none">
            Customer Purchase Prediction &amp; Recommendation
          </span>
          <span className="section-label block mt-0.5 hidden sm:block">
            ML Inference · 7-Day Horizon
          </span>
        </button>

        {/* Nav tabs */}
        <nav className="flex items-center gap-0.5 shrink-0">
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentRoute === key
                  ? 'bg-[#19345C] text-white'
                  : 'text-[#64748B] hover:text-[#19345C] hover:bg-[#F8FAFC]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

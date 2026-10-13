import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] py-7 mt-20">
      <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <span className="text-xs font-semibold text-[#19345C]">
            Customer Purchase Prediction &amp; Personalized Product Recommendation System
          </span>
          <span className="block section-label mt-1">
            eCommerce Behavior Dataset · HistGradientBoosting · Platt Calibration
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#94A3B8] flex items-center gap-3 shrink-0">
          <span>7-Day Horizon</span>
          <span>·</span>
          <span>Threshold 0.705</span>
        </div>
      </div>
    </footer>
  );
}

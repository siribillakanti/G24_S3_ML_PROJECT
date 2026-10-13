import React, { useState } from 'react';
import { getRecentSearches, clearRecentSearches } from '../storage';

export default function RecentSearches({ onRestoreSearch, onBackToShop }) {
  const [searches, setSearches] = useState(() => getRecentSearches());

  const handleRestore = (item) => {
    onRestoreSearch({
      categories: item.categories || [],
      keyword: item.keyword || '',
      maxPrice: item.maxPrice !== undefined ? item.maxPrice : null,
      resultCount: item.resultCount || 10,
    });
  };

  const handleClearAll = () => {
    clearRecentSearches();
    setSearches([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <button
          type="button"
          onClick={onBackToShop}
          className="app-btn-ghost mb-2"
        >
          ← Back to Recommendations
        </button>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#19345C]">Recent Searches</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Saved locally in your browser. Click any entry to restore and re-run it.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {searches.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="app-btn-secondary text-xs text-[#991B1B] border-[#FECACA] hover:bg-[#FEF2F2]"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onBackToShop}
              className="app-btn-primary text-xs"
            >
              New Search →
            </button>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="callout">
        <strong>Live inference:</strong> Restoring a search re-runs the query against
        the current ML model — probabilities are never cached.
      </div>

      {/* Empty state */}
      {searches.length === 0 && (
        <div className="app-card-flat p-12 text-center">
          <h3 className="text-base font-semibold text-[#19345C] mb-2">
            No searches yet
          </h3>
          <p className="text-xs text-[#64748B] max-w-xs mx-auto mb-5 leading-relaxed">
            Each recommendation query you run is saved here so you can restore it later.
          </p>
          <button
            type="button"
            onClick={onBackToShop}
            className="app-btn-primary text-xs"
          >
            Go to Recommendations
          </button>
        </div>
      )}

      {/* Searches list */}
      {searches.length > 0 && (
        <div className="space-y-2.5">
          {searches.map((item) => (
            <div
              key={item.id}
              className="app-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Search summary */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] text-[#64748B]">
                    {item.formattedTime}
                  </span>
                  <span className="rank-badge">
                    {item.resultCount || 10} results
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-[#334155]">
                  {/* Keyword */}
                  {item.keyword ? (
                    <span>
                      Keyword:{' '}
                      <strong className="text-[#19345C]">"{item.keyword}"</strong>
                    </span>
                  ) : (
                    <span className="text-[#94A3B8]">No keyword</span>
                  )}

                  <span className="text-[#E2E8F0]">|</span>

                  {/* Budget */}
                  <span>
                    {item.maxPrice != null ? (
                      <>Budget: <strong>≤ {item.maxPrice}</strong></>
                    ) : (
                      <span className="text-[#94A3B8]">No budget limit</span>
                    )}
                  </span>

                  <span className="text-[#E2E8F0]">|</span>

                  {/* Categories */}
                  <span>
                    {item.categories?.length > 0 ? (
                      <span className="capitalize">
                        {item.categories.join(', ')}
                      </span>
                    ) : (
                      <span className="text-[#94A3B8]">All categories</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Restore action */}
              <button
                type="button"
                onClick={() => handleRestore(item)}
                className="app-btn-secondary text-xs shrink-0"
              >
                Restore &amp; Run →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

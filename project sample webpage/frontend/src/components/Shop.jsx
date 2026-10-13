import React, { useState, useEffect, useCallback } from 'react';
import { fetchCategories, fetchRecommendations } from '../api';
import { addRecentSearch } from '../storage';

// ─── Probability colour scale ──────────────────────────────────────────────
function probColor(prob) {
  if (prob >= 0.15) return '#166534';
  if (prob >= 0.07) return '#854D0E';
  return '#19345C';
}

// ─── Single result card ────────────────────────────────────────────────────
function ProductCard({ item, rank }) {
  const prob = typeof item.purchase_probability === 'number' ? item.purchase_probability : 0;
  const probPct = (prob * 100).toFixed(1);
  // amplify bar for small probabilities so it's readable
  const barWidth = Math.min(100, Math.max(4, prob * 100 * 4));
  const colour = probColor(prob);

  return (
    <div className="app-card p-5 flex flex-col gap-4">
      {/* Row 1 – rank + category */}
      <div className="flex items-center justify-between gap-2">
        <span className="rank-badge">#{rank}</span>
        <span
          className="text-[11px] text-[#64748B] font-medium truncate"
          title={item.category_code}
        >
          {item.category_code || '—'}
        </span>
      </div>

      {/* Row 2 – product identifier */}
      <div>
        <p className="section-label mb-1">Product</p>
        <p className="font-mono text-base font-bold text-[#19345C]">
          {item.product_id}
        </p>
        {item.brand && (
          <p className="text-xs text-[#64748B] mt-0.5 capitalize">
            {item.brand}
          </p>
        )}
      </div>

      {/* Row 3 – price */}
      <div className="flex items-baseline justify-between border-t border-[#E2E8F0] pt-3">
        <span className="text-[11px] text-[#94A3B8]">Price</span>
        <span className="font-mono text-sm font-semibold text-[#1A2030]">
          {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
        </span>
      </div>

      {/* Row 4 – purchase probability */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#334155]">Purchase propensity</span>
          <span
            className="font-mono text-sm font-bold"
            style={{ color: colour }}
          >
            {probPct}%
          </span>
        </div>
        <div className="prob-bar-track">
          <div className="prob-bar-fill" style={{ width: `${barWidth}%`, backgroundColor: colour }} />
        </div>
        <p className="text-[11px] text-[#64748B]">
          Estimated 7-day purchase probability
        </p>
      </div>
    </div>
  );
}

// ─── Main Shop component ───────────────────────────────────────────────────
export default function Shop({
  initialSearchQuery,
  onNavigateToRecentSearches,
  onNavigateToModelPerformance,
}) {
  const [categories, setCategories] = useState(initialSearchQuery?.categories || []);
  const [keyword, setKeyword] = useState(initialSearchQuery?.keyword || '');
  const [maxPrice, setMaxPrice] = useState(initialSearchQuery?.maxPrice ?? null);
  const [resultCount, setResultCount] = useState(initialSearchQuery?.resultCount || 10);

  const [availableCategories, setAvailableCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const suggestedBrands = ['samsung', 'apple', 'asus', 'bosch', 'sony', 'hp', 'lenovo', 'nike'];

  // ─── Run ML inference ────────────────────────────────────────────────────
  const runSearch = useCallback(async (params, recordToHistory = true) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const payload = {
        categories: params.categories?.length > 0 ? params.categories : null,
        keyword: params.keyword || null,
        max_price: params.maxPrice && params.maxPrice > 0 ? params.maxPrice : null,
        n: params.n || 10,
      };
      const res = await fetchRecommendations(payload);
      setRecommendations(res?.recommendations ?? []);
      if (recordToHistory) {
        addRecentSearch({
          categories: params.categories,
          keyword: params.keyword,
          maxPrice: params.maxPrice,
          n: params.n,
        });
      }
    } catch {
      setError('Unable to reach the inference backend. Make sure the FastAPI server is running on port 8000.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Load categories from backend ────────────────────────────────────────
  useEffect(() => {
    fetchCategories()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.categories ?? []);
        setAvailableCategories(list.filter((c) => c && c !== 'unknown'));
      })
      .catch(() => {});
  }, []);

  // ─── Initial or restored search ───────────────────────────────────────────
  useEffect(() => {
    if (initialSearchQuery) {
      const { categories: c = [], keyword: k = '', maxPrice: p = null, resultCount: n = 10 } = initialSearchQuery;
      setCategories(c);
      setKeyword(k);
      setMaxPrice(p);
      setResultCount(n);
      runSearch({ categories: c, keyword: k, maxPrice: p, n }, false);
    } else {
      runSearch({ categories: [], keyword: '', maxPrice: null, n: 10 }, false);
    }
  }, [initialSearchQuery, runSearch]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const toggleCategory = (cat) =>
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch({
      categories,
      keyword: keyword.trim(),
      maxPrice: maxPrice ? Number(maxPrice) : null,
      n: Number(resultCount),
    });
  };

  const handleReset = () => {
    setCategories([]);
    setKeyword('');
    setMaxPrice(null);
  };

  const hasFilters = categories.length > 0 || keyword || maxPrice !== null;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-5 py-10 space-y-10">

      {/* ── Hero / intro ─────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="section-label mb-3">Machine Learning · E-Commerce</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#19345C] leading-snug">
            Customer Purchase Prediction &amp;{' '}
            <br className="hidden sm:block" />
            Personalized Product Recommendation System
          </h1>
          <p className="text-sm text-[#64748B] mt-3 leading-relaxed max-w-xl">
            Ranks catalog products by calibrated 7-day purchase probability using a{' '}
            <strong className="text-[#334155] font-medium">HistGradientBoostingClassifier</strong>{' '}
            trained on 33 behavioral features from a real e-commerce event dataset.
          </p>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={onNavigateToModelPerformance}
            className="app-btn-secondary text-xs"
          >
            Model metrics →
          </button>
          <button
            type="button"
            onClick={onNavigateToRecentSearches}
            className="app-btn-secondary text-xs"
          >
            Recent searches →
          </button>
        </div>
      </section>

      {/* ── Filter panel ─────────────────────────────────────────────────── */}
      <section className="app-card-flat">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-sm font-semibold text-[#1A2030]">Filter Parameters</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Select criteria — model ranks the entire matching catalog by purchase likelihood
            </p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="app-btn-ghost text-xs"
            >
              Reset
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-7">

          {/* Product categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-[#1A2030]">
                Product Categories
              </label>
              <span className="text-[11px] text-[#94A3B8]">
                {categories.length === 0 ? 'All' : `${categories.length} selected`}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`chip ${categories.includes(cat) ? 'active' : ''}`}
                >
                  {categories.includes(cat) && <span className="text-[9px]">✓</span>}
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Brand + budget + count */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Brand / keyword */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-semibold text-[#1A2030] block">
                Brand or Keyword
                <span className="font-normal text-[#94A3B8] ml-1">(optional)</span>
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. samsung, apple, headphones…"
                className="app-input"
              />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {suggestedBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setKeyword(keyword.toLowerCase() === b ? '' : b)}
                    className={`brand-pill ${keyword.toLowerCase() === b ? 'active' : ''}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Max price */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1A2030]">
                  Maximum Price
                  <span className="font-normal text-[#94A3B8] ml-1">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMaxPrice(maxPrice === null ? 500 : null)}
                  className="app-btn-ghost text-[11px]"
                >
                  {maxPrice === null ? 'Set limit' : 'Remove limit'}
                </button>
              </div>
              {maxPrice !== null ? (
                <input
                  type="number"
                  min="5"
                  max="5000"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 500"
                  className="app-input"
                />
              ) : (
                <div className="app-input bg-[#F8FAFC] text-[#94A3B8] cursor-default select-none">
                  No limit
                </div>
              )}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {[50, 150, 300, 600, 1200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMaxPrice(maxPrice === val ? null : val)}
                    className={`brand-pill ${maxPrice === val ? 'active' : ''}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-[#1A2030] block">Results</label>
              <select
                value={resultCount}
                onChange={(e) => setResultCount(Number(e.target.value))}
                className="app-input"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="app-btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner-white" />
                  Calculating…
                </>
              ) : (
                'Get Recommendations →'
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-md text-xs text-[#991B1B] leading-relaxed">
          <strong className="block mb-0.5">Backend unavailable</strong>
          {error}
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {loading && (
        <div className="py-20 flex flex-col items-center gap-3 text-[#64748B]">
          <div className="spinner" />
          <p className="text-xs">Scoring catalog with HistGradientBoosting…</p>
        </div>
      )}

      {/* ── Empty results ─────────────────────────────────────────────────── */}
      {!loading && !error && hasSearched && recommendations.length === 0 && (
        <div className="app-card-flat p-12 text-center">
          <h3 className="text-base font-semibold text-[#19345C] mb-2">No matches found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-5 leading-relaxed">
            No catalog items matched your filters. Try relaxing the budget limit,
            removing a keyword, or selecting all categories.
          </p>
          <button type="button" onClick={handleReset} className="app-btn-secondary text-xs">
            Clear Filters
          </button>
        </div>
      )}

      {/* ── Results grid ──────────────────────────────────────────────────── */}
      {!loading && !error && recommendations.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-[#1A2030]">
                Top {recommendations.length} Recommendations
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Ranked by calibrated purchase probability · HistGradientBoosting + Platt scaling
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((item, idx) => (
              <ProductCard
                key={item.product_id}
                item={item}
                rank={item.rank ?? idx + 1}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

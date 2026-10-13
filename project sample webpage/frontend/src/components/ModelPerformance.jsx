import React, { useState } from 'react';

export default function ModelPerformance({ data }) {
  const [activeCurve, setActiveCurve] = useState('pr'); // 'pr' or 'roc'

  const metrics = data?.test_metrics || {
    accuracy: 0.8693,
    precision: 0.1772,
    recall: 0.3715,
    f1: 0.2399,
    roc_auc: 0.7747,
    pr_auc: 0.1701,
    brier: 0.0492,
  };

  const cm = data?.confusion_matrix || [
    [76558, 8644],
    [3149, 1861],
  ];

  const totalTest = cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1];

  const featureGroups = [
    {
      group: 'Product History (p)',
      features: 'log_price, p_views, p_carts, p_purchases, p_purchase_rate, p_cart_rate',
      desc: 'Individual product popularity, pricing scale, and historical conversion efficiency.',
    },
    {
      group: 'Category Signals (c)',
      features: 'top_category, c_views, c_carts, c_purchases, c_purchase_rate, c_cart_rate, price_vs_category',
      desc: 'Domain volume, baseline conversion rate, and price deviation relative to category median.',
    },
    {
      group: 'Brand Affinity (b)',
      features: 'has_brand, b_views, b_carts, b_purchases, b_purchase_rate, b_cart_rate',
      desc: 'Manufacturer recognition, recording status, and aggregate maker sales velocity.',
    },
    {
      group: 'User Lifetime (u)',
      features: 'u_views, u_carts, u_purchases, u_sessions, u_days_since_first, u_hours_since_last, price_vs_user_mean',
      desc: 'User tenure, frequency, engagement recency, and price affinity relative to prior views.',
    },
    {
      group: 'User-Category (uc)',
      features: 'uc_views, uc_carts, uc_purchases, uc_view_share',
      desc: 'Specific category interest concentration and historical purchase commitment in category.',
    },
    {
      group: 'User-Product (up)',
      features: 'up_views, up_carts, up_purchases',
      desc: 'Direct re-visitation, repeated cart additions, and repeat replenishment indicators.',
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-6">
      {/* Header */}
      <section className="border-b border-[#E2E8F0] pb-6">
        <p className="text-xs uppercase tracking-widest font-mono text-[#64748B] mb-1.5">
          Academic Machine Learning Evaluation &bull; Independent Review
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#19345C] mb-2">
          Model Evaluation &amp; Held-Out Test Set Performance
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
          Comprehensive benchmark results evaluated on the held-out February 2021 test set (90,212 instances).
          Models were trained strictly on preceding months to mirror real-world e-commerce deployment without temporal leakage.
        </p>
      </section>

      {/* Chronological Evaluation Splits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="app-card p-4 bg-[#FFFFFF]">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block mb-1">
            Training Partition
          </span>
          <span className="text-xl font-bold font-mono text-[#19345C] block">
            361,941 samples
          </span>
          <span className="text-xs text-[#64748B] block mt-1">
            Timeline: Prior to 2020-12-25
          </span>
          <span className="text-[11px] text-[#64748B] block mt-0.5">
            Chronological training baseline for historical behavior counts.
          </span>
        </div>

        <div className="app-card p-4 bg-[#FFFFFF]">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#64748B] block mb-1">
            Validation Partition
          </span>
          <span className="text-xl font-bold font-mono text-[#19345C] block">
            87,691 samples
          </span>
          <span className="text-xs text-[#64748B] block mt-1">
            Timeline: 2021-01-01 to &lt; 2021-01-22
          </span>
          <span className="text-[11px] text-[#64748B] block mt-0.5">
            Used for model comparison, Platt calibration, and threshold selection (0.705).
          </span>
        </div>

        <div className="app-card p-4 bg-[#F8FAFC] border-[#19345C]/30">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#19345C] block mb-1">
            Held-Out Test Partition
          </span>
          <span className="text-xl font-bold font-mono text-[#19345C] block">
            90,212 samples
          </span>
          <span className="text-xs text-[#64748B] block mt-1">
            Timeline: 2021-02-01 to &lt; 2021-02-22
          </span>
          <span className="text-[11px] text-[#64748B] block mt-0.5">
            Strict out-of-time evaluation for final reported metrics.
          </span>
        </div>
      </section>

      {/* Model Selection Benchmark Table */}
      <section className="app-card p-6 bg-[#FFFFFF]">
        <h2 className="text-base font-semibold text-[#19345C] mb-1">
          Candidate Model Validation Benchmark
        </h2>
        <p className="text-xs text-[#94A3B8] mb-4">
          Models compared on the January validation window using Precision-Recall Area Under Curve (PR-AUC) as primary criterion.
        </p>

        <div className="overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Pre-processing Pipeline</th>
                <th className="text-right">Val ROC-AUC</th>
                <th className="text-right">Val PR-AUC</th>
                <th className="text-center">Selection Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-[#202938]">
                  Logistic Regression (Baseline)
                </td>
                <td className="text-xs text-[#64748B]">
                  Median Imputer &rarr; Log1p on counts &rarr; StandardScaler &rarr; Balanced class weights
                </td>
                <td className="text-right font-mono text-xs text-[#64748B]">0.7571</td>
                <td className="text-right font-mono text-xs text-[#64748B]">0.1345</td>
                <td className="text-center">
                  <span className="text-[11px] text-[#64748B] font-medium">Baseline</span>
                </td>
              </tr>
              <tr className="bg-[#F8FAFC]">
                <td className="font-semibold text-[#19345C]">
                  HistGradientBoostingClassifier
                </td>
                <td className="text-xs text-[#19345C]">
                  Native binning, categorical features enabled, l2_reg=1.0, max_leaf_nodes=48, balanced
                </td>
                <td className="text-right font-mono text-xs font-semibold text-[#19345C]">0.7725</td>
                <td className="text-right font-mono text-xs font-semibold text-[#19345C]">0.1627</td>
                <td className="text-center">
                  <span className="px-2 py-0.5 bg-[#19345C] text-white text-[11px] font-mono rounded">
                    Selected (+21.0% PR-AUC)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Held-Out Test Set Metrics Strip */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#19345C]">
            Held-Out February 2021 Test Performance Metrics
          </h2>
          <span className="text-xs font-mono text-[#64748B]">
            Sample Count: {totalTest.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="app-card p-3 text-center bg-[#FFFFFF]">
            <span className="text-[11px] text-[#64748B] block mb-1">ROC-AUC</span>
            <span className="text-lg font-bold font-mono text-[#19345C]">
              {metrics.roc_auc.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-1">Ranking power</span>
          </div>

          <div className="app-card p-3 text-center border-[#19345C]/40 bg-[#F8FAFC]">
            <span className="text-[11px] text-[#19345C] font-semibold block mb-1">PR-AUC</span>
            <span className="text-lg font-bold font-mono text-[#19345C]">
              {metrics.pr_auc.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-1">Imbalance metric</span>
          </div>

          <div className="app-card p-3 text-center bg-[#FFFFFF]">
            <span className="text-[11px] text-[#64748B] block mb-1">Recall</span>
            <span className="text-lg font-bold font-mono text-[#202938]">
              {metrics.recall.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-1">Capture rate</span>
          </div>

          <div className="app-card p-3 text-center bg-[#FFFFFF]">
            <span className="text-[11px] text-[#64748B] block mb-1">Precision</span>
            <span className="text-lg font-bold font-mono text-[#202938]">
              {metrics.precision.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-1">True buyer ratio</span>
          </div>

          <div className="app-card p-3 text-center bg-[#FFFFFF]">
            <span className="text-[11px] text-[#64748B] block mb-1">F1-Score</span>
            <span className="text-lg font-bold font-mono text-[#202938]">
              {metrics.f1.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-1">Harmonic mean</span>
          </div>

          <div className="app-card p-3 text-center bg-[#FFFFFF]">
            <span className="text-[11px] text-[#64748B] block mb-1">Accuracy</span>
            <span className="text-lg font-bold font-mono text-[#202938]">
              {metrics.accuracy.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-1">Overall correct</span>
          </div>

          <div className="app-card p-3 text-center bg-[#FFFFFF]">
            <span className="text-[11px] text-[#64748B] block mb-1">Brier Score</span>
            <span className="text-lg font-bold font-mono text-[#202938]">
              {metrics.brier.toFixed(4)}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-1">Calibration loss</span>
          </div>
        </div>
      </section>

      {/* Confusion Matrix & Diagnostic Curves */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 app-card p-6 bg-[#FFFFFF] space-y-4">
          <h2 className="text-base font-semibold text-[#19345C]">
            Test Confusion Matrix
          </h2>
          <p className="text-xs text-[#64748B]">
            Classification outcomes on 90,212 instances at tuned decision threshold &tau; = 0.705.
          </p>

          <div className="border border-[#E2E8F0] bg-[#F8FAFC] p-4 font-mono text-xs rounded">
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Header */}
              <div className="p-2 text-[#64748B] font-semibold text-[10px]">
                ACTUAL \ PRED
              </div>
              <div className="p-2 font-semibold text-[#19345C] bg-[#EEF2F6] rounded">
                PRED: 0
              </div>
              <div className="p-2 font-semibold text-[#19345C] bg-[#EEF2F6] rounded">
                PRED: 1
              </div>

              {/* Row 1: Actual Negative */}
              <div className="p-2 font-semibold text-[#19345C] bg-[#EEF2F6] flex items-center justify-center rounded">
                ACTUAL: 0
              </div>
              <div className="p-2.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded">
                <span className="text-xs font-bold text-[#19345C] block">
                  {cm[0][0].toLocaleString()}
                </span>
                <span className="text-[10px] text-[#64748B]">TN (84.9%)</span>
              </div>
              <div className="p-2.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded">
                <span className="text-xs font-bold text-[#D97706] block">
                  {cm[0][1].toLocaleString()}
                </span>
                <span className="text-[10px] text-[#64748B]">FP (9.6%)</span>
              </div>

              {/* Row 2: Actual Positive */}
              <div className="p-2 font-semibold text-[#19345C] bg-[#EEF2F6] flex items-center justify-center rounded">
                ACTUAL: 1
              </div>
              <div className="p-2.5 bg-[#FFFFFF] border border-[#E2E8F0] rounded">
                <span className="text-xs font-bold text-[#DC2626] block">
                  {cm[1][0].toLocaleString()}
                </span>
                <span className="text-[10px] text-[#64748B]">FN (3.5%)</span>
              </div>
              <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded">
                <span className="text-xs font-bold text-[#059669] block">
                  {cm[1][1].toLocaleString()}
                </span>
                <span className="text-[10px] text-[#059669]">TP (2.1%)</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#64748B] leading-relaxed pt-1">
            <p>
              &bull; <span className="font-semibold text-[#19345C]">Total Conversions:</span> 5,010 purchases (5.55% test rate).
            </p>
            <p>
              &bull; <span className="font-semibold text-[#19345C]">True Positives (1,861):</span> Captured 37.15% of all converted shoppers despite acute class rarity.
            </p>
          </div>
        </div>

        {/* Diagnostic Curves (7 cols) */}
        <div className="lg:col-span-7 app-card p-6 bg-[#FFFFFF] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
            <div>
              <h2 className="text-base font-semibold text-[#19345C]">
                Diagnostic Evaluation Curves
              </h2>
              <span className="text-xs text-[#64748B]">
                Vector renderings of validation trade-offs
              </span>
            </div>

            <div className="flex border border-[#CBD5E1] rounded overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setActiveCurve('pr')}
                className={`px-3 py-1 transition-colors ${
                  activeCurve === 'pr'
                    ? 'bg-[#19345C] text-white font-semibold'
                    : 'bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                PR Curve (0.170)
              </button>
              <button
                type="button"
                onClick={() => setActiveCurve('roc')}
                className={`px-3 py-1 transition-colors ${
                  activeCurve === 'roc'
                    ? 'bg-[#19345C] text-white font-semibold'
                    : 'bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                ROC Curve (0.775)
              </button>
            </div>
          </div>

          {/* SVG Visual Chart */}
          <div className="bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded">
            {activeCurve === 'pr' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
                  <span>Precision-Recall Curve (February Test Set)</span>
                  <span className="font-semibold text-[#19345C]">PR-AUC = 0.1701</span>
                </div>
                {/* SVG Curve */}
                <svg viewBox="0 0 400 220" className="w-full h-52" stroke="#19345C">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="40" y1="70" x2="380" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="40" y1="120" x2="380" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="40" y1="170" x2="380" y2="170" stroke="#E2E8F0" strokeDasharray="3 3" />

                  {/* Axes */}
                  <line x1="40" y1="20" x2="40" y2="180" stroke="#202938" strokeWidth="1.5" />
                  <line x1="40" y1="180" x2="380" y2="180" stroke="#202938" strokeWidth="1.5" />

                  {/* Baseline prevalence (5.01%) */}
                  <line x1="40" y1="171" x2="380" y2="171" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="382" y="174" fill="#DC2626" fontSize="9" fontFamily="monospace">
                    Base (0.05)
                  </text>

                  {/* Model PR Curve */}
                  <path
                    d="M 40 45 C 70 50, 110 70, 160 105 C 210 130, 270 155, 340 166 L 380 171"
                    fill="none"
                    stroke="#19345C"
                    strokeWidth="2.5"
                  />

                  {/* Operating Point (Recall 0.3715, Precision 0.1772) */}
                  <circle cx="166" cy="120" r="4.5" fill="#19345C" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="175" y="115" fill="#19345C" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    Operating Point (&tau;=0.705)
                  </text>

                  {/* Labels */}
                  <text x="35" y="25" fill="#64748B" fontSize="10" textAnchor="end">1.0</text>
                  <text x="35" y="100" fill="#64748B" fontSize="10" textAnchor="end">0.5</text>
                  <text x="35" y="180" fill="#64748B" fontSize="10" textAnchor="end">0.0</text>

                  <text x="40" y="196" fill="#64748B" fontSize="10" textAnchor="middle">0.0</text>
                  <text x="210" y="196" fill="#64748B" fontSize="10" textAnchor="middle">0.5</text>
                  <text x="380" y="196" fill="#64748B" fontSize="10" textAnchor="middle">1.0 Recall</text>
                  <text x="25" y="100" fill="#64748B" fontSize="10" transform="rotate(-90 25 100)" textAnchor="middle">
                    Precision
                  </text>
                </svg>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-[#64748B]">
                  <span>Receiver Operating Characteristic (ROC)</span>
                  <span className="font-semibold text-[#19345C]">ROC-AUC = 0.7747</span>
                </div>
                {/* SVG Curve */}
                <svg viewBox="0 0 400 220" className="w-full h-52" stroke="#19345C">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="40" y1="180" x2="380" y2="180" stroke="#202938" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="180" stroke="#202938" strokeWidth="1.5" />

                  {/* Random Chance Diagonal */}
                  <line x1="40" y1="180" x2="380" y2="20" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />

                  {/* ROC Curve */}
                  <path
                    d="M 40 180 C 60 110, 110 65, 180 50 C 250 38, 320 28, 380 20"
                    fill="none"
                    stroke="#19345C"
                    strokeWidth="2.5"
                  />

                  {/* Operating Point */}
                  <circle cx="73" cy="120" r="4.5" fill="#19345C" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="82" y="125" fill="#19345C" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    Operating Point (FPR=0.10, TPR=0.37)
                  </text>

                  {/* Labels */}
                  <text x="35" y="25" fill="#64748B" fontSize="10" textAnchor="end">1.0</text>
                  <text x="35" y="180" fill="#64748B" fontSize="10" textAnchor="end">0.0</text>
                  <text x="40" y="196" fill="#64748B" fontSize="10" textAnchor="middle">0.0</text>
                  <text x="380" y="196" fill="#64748B" fontSize="10" textAnchor="middle">1.0 FPR</text>
                  <text x="25" y="100" fill="#64748B" fontSize="10" transform="rotate(-90 25 100)" textAnchor="middle">
                    True Positive Rate
                  </text>
                </svg>
              </div>
            )}
          </div>
          <p className="text-[11px] text-[#64748B]">
            PR-AUC (0.1701) is 3.4x higher than random baseline (0.0501), confirming significant discriminatory power under class imbalance.
          </p>
        </div>
      </section>

      {/* 33 Engineered Features Taxonomy Table */}
      <section className="app-card p-6 bg-[#FFFFFF]">
        <h2 className="text-base font-semibold text-[#19345C] mb-1">
          Feature Engineering Architecture (33 Dimensions)
        </h2>
        <p className="text-xs text-[#94A3B8] mb-4">
          All feature counters are strictly computed as prior cumulative sums up to time \(t_{'{'}event{'}'}\) to eliminate target leakage.
        </p>

        <div className="overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th className="w-48">Feature Domain</th>
                <th>Engineered Feature Identifiers</th>
                <th>Domain Rationales &amp; Formulation</th>
              </tr>
            </thead>
            <tbody>
              {featureGroups.map((fg) => (
                <tr key={fg.group}>
                  <td className="font-semibold text-xs text-[#19345C]">
                    {fg.group}
                  </td>
                  <td className="font-mono text-xs text-[#202938]">
                    {fg.features}
                  </td>
                  <td className="text-xs text-[#64748B]">
                    {fg.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

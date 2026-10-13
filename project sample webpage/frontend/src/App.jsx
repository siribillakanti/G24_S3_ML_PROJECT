import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Shop from './components/Shop';
import RecentSearches from './components/RecentSearches';
import ModelPerformance from './components/ModelPerformance';
import Footer from './components/Footer';
import { fetchOverview } from './api';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('shop');
  const [restoredSearchQuery, setRestoredSearchQuery] = useState(null);
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    fetchOverview()
      .then(setOverviewData)
      .catch(() => {});
  }, []);

  const handleNavigate = (route) => setCurrentRoute(route);

  const handleRestoreSearch = (searchData) => {
    setRestoredSearchQuery(searchData);
    setCurrentRoute('shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A2030]">
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      <main className="flex-1 w-full">
        {currentRoute === 'shop' && (
          <Shop
            initialSearchQuery={restoredSearchQuery}
            onNavigateToRecentSearches={() => setCurrentRoute('recent_searches')}
            onNavigateToModelPerformance={() => setCurrentRoute('model_performance')}
          />
        )}

        {currentRoute === 'recent_searches' && (
          <RecentSearches
            onRestoreSearch={handleRestoreSearch}
            onBackToShop={() => setCurrentRoute('shop')}
          />
        )}

        {currentRoute === 'model_performance' && (
          <div className="max-w-6xl mx-auto px-5 py-10">
            <button
              type="button"
              onClick={() => setCurrentRoute('shop')}
              className="app-btn-ghost mb-6"
            >
              ← Back to Recommendations
            </button>
            <ModelPerformance data={overviewData} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

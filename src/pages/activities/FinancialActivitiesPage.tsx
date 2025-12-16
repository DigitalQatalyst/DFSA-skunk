/**
 * Financial Activities Marketplace Page
 * Main page for browsing and selecting DFSA financial services activities
 *
 * COMPLIANCE: Uses formal, neutral language per DFSA operating rules
 * ACCESSIBILITY: WCAG 2.1 AA compliant with keyboard navigation
 * LANGUAGE: British English spelling
 *
 * Features:
 * - Multi-dimensional filtering (regime, pathway, category, capital, time)
 * - Full-text search across activities
 * - URL query param synchronization for deep linking
 * - Activity selection tracking
 * - Responsive grid layout
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer/Footer';
import { FinancialActivityCard } from '../../components/activities';
import { financialActivities, searchActivities } from '../../data/dfsa/financialActivities';
import { FinancialActivity, PrudentialCategory, RegimeType, PathwayId } from '../../types/dfsa-activities';
import { financialActivitiesConfig } from '../../config/financialActivitiesConfig';

/**
 * FinancialActivitiesPage Component
 */
export const FinancialActivitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State Management
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRegime, setSelectedRegime] = useState<string | null>(
    searchParams.get('regime') || null
  );
  const [selectedPathways, setSelectedPathways] = useState<string[]>(
    searchParams.get('pathways')?.split(',').filter(Boolean) || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  );
  const [selectedCapitalRanges, setSelectedCapitalRanges] = useState<string[]>(
    searchParams.get('capital')?.split(',').filter(Boolean) || []
  );
  const [selectedProcessingTimes, setSelectedProcessingTimes] = useState<string[]>(
    searchParams.get('processingTime')?.split(',').filter(Boolean) || []
  );
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync URL with filters
  useEffect(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params.search = searchQuery;
    if (selectedRegime && selectedRegime !== 'all') params.regime = selectedRegime;
    if (selectedPathways.length > 0) params.pathways = selectedPathways.join(',');
    if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
    if (selectedCapitalRanges.length > 0) params.capital = selectedCapitalRanges.join(',');
    if (selectedProcessingTimes.length > 0)
      params.processingTime = selectedProcessingTimes.join(',');

    setSearchParams(params, { replace: true });
  }, [
    searchQuery,
    selectedRegime,
    selectedPathways,
    selectedCategories,
    selectedCapitalRanges,
    selectedProcessingTimes,
    setSearchParams,
  ]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let results = [...financialActivities];

    // Search filter
    if (searchQuery.trim()) {
      results = searchActivities(searchQuery);
    }

    // Regime filter
    if (selectedRegime && selectedRegime !== 'all') {
      const regimeMap: Record<string, RegimeType> = {
        'authorised-firm': 'Authorised Firm',
        ami: 'AMI',
        'representative-office': 'Representative Office',
      };
      const regime = regimeMap[selectedRegime];
      if (regime) {
        results = results.filter((activity) =>
          activity.applicableRegimes.includes(regime)
        );
      }
    }

    // Pathway filter
    if (selectedPathways.length > 0) {
      results = results.filter((activity) =>
        activity.applicablePathways.some((pathway) =>
          selectedPathways.includes(pathway)
        )
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const categoryMap: Record<string, PrudentialCategory> = {
        'cat-1': 'Cat 1',
        'cat-2': 'Cat 2',
        'cat-3a': 'Cat 3A',
        'cat-3b': 'Cat 3B',
        'cat-3c': 'Cat 3C',
        'cat-3d': 'Cat 3D',
        'cat-4': 'Cat 4',
        'cat-5': 'Cat 5',
      };
      const categories = selectedCategories.map((id) => categoryMap[id]);
      results = results.filter((activity) =>
        categories.includes(activity.prudentialCategory)
      );
    }

    // Capital range filter
    if (selectedCapitalRanges.length > 0) {
      const capitalRanges = selectedCapitalRanges.map(
        (id) =>
          financialActivitiesConfig.filterCategories
            .find((cat) => cat.id === 'capital')
            ?.options.find((opt: any) => opt.id === id)?.range
      );

      results = results.filter((activity) =>
        capitalRanges.some(
          (range: any) =>
            range &&
            activity.baseCapitalRequirement.amount >= range.min &&
            activity.baseCapitalRequirement.amount <= range.max
        )
      );
    }

    // Processing time filter
    if (selectedProcessingTimes.length > 0) {
      const timeRanges = selectedProcessingTimes.map(
        (id) =>
          financialActivitiesConfig.filterCategories
            .find((cat) => cat.id === 'processing-time')
            ?.options.find((opt: any) => opt.id === id)?.range
      );

      results = results.filter((activity) =>
        timeRanges.some(
          (range: any) =>
            range &&
            activity.processingTime.days >= range.min &&
            activity.processingTime.days <= range.max
        )
      );
    }

    return results;
  }, [
    searchQuery,
    selectedRegime,
    selectedPathways,
    selectedCategories,
    selectedCapitalRanges,
    selectedProcessingTimes,
  ]);

  // Handle activity selection
  const handleAddToApplication = (activity: FinancialActivity) => {
    if (selectedActivities.includes(activity.id)) {
      setSelectedActivities(selectedActivities.filter((id) => id !== activity.id));
    } else {
      setSelectedActivities([...selectedActivities, activity.id]);
    }
  };

  // Handle view details
  const handleViewDetails = (activity: FinancialActivity) => {
    console.log('View details:', activity);
    // TODO: Open details modal or navigate to details page
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegime(null);
    setSelectedPathways([]);
    setSelectedCategories([]);
    setSelectedCapitalRanges([]);
    setSelectedProcessingTimes([]);
  };

  // Count active filters
  const activeFilterCount =
    (selectedRegime && selectedRegime !== 'all' ? 1 : 0) +
    selectedPathways.length +
    selectedCategories.length +
    selectedCapitalRanges.length +
    selectedProcessingTimes.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-[#b82933]">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link to="/marketplace" className="hover:text-[#b82933]">
                Marketplace
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="font-medium text-gray-900">Financial Activities</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {financialActivitiesConfig.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {financialActivitiesConfig.description}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities by name, code, or module..."
              className="
                block w-full pl-10 pr-10 py-3
                border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-[#b82933] focus:border-[#b82933]
                text-gray-900 placeholder-gray-500
              "
              aria-label="Search financial activities"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="
              w-full flex items-center justify-between
              px-4 py-3 bg-white border border-gray-300 rounded-lg
              hover:bg-gray-50
            "
          >
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <span className="font-medium">
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showMobileFilters ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Layout: Filters + Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside
            className={`
              lg:block lg:w-80 flex-shrink-0
              ${showMobileFilters ? 'block' : 'hidden'}
            `}
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-[#b82933] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Regime Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Regulatory Regime
                  </h3>
                  <div className="space-y-2">
                    {financialActivitiesConfig.filterCategories
                      .find((cat) => cat.id === 'regime')
                      ?.options.map((option: any) => (
                        <label key={option.id} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="regime"
                            value={option.id}
                            checked={selectedRegime === option.id}
                            onChange={(e) => setSelectedRegime(e.target.value)}
                            className="w-4 h-4 text-[#b82933] border-gray-300 focus:ring-[#b82933]"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Pathway Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Authorisation Pathway
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {financialActivitiesConfig.filterCategories
                      .find((cat) => cat.id === 'pathway')
                      ?.options.map((option: any) => (
                        <label key={option.id} className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={selectedPathways.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPathways([...selectedPathways, option.id]);
                              } else {
                                setSelectedPathways(
                                  selectedPathways.filter((id) => id !== option.id)
                                );
                              }
                            }}
                            className="w-4 h-4 mt-0.5 text-[#b82933] border-gray-300 rounded focus:ring-[#b82933]"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Prudential Category
                  </h3>
                  <div className="space-y-2">
                    {financialActivitiesConfig.filterCategories
                      .find((cat) => cat.id === 'category')
                      ?.options.map((option: any) => (
                        <label key={option.id} className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={selectedCategories.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, option.id]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter((id) => id !== option.id)
                                );
                              }
                            }}
                            className="w-4 h-4 mt-0.5 text-[#b82933] border-gray-300 rounded focus:ring-[#b82933]"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {option.name}
                            {option.description && (
                              <span className="block text-xs text-gray-500">
                                {option.description}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Capital Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Base Capital Requirement
                  </h3>
                  <div className="space-y-2">
                    {financialActivitiesConfig.filterCategories
                      .find((cat) => cat.id === 'capital')
                      ?.options.map((option: any) => (
                        <label key={option.id} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={selectedCapitalRanges.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCapitalRanges([
                                  ...selectedCapitalRanges,
                                  option.id,
                                ]);
                              } else {
                                setSelectedCapitalRanges(
                                  selectedCapitalRanges.filter((id) => id !== option.id)
                                );
                              }
                            }}
                            className="w-4 h-4 text-[#b82933] border-gray-300 rounded focus:ring-[#b82933]"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Processing Time Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Processing Time</h3>
                  <div className="space-y-2">
                    {financialActivitiesConfig.filterCategories
                      .find((cat) => cat.id === 'processing-time')
                      ?.options.map((option: any) => (
                        <label key={option.id} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={selectedProcessingTimes.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProcessingTimes([
                                  ...selectedProcessingTimes,
                                  option.id,
                                ]);
                              } else {
                                setSelectedProcessingTimes(
                                  selectedProcessingTimes.filter((id) => id !== option.id)
                                );
                              }
                            }}
                            className="w-4 h-4 text-[#b82933] border-gray-300 rounded focus:ring-[#b82933]"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Activity Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
                {selectedActivities.length > 0 && (
                  <span className="ml-2 text-[#b82933] font-medium">
                    ({selectedActivities.length} selected)
                  </span>
                )}
              </p>
            </div>

            {/* Activity Grid */}
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <FinancialActivityCard
                    key={activity.id}
                    activity={activity}
                    onAddToApplication={handleAddToApplication}
                    onViewDetails={handleViewDetails}
                    isSelected={selectedActivities.includes(activity.id)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {financialActivitiesConfig.emptyState.noResults.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {financialActivitiesConfig.emptyState.noResults.description}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      px-4 py-2 bg-[#b82933] text-white rounded-lg
                      hover:bg-[#a02229]
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b82933]
                    "
                  >
                    {financialActivitiesConfig.emptyState.noResults.action}
                  </button>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-gray-100 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Disclaimer:</strong> {financialActivitiesConfig.disclaimers.general}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FinancialActivitiesPage;

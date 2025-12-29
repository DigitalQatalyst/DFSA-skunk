import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  DownloadIcon,
  PlusIcon,
  BookOpenIcon,
  FileTextIcon,
  VideoIcon,
  HelpCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapIcon,
  EyeIcon,
  ClockIcon,
  ThumbsUpIcon,
  TrendingUpIcon,
} from "lucide-react";
import { HelpArticleDrawer } from "./HelpArticleDrawe";
import { HelpArticleModal } from "./HelpArticleModal";
import { PageLayout } from "../PageLayout";
import { Can } from "../RBAC";
import {
  useHelpArticlesQuery,
  useHelpArticleDetails,
  useMarkHelpful,
} from "../../hooks/useHelpCenter";
import type {
  HelpCenterArticle,
  HelpCenterDifficulty,
  HelpCenterType,
} from "../../types/helpCenter";

type HelpArticle = HelpCenterArticle;
export const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Most Popular");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, typeFilter, difficultyFilter, sortOrder, searchQuery, itemsPerPage]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);
  const queryFilters = {
    search: searchQuery || undefined,
    category: categoryFilter !== "All" ? categoryFilter : undefined,
    type: typeFilter !== "All" ? (typeFilter as HelpCenterType) : undefined,
    difficulty:
      difficultyFilter !== "All" ? (difficultyFilter as HelpCenterDifficulty) : undefined,
    sort: sortOrder === "Recently Updated" ? "recent" : "popular",
    page: currentPage,
    pageSize: itemsPerPage,
  };
  const { data, isLoading, isError } = useHelpArticlesQuery(queryFilters);
  const articlesData = data?.items ?? [];
  let articles = [...articlesData];
  if (sortOrder === "Most Helpful") {
    articles.sort((a, b) => b.helpful - a.helpful);
  } else if (sortOrder === "Most Popular") {
    articles.sort((a, b) => b.views - a.views);
  } else if (sortOrder === "Recently Updated") {
    articles.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }
  const paginatedArticles = articles;
  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / (data.pageSize || itemsPerPage)))
    : 1;
  const currentPageFromData = data?.page ?? currentPage;
  const pageSizeFromData = data?.pageSize || itemsPerPage;
  const totalItems = data?.total ?? paginatedArticles.length;
  const showingStart = paginatedArticles.length
    ? (currentPageFromData - 1) * pageSizeFromData + 1
    : 0;
  const showingEnd = paginatedArticles.length
    ? Math.min(totalItems, showingStart + paginatedArticles.length - 1)
    : 0;
  const recentArticles = [...articlesData]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )
    .slice(0, 3);
  const topRatedArticles = [...articlesData]
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, 3);
  const uniqueCategories = Array.from(
    new Set(articlesData.map((a) => a.category).filter(Boolean))
  );
  const uniqueTypes = Array.from(new Set(articlesData.map((a) => a.type)));
  const uniqueDifficulties = Array.from(
    new Set(articlesData.map((a) => a.difficulty))
  );
  const { data: selectedArticleDetail } = useHelpArticleDetails(
    selectedArticleId ?? undefined
  );
  const selectedArticleFromList =
    articles.find((a) => a.id === selectedArticleId) || null;
  const selectedArticle = selectedArticleDetail || selectedArticleFromList;

  useEffect(() => {
    if (!isDrawerOpen) {
      setIsModalOpen(false);
    }
    if (!selectedArticle) {
      setIsModalOpen(false);
    }
  }, [isDrawerOpen, selectedArticle]);
  const markHelpful = useMarkHelpful();
  const handleHelpful = (articleId: string, delta: 1 | -1) => {
    if (!articleId) return;
    markHelpful.mutate({ id: articleId, action: delta });
  };
  const handleCardClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedArticleId(null);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  // Handle clear filters
  const handleClearFilters = () => {
    setCategoryFilter("All");
    setTypeFilter("All");
    setDifficultyFilter("All");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };
  // Get icon for article type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Guide":
        return <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5" />;
      case "Video":
        return <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5" />;
      case "FAQ":
        return <HelpCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />;
      case "Walkthrough":
        return <MapIcon className="h-4 w-4 sm:h-5 sm:w-5" />;
      default:
        return <FileTextIcon className="h-4 w-4 sm:h-5 sm:w-5" />;
    }
  };
  // Get color for article type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Guide":
        return "bg-blue-100 text-blue-600";
      case "Video":
        return "bg-purple-100 text-purple-600";
      case "FAQ":
        return "bg-emerald-100 text-emerald-600";
      case "Walkthrough":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  const formatCategory = (category?: string | null) =>
    category && category.trim().length ? category : "General";
  return (
    <PageLayout
      title="Help Center"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Help Center", current: true },
      ]}
    >
      <div className="px-4 sm:px-6 pb-20">
        {/* Page Description and Actions */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                Find answers, guides, and resources to help you get the most out
                of the platform.
              </p>
            </div>
            <Can I="create" an="user-help-center">
              <button
                onClick={() => navigate("/dashboard/content-form")}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 w-full sm:w-auto"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add Article
              </button>
            </Can>
          </div>
        </div>

        {/* Quick Links - Recent Articles & Top Rated (All screen sizes) */}
        {isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load help center articles. Please try again later.
          </div>
        )}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Articles */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUpIcon className="h-4 w-4 mr-2 text-blue-600" />
                Recent Articles
              </h3>
              <div className="space-y-3">
                {isLoading ? (
                  <p className="text-xs text-gray-500">Loading...</p>
                ) : recentArticles.length > 0 ? (
                  recentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => handleCardClick(article.id)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCardClick(article.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`p-1 rounded flex-shrink-0 ${getTypeColor(
                            article.type
                          )}`}
                        >
                          {getTypeIcon(article.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {formatCategory(article.category)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No recent articles yet.</p>
                )}
              </div>
            </div>

            {/* Top Rated */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <ThumbsUpIcon className="h-4 w-4 mr-2 text-amber-600" />
                Top Rated
              </h3>
              <div className="space-y-3">
                {isLoading ? (
                  <p className="text-xs text-gray-500">Loading...</p>
                ) : topRatedArticles.length > 0 ? (
                  topRatedArticles.map((article) => (
                    <div
                      key={article.id}
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => handleCardClick(article.id)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCardClick(article.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`p-1 rounded flex-shrink-0 ${getTypeColor(
                            article.type
                          )}`}
                        >
                          {getTypeIcon(article.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {article.helpful} helpful
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatCategory(article.category)}
                          </span>
                        </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No top rated articles yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Toolbar with Wrapping Filters */}
          <div className="sticky top-[3.5rem] bg-gray-50 z-20 pb-3">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex flex-col gap-4">
                {/* Search Bar - Full Width */}
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
                    placeholder="Search help articles..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>

                {/* Filter Chips - Wrapping Layout */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="w-full sm:w-auto sm:min-w-[140px] relative">
                    <select
                      className="appearance-none w-full bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      {uniqueCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto sm:min-w-[120px] relative">
                    <select
                      className="appearance-none w-full bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto sm:min-w-[120px] relative">
                    <select
                      className="appearance-none w-full bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                    >
                      <option value="All">All Levels</option>
                      {uniqueDifficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="w-full sm:w-auto sm:min-w-[140px] relative">
                    <select
                      className="appearance-none w-full bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="Most Popular">Most Popular</option>
                      <option value="Most Helpful">Most Helpful</option>
                      <option value="Recently Updated">Recently Updated</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </div>

                  <button
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-400 cursor-not-allowed"
                    disabled
                    title="Export coming soon"
                  >
                    <DownloadIcon className="h-4 w-4 sm:mr-2" />
                    <span className="sm:inline">Export (Coming Soon)</span>
                  </button>

                  {(categoryFilter !== "All" ||
                    typeFilter !== "All" ||
                    difficultyFilter !== "All" ||
                    searchQuery) && (
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-2">
              <p className="text-sm text-gray-500">Loading help center articles...</p>
            </div>
          ) : paginatedArticles.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600 font-medium">
                Showing {showingStart}-{showingEnd} of {totalItems} articles
              </div>

              {/* Responsive Grid with Proper Breakpoints */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {paginatedArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer flex flex-col h-full"
                    onClick={() => handleCardClick(article.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View article: ${article.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick(article.id);
                      }
                    }}
                  >
                    {/* Icon and Type */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`p-2 rounded-lg ${getTypeColor(
                          article.type
                        )} flex-shrink-0`}
                      >
                        {getTypeIcon(article.type)}
                      </div>
                      {article.tags?.includes("Popular") && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-grow">
                      {article.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3 min-h-[24px]">
                      {(article.tags || []).slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags && article.tags.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          +{article.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{article.readTime}</span>
                        </span>
                        <span className="flex items-center">
                          <EyeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{article.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-2">
              <div className="mx-auto max-w-md">
                <div className="bg-gray-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
                  <FilterIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your search or filter criteria to find what
                  you're looking for.
                </p>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                <label
                  htmlFor="items-per-page"
                  className="text-sm text-gray-600 mr-2 whitespace-nowrap"
                >
                  Items per page:
                </label>
                <select
                  id="items-per-page"
                  className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center justify-center">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 text-sm border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors duration-150 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700"
                    }`}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  <div className="hidden sm:flex">
                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, i) => i + 1
                    )
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, i, arr) => (
                        <Fragment key={page}>
                          {i > 0 && arr[i - 1] !== page - 1 && (
                            <span className="px-3 py-1.5 text-sm text-gray-500 border-t border-b border-gray-300">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1.5 text-sm border-t border-b border-gray-300 ${
                              currentPage === page
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "hover:bg-gray-50 text-gray-700"
                            } ${
                              i === 0 && page !== 1
                                ? "border-l border-gray-300"
                                : ""
                            }`}
                          >
                            {page}
                          </button>
                        </Fragment>
                      ))}
                  </div>

                  <div className="flex sm:hidden items-center border-t border-b border-gray-300 px-3 py-1.5">
                    <span className="text-xs text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 text-sm border border-gray-300 rounded-r-md hover:bg-gray-50 transition-colors duration-150 ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700"
                    }`}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-sm text-gray-600 text-center">
                  Showing {showingStart}-{showingEnd} of {totalItems}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        {/* <div className="fixed bottom-10 sm:bottom-6 right-4 sm:right-6 z-30">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Add new article"
          onClick={() => navigate('/dashboard/content-form')}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div> */}

        {/* Help Article Drawer */}
        <HelpArticleDrawer
          key={selectedArticle?.id || "closed"}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          article={selectedArticle}
          onHelpful={handleHelpful}
          helpfulLoading={markHelpful.isPending}
          onOpenFullArticle={() => setIsModalOpen(true)}
        />
        <HelpArticleModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          article={selectedArticle}
          onHelpful={handleHelpful}
          helpfulLoading={markHelpful.isPending}
        />
      </div>
    </PageLayout>
  );
};

/**
 * ProfileTabs Component
 * Tab navigation for profile domains
 * Purely presentational component
 */

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { CheckCircleIcon } from 'lucide-react';

export interface TabInfo {
  id: string;
  title: string;
  completion?: number;
  mandatoryCompletion?: number;
}

interface ProfileTabsProps {
  tabs: TabInfo[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;
  canScrollLeft?: boolean;
  onScrollLeft?: () => void;
  canScrollRight?: boolean;
  onScrollRight?: () => void;
  showMoreMenu?: boolean;
  onToggleMoreMenu?: () => void;
  tabsRef?: React.RefObject<HTMLDivElement>;
}

export function ProfileTabs({
  tabs,
  activeTabIndex,
  onTabChange,
  canScrollLeft = false,
  onScrollLeft,
  canScrollRight = false,
  onScrollRight,
  showMoreMenu = false,
  onToggleMoreMenu,
  tabsRef,
}: ProfileTabsProps) {
  return (
    <div className="hidden md:block border-b border-gray-200 bg-gray-50">
      <div className="relative py-3 md:py-4 max-w-full">
        <div className="flex items-center px-4">
          {/* Left Arrow */}
          {onScrollLeft && (
            <button
              className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors mr-2"
              onClick={onScrollLeft}
              disabled={!canScrollLeft}
              aria-label="Scroll tabs left"
            >
              <ChevronLeftIcon size={16} />
            </button>
          )}

          {/* Scrollable Tabs Container */}
          <div
            ref={tabsRef}
            className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth min-w-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            role="tablist"
          >
            <div className="flex space-x-1 min-w-max">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap flex items-center rounded-lg transition-all duration-200 ${
                    activeTabIndex === index
                      ? 'bg-white shadow-sm border'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  style={
                    activeTabIndex === index
                      ? { color: '#9b1823', borderColor: '#9b18232a' }
                      : {}
                  }
                  onClick={() => onTabChange(index)}
                  role="tab"
                  aria-selected={activeTabIndex === index}
                  id={`tab-${tab.id}`}
                  aria-controls={`panel-${tab.id}`}
                >
                  <span className="truncate max-w-[120px] md:max-w-none">
                    {tab.title}
                  </span>
                  <div className="flex items-center ml-1 md:ml-2 flex-shrink-0">
                    {tab.completion !== undefined && (
                      <>
                        {tab.completion > 0 &&
                        tab.mandatoryCompletion === 100 ? (
                          <span className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                            <CheckCircleIcon
                              size={12}
                              className="mr-0.5 md:mr-1"
                            />
                            <span className="hidden sm:inline">
                              {tab.completion}%
                            </span>
                          </span>
                        ) : tab.completion > 0 &&
                          (tab.mandatoryCompletion || 0) > 0 ? (
                          <span className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-0.5 md:mr-1"></span>
                            <span className="hidden sm:inline">
                              {tab.completion}%
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            <span className="w-2 h-2 rounded-full bg-gray-400 mr-0.5 md:mr-1"></span>
                            <span className="hidden sm:inline">
                              {tab.completion || 0}%
                            </span>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {onScrollRight && (
            <button
              className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors ml-2"
              onClick={onScrollRight}
              disabled={!canScrollRight}
              aria-label="Scroll tabs right"
            >
              <ChevronRightIcon size={16} />
            </button>
          )}

          {/* More Menu */}
          {onToggleMoreMenu && (
            <div className="relative flex-shrink-0 ml-2">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                onClick={onToggleMoreMenu}
                aria-label="Show hidden tabs"
                aria-expanded={showMoreMenu}
              >
                <MoreHorizontalIcon size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




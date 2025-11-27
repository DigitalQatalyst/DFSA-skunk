import React, { useState } from 'react';
import { SearchIcon, CalendarIcon, XIcon } from 'lucide-react';
import { DateRangeFilter, ServiceRequestStatus } from '../../types';
interface ServiceRequestsFiltersProps {
    currentStatus: ServiceRequestStatus | 'all';
    onStatusChange: (status: ServiceRequestStatus | 'all') => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    dateRange: DateRangeFilter;
    onDateRangeChange: (range: DateRangeFilter) => void;
}
export function ServiceRequestsFilters({
    currentStatus,
    onStatusChange,
    searchQuery,
    onSearchChange,
    dateRange,
    onDateRangeChange,
}: ServiceRequestsFiltersProps) {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const statusOptions: Array<{
        value: ServiceRequestStatus | 'all';
        label: string;
    }> = [
            {
                value: 'all',
                label: 'All',
            },
            {
                value: 'draft',
                label: 'Draft',
            },
            {
                value: 'under-review',
                label: 'Under Review',
            },
            {
                value: 'approved',
                label: 'Approved',
            },
            {
                value: 'rejected',
                label: 'Rejected',
            },
        ];
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDateRangeChange({
            ...dateRange,
            startDate: e.target.value || null,
        });
    };
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDateRangeChange({
            ...dateRange,
            endDate: e.target.value || null,
        });
    };
    const clearDateRange = () => {
        onDateRangeChange({
            startDate: null,
            endDate: null,
        });
        setIsDatePickerOpen(false);
    };
    return (
        <div className="border-b border-gray-200 p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Status filter tiles - scrollable row on mobile, row on desktop */}
                <div className="overflow-x-auto pb-1 -mx-1 sm:mx-0">
                    {/* Mobile: Horizontal scrollable row with smaller buttons */}
                    <div className="flex space-x-1 px-1 sm:hidden">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onStatusChange(option.value)}
                                className={`px-2.5 py-1.5 text-xs font-medium rounded-md flex-shrink-0 ${currentStatus === option.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                aria-pressed={currentStatus === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    {/* Desktop: horizontal row */}
                    <div className="hidden sm:flex sm:space-x-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onStatusChange(option.value)}
                                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${currentStatus === option.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                aria-pressed={currentStatus === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
                    {/* Date range picker */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            aria-expanded={isDatePickerOpen}
                            aria-haspopup="true"
                        >
                            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="truncate max-w-[120px] sm:max-w-none">
                                {dateRange.startDate && dateRange.endDate
                                    ? `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`
                                    : 'Date Range'}
                            </span>
                            {(dateRange.startDate || dateRange.endDate) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearDateRange();
                                    }}
                                    className="ml-1 sm:ml-2 text-gray-400 hover:text-gray-500"
                                    aria-label="Clear date range"
                                >
                                    <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            )}
                        </button>
                        {isDatePickerOpen && (
                            <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-72 sm:w-80">
                                <div className="flex flex-col space-y-4">
                                    <div>
                                        <label
                                            htmlFor="start-date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="start-date"
                                            value={dateRange.startDate || ''}
                                            onChange={handleStartDateChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="end-date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="end-date"
                                            value={dateRange.endDate || ''}
                                            onChange={handleEndDateChange}
                                            min={dateRange.startDate || undefined}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={clearDateRange}
                                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsDatePickerOpen(false)}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Search input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                            <SearchIcon
                                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or category"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                                aria-label="Clear search"
                            >
                                <XIcon
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 hover:text-gray-500"
                                    aria-hidden="true"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

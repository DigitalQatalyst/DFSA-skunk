import React, { useState } from 'react';
import { ClockIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';
export default function TicketHistoryTab() {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <div className="space-y-6">
            {/* Coming Soon Banner */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 sm:p-6 text-center relative opacity-50">
                <div
                    className="absolute top-2 right-2 cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onTouchStart={() => setShowTooltip(true)}
                    onTouchEnd={() => setShowTooltip(false)}
                >
                    <InfoIcon className="h-5 w-5 text-gray-400" />
                    {showTooltip && (
                        <div className="absolute right-0 mt-2 w-64 px-4 py-3 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                            Available in future release. This feature is currently under
                            development.
                            <div className="absolute right-0 top-0 transform -translate-y-2 translate-x-1 rotate-45 w-2 h-2 bg-gray-900"></div>
                        </div>
                    )}
                </div>
                <AlertCircleIcon className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    Ticket History Coming Soon
                </h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                    We're working on bringing you a comprehensive ticket history feature.
                    Soon you'll be able to track all your support requests, view their
                    status, and access past solutions in one place.
                </p>
                <div className="flex items-center justify-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>Expected launch: Q3 2024</span>
                </div>
            </div>
            {/* Feature Preview - Collapsed on mobile */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        Feature Preview
                    </h3>
                    <button
                        className="md:hidden text-gray-500 hover:text-gray-700"
                        aria-label="Toggle feature preview"
                        onClick={() => {
                            const content = document.getElementById('feature-preview-content');
                            if (content) {
                                content.classList.toggle('hidden');
                            }
                        }}
                    >
                        <ChevronDownIcon className="h-5 w-5" />
                    </button>
                </div>
                <div id="feature-preview-content" className="p-4 hidden md:block">
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                        The Ticket History feature will include:
                    </p>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm sm:text-base">
                                Complete history of all your support requests
                            </span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm sm:text-base">
                                Real-time status updates for active tickets
                            </span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm sm:text-base">
                                Ability to reopen closed tickets if needed
                            </span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm sm:text-base">
                                Searchable knowledge base of past solutions
                            </span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm sm:text-base">
                                Ticket analytics and reporting features
                            </span>
                        </li>
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-blue-700">
                            Want early access to this feature? Contact our support team to
                            join the beta program.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
}

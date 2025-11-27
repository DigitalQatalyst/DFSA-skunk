import React from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingProgressProps {
    profileCompletion: number;
    documentCompletion: number;
    overallCompletion: number;
    isLoading: boolean;
    ctaUrl?: string; // URL for "Continue Setup" button
    lastUpdated?: string; // ISO timestamp
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
    profileCompletion = 0,
    documentCompletion = 0,
    overallCompletion = 0,
    isLoading = false,
    ctaUrl = '/dashboard/profile',
    lastUpdated,
}) => {
    const navigate = useNavigate();
    // Ensure the progress percentages are within valid ranges (0-100)
    const validProfileCompletion = Math.min(100, Math.max(0, profileCompletion));
    const validDocumentCompletion = Math.min(100, Math.max(0, documentCompletion));

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {isLoading ? (
                <div className="animate-pulse space-y-4 p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="border-b border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 m-0">
                            Complete Your Setup
                        </h3>
                        <p className='mt-1 text-sm text-gray-500 max-w-2xl'>Monitor your business profile and document upload progress to unlock full platform features.</p>
                    </div>
                    <div className="flex justify-between items-start p-6 pb-4">
                        <p className="text-sm text-gray-500 m-0">
                            Complete your profile and upload required documents to access all
                            platform features
                        </p>
                        <span className="text-sm font-medium text-gray-600 ml-4 whitespace-nowrap">
                            {overallCompletion}% Complete
                        </span>
                    </div>
                    <div className="px-6">
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-teal-400 h-3 rounded-full"
                                style={{
                                    width: `${overallCompletion}%`,
                                }}
                            ></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                            <div className="flex flex-col md:col-span-3">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Business Profile</span>
                                    <span className="text-sm font-medium text-gray-700" title="Mandatory fields completion percentage">
                                        {validProfileCompletion}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gray-500 h-2 rounded-full"
                                        style={{
                                            width: `${validProfileCompletion}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex flex-col md:col-span-2">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Required Documents</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {validDocumentCompletion}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gray-500 h-2 rounded-full"
                                        style={{
                                            width: `${validDocumentCompletion}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pr-6 pb-6">
                        <button
                            onClick={() => {
                                navigate(ctaUrl);
                            }}
                            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Continue Setup
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

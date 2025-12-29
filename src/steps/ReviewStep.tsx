// steps/ReviewStep.tsx
import React from 'react';
import { CheckIcon } from 'lucide-react';
import { profileConfig } from '../utils/profileConfig';

interface ReviewStepProps {
    formData: any;
    isRevisit?: boolean;
}

export function ReviewStep({ formData, isRevisit = false }: ReviewStepProps) {
    // Helper function to map company stage from step1 format to profileConfig format
    const getCompanyStageInfo = () => {
        const stageValue = formData.companyStage || "";
        
        // First check if it's already a profileConfig id
        let stageInfo = profileConfig.companyStages.find(
            stage => stage.id.toLowerCase() === stageValue.toLowerCase()
        );
        
        if (stageInfo) {
            return stageInfo;
        }
        
        // Map step1 dropdown values to profileConfig ids
        const stageMapping: Record<string, string> = {
            "Start Up": "startup",
            "Scale Up": "growth",
            "Expansion": "mature",
        };
        
        const mappedId = stageMapping[stageValue];
        if (mappedId) {
            stageInfo = profileConfig.companyStages.find(
                stage => stage.id === mappedId
            );
        }
        
        return stageInfo || profileConfig.companyStages[0];
    };

    const companyStageInfo = getCompanyStageInfo();

    // Helper function to format values
    const formatValue = (value: any): string => {
        if (value === null || value === undefined) return "";
        if (typeof value === "number") {
            if (value === 0) return "0";
            return value.toLocaleString();
        }
        if (typeof value === "string") {
            return value.trim();
        }
        return String(value);
    };

    // Helper function to check if a value exists
    const hasValue = (value: any): boolean => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string") return value.trim() !== "";
        if (typeof value === "number") return true; // Show all numbers including 0 as valid
        return true;
    };

    const dataGroups = [
        {
            title: 'Company Information',
            fields: [
                { label: 'Company Name', value: formatValue(formData.companyName) },
                { label: 'Industry', value: formatValue(formData.industry) },
                { label: 'Business Type', value: formatValue(formData.businessType) },
                { label: 'Business Size', value: formatValue(formData.businessSize) },
                { label: 'Registration Number', value: formatValue(formData.registrationNumber) },
                { label: 'Establishment Date', value: formatValue(formData.establishmentDate) },
                {
                    label: 'Company Stage',
                    value: companyStageInfo.label,
                    badge: <span className={`ml-2 inline-block w-2 h-2 rounded-full ${companyStageInfo.color}`} />
                },
                { label: 'Contact Name', value: formatValue(formData.contactName) },
            ],
        },
        {
            title: 'Business Profile',
            fields: [
                { label: 'Business Pitch', value: formatValue(formData.businessPitch) },
                { label: 'Problem Statement', value: formatValue(formData.problemStatement) },
            ],
        },
        {
            title: 'Location & Contact',
            fields: [
                { label: 'Address', value: formatValue(formData.address) },
                { label: 'City', value: formatValue(formData.city) },
                { label: 'Country', value: formatValue(formData.country) },
                { label: 'Website', value: formatValue(formData.website) },
                { label: 'Phone', value: formatValue(formData.phone) },
                { label: 'Email', value: formatValue(formData.email) },
            ],
        },
        {
            title: 'Operations',
            fields: [
                { label: 'Employee Count', value: formatValue(formData.employeeCount) },
                { label: 'Founders', value: formatValue(formData.founders) },
                { label: 'Founding Year', value: formatValue(formData.foundingYear) },
            ],
        },
        {
            title: 'Funding & Needs',
            fields: [
                { label: 'Initial Capital (USD)', value: formData.initialCapitalUsd !== null && formData.initialCapitalUsd !== undefined ? `$${formatValue(formData.initialCapitalUsd)}` : "" },
                { label: 'Funding Needs (USD)', value: formData.fundingNeedsUsd !== null && formData.fundingNeedsUsd !== undefined ? `$${formatValue(formData.fundingNeedsUsd)}` : "" },
                { label: 'Business Requirements', value: formatValue(formData.businessRequirements) },
                { label: 'Business Needs', value: formatValue(formData.businessNeeds) },
            ],
        },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <div className="flex justify-center mb-5">
                    <div className="bg-green-100 p-5 rounded-full">
                        <CheckIcon size={36} className="text-green-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {isRevisit ? 'Review Your Information' : 'Almost Done!'}
                </h2>
                <p className="text-gray-600">
                    {isRevisit
                        ? "Here's a summary of all your onboarding information. You can go back to any section to make changes."
                        : 'Please review your information before completing onboarding.'}
                </p>
            </div>

            <div className="space-y-6">
                {dataGroups.map((group, index) => {
                    // Filter out fields with no value
                    const fieldsWithValues = group.fields.filter(field => hasValue(field.value));
                    
                    // Only render the group if it has at least one field with a value
                    if (fieldsWithValues.length === 0) {
                        return null;
                    }
                    
                    return (
                        <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                                <h3 className="font-medium text-gray-700">{group.title}</h3>
                            </div>
                            <div className="p-5">
                                <dl className="grid grid-cols-1 gap-4">
                                    {fieldsWithValues.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">{field.label}:</dt>
                                            <dd className="text-sm text-gray-800 text-right flex items-center justify-end max-w-xs">
                                                <span className="break-words">{field.value}</span>
                                                {field.badge}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mt-6">
                <p className="text-sm text-blue-700 text-center">
                    {isRevisit
                        ? 'You can update your information at any time by navigating to the Onboarding section from the sidebar.'
                        : "After completing onboarding, you'll be able to add more details to your company profile."}
                </p>
            </div>
        </div>
    );
}

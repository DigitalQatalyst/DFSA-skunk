import React from "react";
import { BuildingIcon } from "lucide-react";
import { profileConfig } from "../utils/profileConfig";
import { OrganizationInfo } from "../types/organization";

interface WelcomeData {
  tradeName?: string;
  industry?: string;
  companyStage?: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

interface WelcomeStepProps {
  formData: WelcomeData;
  isRevisit?: boolean;
  isLoading?: boolean;
  organization?: OrganizationInfo | null;
}

export function WelcomeStep({
  formData,
  isRevisit,
  isLoading = false,
  organization,
}: WelcomeStepProps) {
  const companyStageInfo =
    profileConfig.companyStages.find(
      (stage) => stage.id === formData.companyStage
    ) || profileConfig.companyStages[0];

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="bg-blue-100 p-5 rounded-full">
          <BuildingIcon size={44} className="text-blue-600" />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {isRevisit
            ? "Review Your Onboarding Information"
            : "Welcome to Enterprise Journey"}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {isRevisit
            ? "You can review your onboarding information here."
            : "We already have some information from your sign-up. Please review it and complete a few additional details to get started."}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-medium text-gray-800">Your Information</h3>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex justify-between animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { key: "tradeName", label: "Company Name" },
              { key: "industry", label: "Industry" },
              { key: "companyStage", label: "Company Stage", special: "stage" },
              { key: "contactName", label: "Contact Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
            ].map((item) => {
              // Get value from formData or organization
              let value = "";
              if (item.special === "stage") {
                value = companyStageInfo.label || "Not provided";
              } else {
                const formValue = (formData as WelcomeData)[
                  item.key as keyof WelcomeData
                ];
                // If no form value, try to get from organization
                if (!formValue && organization) {
                  switch (item.key) {
                    case "tradeName":
                      value =
                        organization.accountName ||
                        organization.kf_enterprisename ||
                        "";
                      break;
                    case "industry":
                      value = organization.industry || "";
                      break;
                    case "contactName":
                      value = organization.fullname || "";
                      break;
                    case "email":
                      value = organization.email || "";
                      break;
                    case "phone":
                      value =
                        organization.mobilephone || organization.phone || "";
                      break;
                    default:
                      value = "";
                  }
                } else {
                  value = formValue || "";
                }
              }

              return (
                <div key={String(item.key)} className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {item.label}:
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-800 flex items-center">
                      {item.special === "stage" ? (
                        <>
                          {value}
                          <span
                            className={`ml-2 inline-block w-2 h-2 rounded-full ${companyStageInfo.color}`}
                          />
                        </>
                      ) : (
                        value || "Not provided"
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
        <p className="text-sm text-blue-700">
          {isRevisit
            ? "You can navigate through all steps to review and update your information. Your changes will be saved automatically."
            : "We'll guide you through a few steps to complete your business profile. Your progress will be saved automatically."}
        </p>
      </div>
    </div>
  );
}

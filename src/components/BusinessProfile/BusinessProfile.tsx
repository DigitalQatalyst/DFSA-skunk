import React, {useCallback, useEffect, useMemo, useRef, useState,} from "react";
import {TabSection} from "./TabSection";
import {DocumentSection} from "./DocumentSection";
import {mockDocuments, mockMultiEntryData} from "../../utils/mockData";
import {useSidebar} from "../../context/SidebarContext";
import {Breadcrumbs} from "../PageLayout";
import {
    AlertTriangleIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ImageIcon,
    MenuIcon,
    MoreHorizontalIcon,
    UploadIcon,
    XIcon,
} from "lucide-react";
import {
    API_FIELD_MAPPING,
    checkMandatoryFieldsCompletion,
    getCompanyStageById,
    profileConfig,
} from "../../utils/config";
import {calculateMandatoryCompletion, calculateSectionCompletion,} from "../../services/DataverseService";

import {useAuth} from "../Header";
import {useQuery} from "@tanstack/react-query";
import {
    useSaveCustomerExperienceMutation, useSavePeopleAndGovernanceMutation,
    useSaveProductsMutation,
    useSaveSalesMutation, useSaveServiceRequestsMutation, useSaveSupplyAndLogisticsMutation,
    useSaveVisionStrategyMutation,
} from "../../modules/profile/hooks/useProfileQueries";
import {toast} from "sonner";

type ProfileData = {
    companyStage?: string | null;
    sections?: Record<string, any>;
    name?: string;
    companyType?: string;
    companySize?: string;
};

// --- 💡 HELPER FUNCTION TO MAP API DATA TO SECTION DATA ---
// This function transforms the flat API profile object into the nested structure
// expected by a single TabSection component.
const mapApiProfileToSectionData = (
    apiProfile: Record<string, any>,
    apiFieldMapping: Record<string, string>,
    sectionId: string
) => {
    // Find the configuration for the current section
    const sectionConfig = profileConfig.tabs.find((c) => c.id === sectionId);
    if (!sectionConfig) return {fields: {}};

    const sectionFields: Record<string, any> = {};

    // Iterate through all fields defined in the section's groups
    sectionConfig.groups.forEach((group) => {
        group.fields.forEach((field) => {
            const internalFieldName = field.fieldName; // e.g., 'founderName'
            const apiFieldName = apiFieldMapping[internalFieldName]; // e.g., 'kf_foundername'

            if (apiFieldName && apiProfile[apiFieldName] !== undefined) {
                let value = apiProfile[apiFieldName];

                // --- 💡 DATA TRANSFORMATION/CLEANUP (Example for Date Only) ---
                if (field.fieldType === "Date Only" && typeof value === "string") {
                    // Truncate the full ISO date string ('1991-06-10T00:00:00Z') to YYYY-MM-DD ('1991-06-10')
                    value = value.split("T")[0];
                }

                // Map the (potentially transformed) value
                sectionFields[internalFieldName] = value;
            }
        });
    });

    return {
        fields: sectionFields, // Pass the mapped data in the 'fields' key
    };
};

export function BusinessProfile({activeSection = "profile"}) {
    const {isOpen: sidebarOpen, toggleSidebar} = useSidebar();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const [showTabsMenu, setShowTabsMenu] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [sectionCompletions, setSectionCompletions] = useState({});
    const [mandatoryCompletions, setMandatoryCompletions] = useState({});
    const [missingMandatoryFields, setMissingMandatoryFields] = useState([]);
    const [savingGroupIndex, setSavingGroupIndex] = useState<number | null>(null);

    // Get user from auth context
    const {user} = useAuth();

    // Use React Query to get profile data from cache (set by DashboardLayout)
    const {data: apiProfileData, isLoading: isContextLoading} = useQuery<any>({
        queryKey: ["profile", "business", user?.id || "unknown"],
        queryFn: () => {
            // This should never be called since we're reading from cache
            throw new Error("Profile data should be set by DashboardLayout");
        },
        enabled: false, // Don't fetch, just read from cache
    });

    // Get mutation hooks for saving data
    const saveVisionStrategyMutation = useSaveVisionStrategyMutation();
    const saveProductsMutation = useSaveProductsMutation();
    const saveSalesAndMarketingMutation= useSaveSalesMutation();
    const saveCustomerExperienceMutation = useSaveCustomerExperienceMutation();
    const saveSupplyAndLogisticsMutation = useSaveSupplyAndLogisticsMutation();
    const saveServiceRequestsMutation = useSaveServiceRequestsMutation();
    const savePeopleAndGovernanceMutation = useSavePeopleAndGovernanceMutation();

    useEffect(() => {
        // Only process if data exists and is not currently loading
        if (apiProfileData && !isContextLoading) {
            const apiProfile = apiProfileData;
            const mappedSections: Record<string, unknown> = {};

            console.log("📝 [BusinessProfile] Data retrieved from cache:", apiProfile);

            // Map all sections
            for (const section of profileConfig.tabs) {
                mappedSections[section.id] = mapApiProfileToSectionData(
                    apiProfile,
                    API_FIELD_MAPPING,
                    section.id
                );
            }

            // Re-create the profile data object for local state (if needed) or consumption
            const newProfileData: ProfileData = {
                companyStage: apiProfile.department || "growth",
                name: apiProfile.kf_tradename || "Untitled Company",
                sections: mappedSections,
            };
            // Assuming you still have a local useState for profileData and setProfileData
            // to manage editing state within the BusinessProfile component:
            setProfileData(newProfileData);

            // 🎯 CRITICAL FIX: Calculate completions after setting profile data!
            const completions = {};
            const mandatoryStats = {};

            profileConfig.tabs.forEach((tab) => {
                const sectionData = mappedSections[tab.id] || {fields: {}};
                const sectionConfig = profileConfig.tabs.find((t) => t.id === tab.id);

                completions[tab.id] = calculateSectionCompletion(
                    sectionData,
                    sectionConfig
                );
                mandatoryStats[tab.id] = calculateMandatoryCompletion(
                    sectionData,
                    tab.id,
                    newProfileData.companyStage,
                    profileConfig
                );
            });

            console.log("📊 Section Completions Calculated:", completions);
            console.log("📊 Mandatory Completions Calculated:", mandatoryStats);

            setSectionCompletions(completions);
            setMandatoryCompletions(mandatoryStats);

            const mandatoryFieldsCheck = checkMandatoryFieldsCompletion(
                newProfileData,
                newProfileData.companyStage
            );

            // 5. Update the state used by your button
            setMissingMandatoryFields(mandatoryFieldsCheck.missing);
        }
    }, [apiProfileData, isContextLoading]);

    // Handle saving group changes from TabSection
    const handleSaveGroupChanges = useCallback(
        async (groupIndex: number, editingData: Record<string, unknown>) => {
            // 1. Get configuration and current section
            const currentSection = profileConfig.tabs[activeTabIndex];
            if (!currentSection) return;

            // Set loading state
            setSavingGroupIndex(groupIndex);

            const normalizedData: Record<string, unknown> = {};
            const currentGroup = currentSection.groups[groupIndex]; // Access the specific group config

            // Iterate over the editingData to cast types based on the field config
            currentGroup.fields.forEach((field) => {
                const value = editingData[field.fieldName];
                switch (field.fieldType) {
                    case "Whole Number":
                    case "Decimal":
                    case "Currency":
                        // Cast string to number, but handle empty string (Dataverse expects null or 0)
                        normalizedData[field.fieldName] =
                            value === "" ? null : Number(value);
                        break;
                    case "Date":
                    case "DateTime":
                        // Ensure Dataverse receives the required date format (often ISO string or null)
                        normalizedData[field.fieldName] = value === "" ? null : value;
                        break;
                    default:
                        normalizedData[field.fieldName] = value;
                }
            });
            const dataToSend = normalizedData;

            if (!profileData) {
                setSavingGroupIndex(null);
                return;
            }

            const updatedSections = {
                ...profileData.sections,
                [currentSection.id]: {
                    ...profileData.sections?.[currentSection.id],
                    fields: {
                        ...profileData.sections?.[currentSection.id]?.fields,
                        // Use the raw editingData to update the state, as this is what the UI expects
                        ...editingData,
                    },
                },
            };

            // Create the new profileData object
            const newProfileData = {
                ...profileData,
                sections: updatedSections,
            };

            // --- API Persistence ---

            // Log before the API call (optional, but useful)
            console.log("Attempting to persist changes:", {
                groupIndex,
                data: dataToSend,
                sectionId: currentSection.id,
            });

            try {
                console.log("API call in BusinessProfile being called");
                const accountId = apiProfileData?.accountId;

                if (!accountId) {
                    console.error("No account ID found!");
                    toast.error(
                        "Failed to save changes. Account information is missing."
                    );
                    setSavingGroupIndex(null);
                    return;
                }
                console.log(accountId);
                // Calculate dynamic values based on completion
                const sectionCompletion = sectionCompletions[currentSection.id] || 0;
                const mandatoryCompletion =
                    mandatoryCompletions[currentSection.id]?.percentageComplete || 0;

                if (currentSection.id === "basic") {
                    console.log("💾 Saving Vision & Strategy to API...");

                    const visionStrategyPayload = {
                        ...dataToSend,
                        alignmentScore: Math.round(mandatoryCompletion), // Use mandatory completion as alignment
                        dataCompleteness: Math.round(sectionCompletion), // Use overall completion
                    };
                    console.log(visionStrategyPayload);
                    console.log("Data sent to CRM");

                    await saveVisionStrategyMutation.mutateAsync({
                        accountId,
                        sectionData: visionStrategyPayload,
                    });
                    console.log("✅ Successfully saved to API!");
                } else if (currentSection.id === "products") {
                    await saveProductsMutation.mutateAsync({
                        accountId,
                        sectionData: dataToSend,
                    });
                }  else if (currentSection.id === "Sales") {
                    await saveSalesAndMarketingMutation.mutateAsync({
                        accountId,
                        sectionData: dataToSend,
                    });
                } else if (currentSection.id === "customer") {
                    await saveCustomerExperienceMutation.mutateAsync({
                        accountId,
                        sectionData: dataToSend,
                    });
                } else if (currentSection.id === "supply") {
                    await saveSupplyAndLogisticsMutation.mutateAsync({
                        accountId,
                        sectionData: dataToSend,
                    });
                } else if (currentSection.id === "service") {
                    await saveServiceRequestsMutation.mutateAsync({
                        accountId,
                        sectionData: dataToSend,
                    });
                } else if (currentSection.id === "people") {
                    await savePeopleAndGovernanceMutation.mutateAsync({
                        accountId,
                        sectionData: dataToSend,
                    });
                }



                // Update local state (keep your existing code)
        setProfileData(newProfileData);

        // Save to localStorage for persistence and trigger update event
        try {
          const profileDataToSave = {
            ...newProfileData,
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem("profileData", JSON.stringify(profileDataToSave));
          
          // Dispatch custom event to notify other components (e.g., overview page)
          window.dispatchEvent(new CustomEvent("profileDataUpdated", {
            detail: { profileData: profileDataToSave }
          }));
        } catch (e) {
          // Silently handle localStorage save errors
        }

                // Show success toast
                toast.success("Changes saved successfully");
            } catch (error) {
                // Handle API error
                console.error("Failed to save data via API:", error);
                toast.error(
                    "Failed to save changes. Please try again. If the issue persists, contact support."
                );
                setSavingGroupIndex(null);
                return;
            } finally {
                setSavingGroupIndex(null);
            }

            // Perform all recalculations on the new data
            const mandatoryCheck = checkMandatoryFieldsCompletion(
                newProfileData,
                newProfileData.companyStage
            );
            setMissingMandatoryFields(mandatoryCheck.missing);

            const updatedCompletions = {};
            const updatedMandatoryStats = {};

            profileConfig.tabs.forEach((tab) => {
                const sectionData = newProfileData.sections[tab.id] || {fields: {}};
                const sectionConfig = profileConfig.tabs.find((t) => t.id === tab.id);

                updatedCompletions[tab.id] = calculateSectionCompletion(
                    sectionData,
                    sectionConfig
                );
                updatedMandatoryStats[tab.id] = calculateMandatoryCompletion(
                    sectionData,
                    tab.id,
                    newProfileData.companyStage,
                    profileConfig
                );
            });

            setSectionCompletions(updatedCompletions);
            setMandatoryCompletions(updatedMandatoryStats);
        },
        // FIX: Added profileConfig and profileData to the dependency array
        [
            activeTabIndex,
            profileConfig,
            profileData,
            apiProfileData,
            sectionCompletions,
            mandatoryCompletions,
            saveVisionStrategyMutation,
            saveProductsMutation,
        ]
    );
    const [visibleTabIds, setVisibleTabIds] = useState<string[]>([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const tabsRef = useRef<HTMLDivElement | null>(null);

    const updateVisibleTabs = useCallback(() => {
        if (!tabsRef.current) return;

        const container = tabsRef.current;
        const containerRect = container.getBoundingClientRect();
        const visible: string[] = [];


        // querySelectorAll typed as HTMLButtonElement
        Array.from(
            container.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
        ).forEach((tab) => {
            const tabRect = tab.getBoundingClientRect();
            // Check if tab is fully visible
            if (
                tabRect.left >= containerRect.left &&
                tabRect.right <= containerRect.right
            ) {
                visible.push(tab.id.replace("tab-", ""));
            }
        });

        setVisibleTabIds(visible);
    }, []);

    const updateScrollButtons = useCallback(() => {
        if (!tabsRef.current) return;
        const {scrollLeft, scrollWidth, clientWidth} = tabsRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for rounding
        updateVisibleTabs();
    }, [updateVisibleTabs]);

    const scrollLeft = () => {
        if (tabsRef.current) {
            const el = tabsRef.current as HTMLElement & { scrollBy?: unknown };
            if (typeof el.scrollBy === "function") {
                el.scrollBy({left: -200, behavior: "smooth"});
            } else {
                // fallback
                el.scrollLeft = Math.max(0, el.scrollLeft - 200);
            }
        }
    };

    const scrollRight = () => {
        if (tabsRef.current) {
            const el = tabsRef.current as HTMLElement & { scrollBy?: unknown };
            if (typeof el.scrollBy === "function") {
                el.scrollBy({left: 200, behavior: "smooth"});
            } else {
                // fallback
                el.scrollLeft = Math.min(el.scrollWidth, el.scrollLeft + 200);
            }
        }
    };

    const isLoading = isContextLoading || !profileData;

    useEffect(() => {
        const handleResize = () => updateScrollButtons();
        const tabsEl = tabsRef.current as HTMLElement | null;

        if (tabsEl) {
            tabsEl.addEventListener("scroll", updateScrollButtons as EventListener);
        }

        window.addEventListener("resize", handleResize);
        const timeoutId = window.setTimeout(() => {
            updateScrollButtons(); // Initial check
        }, 0);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (tabsEl) {
                tabsEl.removeEventListener(
                    "scroll",
                    updateScrollButtons as EventListener
                );
            }
            clearTimeout(timeoutId);
        };
    }, [activeSection, showAll, profileData, updateScrollButtons]); // Re-run when tabs change

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result && typeof e.target.result === "string") {
                    setLogoUrl(e.target.result);
                    setIsUploadingLogo(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const getAllSections = () => {
        return profileConfig.tabs.map((tab) => ({
            id: tab.id,
            title: tab.title,
            completion: sectionCompletions[tab.id] || 0,
            mandatoryCompletion: mandatoryCompletions[tab.id] || {percentage: 0},
        }));
    };

    const getSectionsToDisplay = () => {
        const allSections = getAllSections();
        if (activeSection === "overview") {
            return allSections.slice(0, 3);
        } else if (activeSection === "profile") {
            return allSections;
        } else {
            return [
                {
                    id: activeSection,
                    title:
                        profileConfig.tabs.find((tab) => tab.id === activeSection)?.title ||
                        "Vision & Strategy",
                    completion: sectionCompletions[activeSection] || 0,
                    mandatoryCompletion: mandatoryCompletions[activeSection] || {
                        percentage: 0,
                    },
                },
            ];
        }
    };

    const sectionsToDisplay = getSectionsToDisplay();

    // const overallMandatoryCompletion =
    //   profileData && profileData.companyStage
    //     ? Math.round(
    //         (checkMandatoryFieldsCompletion(profileData, profileData.companyStage)
    //           .completed /
    //           checkMandatoryFieldsCompletion(
    //             profileData,
    //             profileData.companyStage
    //           ).total) *
    //           100
    //       )
    //     : 0;

    const overallMandatoryCompletion = useMemo(() => {
        if (!profileData || !profileData.companyStage) return 0;

        const mandatoryCheck = checkMandatoryFieldsCompletion(
            profileData,
            profileData.companyStage
        );

        // ✅ ADD THIS: Safety check for division by zero
        console.log("mandatoryCheck: " + mandatoryCheck);
        if (mandatoryCheck.total === 0) return 100; // No mandatory fields = 100% complete

        const percentage = (mandatoryCheck.completed / mandatoryCheck.total) * 100;

        // ✅ ADD THIS: Debug logging (remove after testing)
        console.log("📊 Overall Mandatory Completion:", {
            completed: mandatoryCheck.completed,
            total: mandatoryCheck.total,
            percentage: Math.round(percentage),
            missing: mandatoryCheck.missing,
        });

        return Math.round(percentage);
    }, [profileData]);

    const getCurrentSectionTitle = () => {
        return sectionsToDisplay[activeTabIndex]?.title || "";
    };

    const companyStage =
        profileData && profileData.companyStage
            ? getCompanyStageById(profileData.companyStage)
            : null;

    if (isLoading) {
        return (
            <div
                className="flex justify-center items-center h-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" style={{ background: 'linear-gradient(to bottom right, rgba(155, 24, 35, 0.05), white, rgba(155, 24, 35, 0.02))' }}>
                <div className="flex flex-col items-center space-y-6 p-8">
                    {/* Animated Logo/Icon Container */}
                    <div className="relative">
                        {/* Outer rotating ring */}
                        <div
                            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin w-20 h-20" style={{ borderColor: '#9b18232a', borderTopColor: 'transparent', borderRightColor: '#9b1823' }}></div>
                        {/* Inner pulsing circle */}
                        <div
                            className="absolute inset-0 m-2 rounded-full animate-pulse w-16 h-16 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #9b1823, #7a1319)' }}>
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-w-0 overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-20 py-3 px-6 sm:px-8 lg:px-12">
                <div>
                    {/* Breadcrumb Navigation */}
                    <div className="mb-4">
                        <Breadcrumbs
                            items={[
                                {label: "Home", href: "/dashboard"},
                                {label: "Dashboard", href: "/dashboard"},
                                {label: "Profile", current: true},
                            ]}
                        />
                    </div>

                    <div className="flex items-center min-w-0">
                        <button
                            className="lg:hidden mr-3 text-gray-600 flex-shrink-0 z-40"
                            onClick={toggleSidebar}
                            // onClick={() => {
                            //   console.log('Hamburger clicked, current sidebarOpen:', sidebarOpen);
                            //   toggleSidebar();
                            // }}

                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <XIcon size={20}/> : <MenuIcon size={20}/>}
                        </button>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                            {activeSection === "overview"
                                ? "Business Overview"
                                : activeSection === "profile"
                                    ? "Company Profile"
                                    : activeSection.charAt(0).toUpperCase() +
                                    activeSection.slice(1)}
                        </h1>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#9b1823' }}></div>
                </div>
            ) : (
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mx-6 sm:mx-8 lg:mx-12 mt-8">
                    {/* Company Logo Section */}
                    <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="relative flex-shrink-0">
                                {logoUrl ? (
                                    <div
                                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                        <img
                                            src={logoUrl}
                                            alt="Company Logo"
                                            className="w-full h-full object-contain"
                                        />
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <button
                                                className="p-1 bg-white rounded-full text-gray-700 hover:text-red-500"
                                                onClick={() => setLogoUrl("")}
                                            >
                                                <XIcon size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer ${
                                            isUploadingLogo
                                                ? "border-gray-300 hover:bg-gray-50"
                                                : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                        style={isUploadingLogo ? { borderColor: '#9b1823', backgroundColor: '#9b18232a' } : {}}
                                        onMouseEnter={(e) => !isUploadingLogo && (e.currentTarget.style.borderColor = '#9b1823')}
                                        onMouseLeave={(e) => !isUploadingLogo && (e.currentTarget.style.borderColor = '#d1d5db')}
                                        onClick={() => setIsUploadingLogo(true)}
                                    >
                                        {isUploadingLogo ? (
                                            <div className="flex flex-col items-center">
                                                <UploadIcon size={16} className="mb-1" style={{ color: '#9b1823' }}/>
                                                <span className="text-xs" style={{ color: '#9b1823' }}>Upload</span>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        ) : (
                                            <ImageIcon size={20} className="text-gray-400"/>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 mt-1">
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <h2 className="text-lg sm:text-xl font-medium text-gray-800 truncate">
                                                    {profileData?.name || "Company Name"}
                                                </h2>
                                                {companyStage && (
                                                    <span
                                                        className={`text-xs font-medium text-white px-2 py-1 rounded-full ${companyStage.color} self-start`}
                                                    >
                            {companyStage.label}
                          </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 break-word">
                                                {profileData?.companyType || "Industry"} •{" "}
                                                {profileData?.companySize || "Company Size"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* NEW Status Box (Right Side) */}
                                    <div
                                        className="flex items-center bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex-shrink-0">
                                        <div className="flex flex-col gap-2">
                                            {/* Missing Fields Section */}
                                            {missingMandatoryFields.length > 0 && (
                                                <button
                                                    className="flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                                    onClick={() => {
                                                        console.log(
                                                            "Missing fields:",
                                                            missingMandatoryFields
                                                        );
                                                    }}
                                                >
                                                    <AlertTriangleIcon
                                                        size={16}
                                                        className="mr-2 flex-shrink-0"
                                                    />
                                                    <span className="whitespace-nowrap">
                            {missingMandatoryFields.length} missing mandatory
                            fields
                          </span>
                                                </button>
                                            )}

                                            {/* Completion Bar Section */}
                                            <div className="flex items-center min-w-0">
                        <span className="text-sm text-gray-600 mr-3 whitespace-nowrap">
                          Completion:
                        </span>
                                                <div
                                                    className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${
                                                            overallMandatoryCompletion === 100
                                                                ? "bg-green-500"
                                                                : overallMandatoryCompletion >= 30
                                                                    ? "bg-yellow-500"
                                                                    : "bg-red-500"
                                                        }`}
                                                        style={{
                                                            width: `${overallMandatoryCompletion}%`,
                                                            backgroundColor: overallMandatoryCompletion >= 70 && overallMandatoryCompletion < 100 ? '#9b1823' : undefined
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 ml-2 flex-shrink-0">
                          {overallMandatoryCompletion}%
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Section Selector */}
                    {activeSection === "profile" && !showAll && (
                        <div className="md:hidden border-b border-gray-200 bg-gray-50 p-3 sticky top-[73px] z-10">
                            <div className="relative">
                                <button
                                    className="w-full px-3 py-2 text-left text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm flex justify-between items-center min-w-0"
                                    onClick={() => setShowTabsMenu(!showTabsMenu)}
                                >
                                    <span className="truncate">{getCurrentSectionTitle()}</span>
                                    <ChevronDownIcon size={16} className="flex-shrink-0 ml-2"/>
                                </button>
                                {showTabsMenu && (
                                    <div
                                        className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                                        {sectionsToDisplay.map((section, index) => (
                                            <button
                                                key={section.id}
                                                className={`w-full text-left px-3 py-3 text-sm flex items-center justify-between min-w-0 ${
                                                    activeTabIndex === index
                                                        ? ""
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                                style={activeTabIndex === index ? { backgroundColor: '#9b18232a', color: '#9b1823' } : {}}
                                                onClick={() => {
                                                    setActiveTabIndex(index);
                                                    setShowTabsMenu(false);
                                                }}
                                            >
                                                <span className="truncate flex-1">{section.title}</span>
                                                <div className="flex items-center ml-2 flex-shrink-0">
                                                    {section.mandatoryCompletion.percentage === 100 ? (
                                                        <span
                                                            className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                              <CheckCircleIcon size={12} className="mr-1"/>
                                                            {section.completion}%
                            </span>
                                                    ) : section.mandatoryCompletion.percentage > 0 ? (
                                                        <span
                                                            className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
                                                            {section.completion}%
                            </span>
                                                    ) : (
                                                        <span
                                                            className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1"></span>
                                                            {section.completion}%
                            </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Desktop Tabs */}
                    {activeSection === "profile" && !showAll && (
                        <div className="hidden md:block border-b border-gray-200 bg-gray-50">
                            <div className="relative py-3 md:py-4 max-w-full">
                                <div className="flex items-center px-4">
                                    {/* Left Arrow */}
                                    <button
                                        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors mr-2"
                                        onClick={scrollLeft}
                                        disabled={!canScrollLeft}
                                        aria-label="Scroll tabs left"
                                    >
                                        <ChevronLeftIcon size={16}/>
                                    </button>

                                    {/* Scrollable Tabs Container */}
                                    <div
                                        ref={tabsRef}
                                        className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth min-w-0"
                                        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
                                        role="tablist"
                                    >
                                        <div className="flex space-x-1 min-w-max">
                                            {sectionsToDisplay.map((section, index) => (
                                                <button
                                                    key={section.id}
                                                    className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap flex items-center rounded-lg transition-all duration-200 ${
                                                        activeTabIndex === index
                                                            ? "bg-white shadow-sm border"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                    }`}
                                                    style={activeTabIndex === index ? { color: '#9b1823', borderColor: '#9b18232a' } : {}}
                                                    onClick={() => setActiveTabIndex(index)}
                                                    role="tab"
                                                    aria-selected={activeTabIndex === index}
                                                    id={`tab-${section.id}`}
                                                    aria-controls={`panel-${section.id}`}
                                                >
                          <span className="truncate max-w-[120px] md:max-w-none">
                            {section.title}
                          </span>
                                                    <div className="flex items-center ml-1 md:ml-2 flex-shrink-0">
                                                        {section.mandatoryCompletion.percentage === 100 ? (
                                                            <span
                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                <CheckCircleIcon
                                    size={12}
                                    className="mr-0.5 md:mr-1"
                                />
                                <span className="hidden sm:inline">
                                  {section.completion}%
                                </span>
                              </span>
                                                        ) : section.mandatoryCompletion.percentage > 0 ? (
                                                            <span
                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                <span className="w-2 h-2 rounded-full bg-amber-500 mr-0.5 md:mr-1"></span>
                                <span className="hidden sm:inline">
                                  {section.completion}%
                                </span>
                              </span>
                                                        ) : (
                                                            <span
                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-gray-400 mr-0.5 md:mr-1"></span>
                                <span className="hidden sm:inline">
                                  {section.completion}%
                                </span>
                              </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Arrow */}
                                    <button
                                        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors ml-2"
                                        onClick={scrollRight}
                                        disabled={!canScrollRight}
                                        aria-label="Scroll tabs right"
                                    >
                                        <ChevronRightIcon size={16}/>
                                    </button>

                                    {/* More Menu with Dropdown */}
                                    <div className="relative flex-shrink-0 ml-2">
                                        <button
                                            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                                            onClick={() => setShowTabsMenu(!showTabsMenu)}
                                            aria-label="Show hidden tabs"
                                            aria-expanded={showTabsMenu}
                                        >
                                            <MoreHorizontalIcon size={16}/>
                                        </button>
                                        {showTabsMenu && (
                                            <div
                                                className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                                <div className="py-1 max-h-64 overflow-y-auto">
                                                    {sectionsToDisplay
                                                        .filter(
                                                            (section) => !visibleTabIds.includes(section.id)
                                                        )
                                                        .map((section) => {
                                                            // Find the correct index in the full sectionsToDisplay array
                                                            const actualIndex = sectionsToDisplay.findIndex(
                                                                (s) => s.id === section.id
                                                            );
                                                            return (
                                                                <button
                                                                    key={section.id}
                                                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                                                                        activeTabIndex === actualIndex
                                                                            ? ""
                                                                            : "text-gray-700 hover:bg-gray-100"
                                                                    }`}
                                                                    style={activeTabIndex === actualIndex ? { backgroundColor: '#9b18232a', color: '#9b1823' } : {}}
                                                                    onClick={() => {
                                                                        setActiveTabIndex(actualIndex);
                                                                        setShowTabsMenu(false);
                                                                        const tabElement = document.getElementById(
                                                                            `tab-${section.id}`
                                                                        );
                                                                        if (tabElement) {
                                                                            tabElement.scrollIntoView({
                                                                                behavior: "smooth",
                                                                                block: "nearest",
                                                                                inline: "center",
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    <span>{section.title}</span>
                                                                    <div className="flex items-center">
                                                                        {section.mandatoryCompletion.percentage ===
                                                                        100 ? (
                                                                            <span
                                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                        <CheckCircleIcon
                                            size={14}
                                            className="mr-1"
                                        />
                                                                                {section.completion}%
                                      </span>
                                                                        ) : section.mandatoryCompletion.percentage >
                                                                        0 ? (
                                                                            <span
                                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                                                                                {section.completion}%
                                      </span>
                                                                        ) : (
                                                                            <span
                                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                                                                                {section.completion}%
                                      </span>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    {sectionsToDisplay.filter(
                                                        (s) => !visibleTabIds.includes(s.id)
                                                    ).length === 0 && (
                                                        <div className="px-4 py-2 text-sm text-gray-500 text-center">
                                                            All tabs visible
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="p-3 sm:p-4 md:p-6 min-w-0">
                        {sectionsToDisplay.map((section, index) => (
                            <div
                                key={section.id}
                                className={
                                    activeSection === "profile" &&
                                    !showAll &&
                                    activeTabIndex !== index
                                        ? "hidden"
                                        : "block min-w-0"
                                }
                                role="tabpanel"
                                id={`panel-${section.id}`}
                                aria-labelledby={`tab-${section.id}`}
                            >
                                {(() => {
                                    const tabCfg = profileConfig.tabs.find(
                                        (tab) => tab.id === section.id
                                    );
                                    if (!tabCfg) return null;
                                    return (
                                        <TabSection
                                            config={tabCfg.groups}
                                            data={
                                                profileData?.sections?.[section.id] || {
                                                    fields: {},
                                                    status: {},
                                                }
                                            }
                                            completion={section.completion}
                                            companyStage={profileData?.companyStage}
                                            mandatoryCompletion={section.mandatoryCompletion}
                                            onSaveGroupChanges={handleSaveGroupChanges}
                                            savingGroupIndex={savingGroupIndex}
                                        />
                                    );
                                })()}

                                {/*{mockMultiEntryData[section.id] &&*/}
                                {/*    mockMultiEntryData[section.id].map(*/}
                                {/*        (tableData: unknown, idx: number) => (*/}
                                {/*            <div key={idx} className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">*/}
                                {/*                <TableSection*/}
                                {/*                    title={tableData.title}*/}
                                {/*                    columns={tableData.columns}*/}
                                {/*                    data={tableData.data}*/}
                                {/*                />*/}
                                {/*            </div>*/}
                                {/*        )*/}
                                {/*    )}*/}

                                {mockDocuments[section.id] && (
                                    <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
                                        <DocumentSection
                                            title="Section Documents"
                                            documents={mockDocuments[section.id]}
                                        />
                                    </div>
                                )}

                                {!mockMultiEntryData[section.id] &&
                                    !mockDocuments[section.id] &&
                                    (!profileData?.sections?.[section.id]?.fields ||
                                        Object.keys(
                                            profileData?.sections?.[section.id]?.fields || {}
                                        ).length === 0) && (
                                        <div
                                            className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-center py-6 sm:py-8 md:py-10 lg:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            <div className="flex flex-col items-center px-4">
                                                <div className="p-3 bg-gray-100 rounded-full mb-4">
                                                    <AlertTriangleIcon
                                                        size={24}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                                                    No {section.title} Data
                                                </h3>
                                                <p className="text-sm text-gray-500 max-w-md break-words text-center">
                                                    This section doesn't have any data yet. Use the Edit
                                                    Section button in each group to add information.
                                                </p>
                                                {profileData?.companyStage && (
                                                    <div
                                                        className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md max-w-md w-full">
                                                        <p className="text-sm text-amber-700 break-words">
                                                            <span className="font-medium">Note:</span> Some
                                                            fields in this section are mandatory for your
                                                            company's {companyStage?.label} stage.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

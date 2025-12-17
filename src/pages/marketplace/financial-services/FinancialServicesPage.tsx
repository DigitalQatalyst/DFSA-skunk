import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon, ArrowLeft } from 'lucide-react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { DFSAEnquirySignupModal } from '../../../components/Header/components/DFSAEnquirySignupModal';
import {
    RegimeTabs,
    PathwaySection,
    PathwayGrid,
} from '../../../components/marketplace/financial-services';
import { regimes } from '../../../data/dfsa/hierarchy';
import { FinancialActivityHierarchy } from '../../../data/dfsa/types';

/**
 * Map landing page regime names to internal regime IDs
 */
const REGIME_NAME_TO_ID: Record<string, string> = {
    'authorisation': 'regime-1',
    'recognition': 'regime-2',
    'representation': 'regime-3',
};

/**
 * FinancialServicesPage
 * Main page displaying DFSA financial services activities organized by regime and pathway
 * Supports URL params: ?regime=authorisation|recognition|representation
 */
export const FinancialServicesPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get regime from URL param, default to 'regime-1' (Authorisation)
    const getInitialRegime = (): string => {
        const regimeParam = searchParams.get('regime')?.toLowerCase();
        if (regimeParam && REGIME_NAME_TO_ID[regimeParam]) {
            return REGIME_NAME_TO_ID[regimeParam];
        }
        return 'regime-1'; // Default to Authorisation
    };

    const [activeRegimeId, setActiveRegimeId] = useState<string>(getInitialRegime());
    const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
    const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
    const [isDFSAEnquiryModalOpen, setIsDFSAEnquiryModalOpen] = useState(false);

    // Update active regime and pathway when URL params change
    useEffect(() => {
        const regimeParam = searchParams.get('regime')?.toLowerCase();
        const pathwayParam = searchParams.get('pathway');

        // Update regime from URL if present
        if (regimeParam && REGIME_NAME_TO_ID[regimeParam]) {
            setActiveRegimeId(REGIME_NAME_TO_ID[regimeParam]);
        }

        // Handle pathway parameter - clear if not present (browser back button)
        if (pathwayParam) {
            setSelectedPathwayId(pathwayParam);
        } else {
            setSelectedPathwayId(null);
        }
    }, [searchParams]);

    // Clear pathway and activity selections when regime changes (via tab click or URL)
    useEffect(() => {
        setSelectedPathwayId(null);
        setSelectedActivityIds([]);
    }, [activeRegimeId]);

    // Get active regime
    const activeRegime = useMemo(() => {
        return regimes.find(r => r.id === activeRegimeId);
    }, [activeRegimeId]);

    // Determine accent color based on active regime
    const accentColor = useMemo(() => {
        if (!activeRegime) return 'primary';
        switch (activeRegime.code) {
            case 'REGIME_1':
                return 'primary' as const;
            case 'REGIME_2':
                return 'gold' as const;
            case 'REGIME_3':
                return 'gray' as const;
            default:
                return 'primary' as const;
        }
    }, [activeRegime]);

    // Handle activity selection
    const handleActivityAdd = (activity: FinancialActivityHierarchy) => {
        setSelectedActivityIds(prev => {
            if (prev.includes(activity.id)) {
                return prev.filter(id => id !== activity.id);
            }
            return [...prev, activity.id];
        });
    };

    // Handle pathway selection
    const handlePathwaySelect = (pathwayId: string) => {
        // Clear previous activity selections when changing pathway
        setSelectedActivityIds([]);
        setSelectedPathwayId(pathwayId);

        // Update URL to include pathway param
        const params = new URLSearchParams(searchParams);
        params.set('pathway', pathwayId);
        navigate(`?${params.toString()}`);
    };

    // Handle back to pathways
    const handleBackToPathways = () => {
        setSelectedPathwayId(null);
        setSelectedActivityIds([]);

        // Remove pathway param from URL (create new history entry)
        const params = new URLSearchParams(searchParams);
        params.delete('pathway');
        const newSearch = params.toString();
        navigate(newSearch ? `?${newSearch}` : '/marketplace/financial-services');
    };

    // Handle proceed to sign up
    const handleProceed = () => {
        setIsDFSAEnquiryModalOpen(true);
    };

    // Get selected pathway
    const selectedPathway = useMemo(() => {
        if (!selectedPathwayId || !activeRegime) return null;
        return activeRegime.pathways.find(p => p.id === selectedPathwayId) || null;
    }, [selectedPathwayId, activeRegime]);


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-3">
                        <nav className="flex items-center space-x-2 text-sm">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-gray-500 hover:text-primary transition-colors"
                            >
                                <HomeIcon size={16} className="mr-1" />
                                Home
                            </button>
                            <ChevronRightIcon size={16} className="text-gray-400" />
                            <button
                                onClick={() => navigate('/marketplace')}
                                className="text-gray-500 hover:text-primary transition-colors"
                            >
                                Marketplace
                            </button>
                            <ChevronRightIcon size={16} className="text-gray-400" />
                            <span className="text-gray-900 font-medium">Products</span>
                        </nav>
                    </div>
                </div>

                {/* Page Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Products Marketplace
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl">
                            Browse DFSA-regulated products and activities organized by regime and pathway.
                            Select activities to view their associated products and regulatory requirements.
                        </p>
                    </div>
                </div>

                {/* Regime Tabs */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4">
                        <RegimeTabs
                            regimes={regimes}
                            activeRegimeId={activeRegimeId}
                            onRegimeChange={setActiveRegimeId}
                        />
                    </div>
                </div>

                {/* Regime Description */}
                {activeRegime && (
                    <div className="bg-gray-50 border-b border-gray-200">
                        <div className="container mx-auto px-4 py-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                    {activeRegime.fullName}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {activeRegime.description}
                                </p>
                                {activeRegime.pathways.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        {activeRegime.pathways.length} {activeRegime.pathways.length === 1 ? 'pathway' : 'pathways'} available
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pathways and Activities */}
                <div className="container mx-auto px-4 py-8">
                    {activeRegime && activeRegime.pathways.length > 0 ? (
                        <div>
                            {/* Show pathway selection or activities based on state */}
                            {selectedPathway ? (
                                // Pathway selected: show activities with back button
                                <div className="space-y-6">
                                    {/* Back to Pathways Button */}
                                    <button
                                        onClick={handleBackToPathways}
                                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
                                    >
                                        <ArrowLeft size={18} />
                                        Back to Pathways
                                    </button>

                                    {/* Pathway Activities */}
                                    <PathwaySection
                                        pathway={selectedPathway}
                                        onActivityAdd={handleActivityAdd}
                                        selectedActivityIds={selectedActivityIds}
                                        regimeAccentColor={accentColor}
                                        defaultExpanded={true}
                                        collapsible={false}
                                    />
                                </div>
                            ) : (
                                // No pathway selected: show pathway grid
                                <PathwayGrid
                                    pathways={activeRegime.pathways}
                                    onSelectPathway={handlePathwaySelect}
                                    accentColor={accentColor}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">
                                No pathways available for this regime.
                            </p>
                        </div>
                    )}
                </div>


                {/* Selected Activities Summary (Bottom Right, elevated to avoid chatbot) */}
                {selectedActivityIds.length > 0 && (
                    <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-2xl border-2 border-primary p-6 max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                                Selected Activities
                            </h3>
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white text-sm font-bold rounded-full">
                                {selectedActivityIds.length}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            {selectedActivityIds.length} {selectedActivityIds.length === 1 ? 'activity' : 'activities'} ready to proceed
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedActivityIds([])}
                                className="flex-1 text-sm text-gray-700 hover:text-gray-900 font-medium px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={handleProceed}
                                className="flex-1 flex items-center justify-center gap-1 text-sm text-white font-semibold px-4 py-2.5 bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                            >
                                <span>Proceed</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            {/* DFSA Enquiry Sign-Up Modal */}
            <DFSAEnquirySignupModal
                isOpen={isDFSAEnquiryModalOpen}
                onClose={() => setIsDFSAEnquiryModalOpen(false)}
                onSuccess={(referenceNumber) => {
                    console.log('DFSA Enquiry submitted:', referenceNumber);
                    // Clear selections after successful submission
                    setSelectedActivityIds([]);
                }}
            />
        </div>
    );
};

export default FinancialServicesPage;

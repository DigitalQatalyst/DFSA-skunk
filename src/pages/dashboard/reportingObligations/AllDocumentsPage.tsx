import React, { useEffect, useState } from 'react';
import { Header } from '../../../components/Header/Header';
import { Sidebar } from '../../../components/Sidebar';
import { ServiceRequestsFilters } from '../../../components/ServiceRequestsFilters';
import { mockReportData } from './mockReportsData';
import {
    HomeIcon,
    ChevronRightIcon,
    EyeIcon,
    DownloadIcon,
    FileTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon as ChevronRightPaginationIcon,
} from 'lucide-react';
export function AllDocumentsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const documentsPerPage = 10;
    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // Simulate GraphQL API call
                await new Promise((resolve) => setTimeout(resolve, 800));
                setDocuments(mockReportData.reportDocuments);
                setFilteredDocuments(mockReportData.reportDocuments);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching documents:', err);
                setError('Failed to load documents. Please try again.');
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    // Filter documents
    useEffect(() => {
        let filtered = documents;
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (doc) =>
                    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.fileType.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }
        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(
                (doc) => doc.category.toLowerCase() === categoryFilter.toLowerCase(),
            );
        }
        // Apply date range filter
        if (dateRange.startDate || dateRange.endDate) {
            filtered = filtered.filter((doc) => {
                const uploadDate = new Date(doc.uploadDate);
                const startDateMatch =
                    !dateRange.startDate || uploadDate >= new Date(dateRange.startDate);
                const endDateMatch =
                    !dateRange.endDate || uploadDate <= new Date(dateRange.endDate);
                return startDateMatch && endDateMatch;
            });
        }
        setFilteredDocuments(filtered);
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, dateRange, documents]);
    // Pagination
    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = filteredDocuments.slice(
        indexOfFirstDocument,
        indexOfLastDocument,
    );
    const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
    // File type icon
    const getFileTypeIcon = (fileType) => {
        return <FileTextIcon size={16} className="text-gray-400" />;
    };
    // Breadcrumbs
    const Breadcrumbs = () => (
        <nav className="flex items-center text-sm text-gray-500 mb-6 p-6 pb-2">
            <a href="/dashboard/reporting-obligations" className="hover:text-blue-600">
                Reports & Reporting Obligations
            </a>
            <ChevronRightIcon size={14} className="mx-2" />
            <span className="text-gray-800 font-medium">All Documents</span>
        </nav>
    );
    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        activeSection="reporting"
                    />
                    <div className="bg-gray-50 min-h-screen w-full">
                        <div className=" mx-auto p-4 md:p-6 lg:p-8">
                            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading documents...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen">
                <Header
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        activeSection="reporting"
                    />
                    <div className="bg-gray-50 min-h-screen w-full">
                        <div className=" mx-auto p-4 md:p-6 lg:p-8">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="text-center py-12">
                                    <div className="text-red-500 text-lg mb-2">Error</div>
                                    <p className="text-gray-600 mb-4">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen">
            <Header
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeSection="reporting"
                />
                <div className="bg-gray-50 min-h-screen w-full">
                    <div className=" mx-auto p-4 md:p-6 lg:p-8">
                        <div className="p-6 pb-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                All Documents
                            </h1>
                            <p className="text-gray-600">
                                Full list of your report-related documents
                            </p>
                        </div>
                        <Breadcrumbs />
                        {/* Filters Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="financial">Financial</option>
                                        <option value="regulatory">Regulatory</option>
                                        <option value="compliance">Compliance</option>
                                        <option value="operational">Operational</option>
                                        <option value="environmental">Environmental</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <ChevronRightIcon
                                            size={16}
                                            className="transform rotate-90"
                                        />
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto sm:max-w-lg">
                                    <ServiceRequestsFilters
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        dateRange={dateRange}
                                        onDateRangeChange={setDateRange}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Data Table Card */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900">Documents</h2>
                                <p className="text-sm text-gray-600">
                                    Your report-related documents and files
                                </p>
                            </div>
                            <div className="p-6">
                                {currentDocuments.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                                        <p className="text-gray-500">
                                            No documents found matching your filters.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Document Name
                                                        </th>
                                                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Category
                                                        </th>
                                                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            File Type
                                                        </th>
                                                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            File Size
                                                        </th>
                                                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Upload Date
                                                        </th>
                                                        <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentDocuments.map((doc, index) => (
                                                        <tr
                                                            key={doc.id}
                                                            className={`hover:bg-gray-50 ${index !== currentDocuments.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                            style={{
                                                                minHeight: '3.5rem',
                                                            }}
                                                        >
                                                            <td className="py-3 px-6">
                                                                <div className="flex items-center">
                                                                    {getFileTypeIcon(doc.fileType)}
                                                                    <div className="ml-3 text-sm font-medium text-gray-900">
                                                                        {doc.name}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-6">
                                                                <div className="text-sm text-gray-500">
                                                                    {doc.category}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-6">
                                                                <div className="text-sm text-gray-500 uppercase">
                                                                    {doc.fileType}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-6">
                                                                <div className="text-sm text-gray-500">
                                                                    {doc.fileSize}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-6">
                                                                <div className="text-sm text-gray-500">
                                                                    {doc.uploadDate}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-6 text-right">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <button
                                                                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-gray-100"
                                                                        onClick={() =>
                                                                            console.log('View document', doc.id)
                                                                        }
                                                                        title="View"
                                                                    >
                                                                        <EyeIcon size={16} />
                                                                    </button>
                                                                    <button
                                                                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-gray-100"
                                                                        onClick={() =>
                                                                            console.log('Download document', doc.id)
                                                                        }
                                                                        title="Download"
                                                                    >
                                                                        <DownloadIcon size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-end mt-4 gap-2">
                                                <span className="text-sm text-gray-500 mr-4">
                                                    Showing {indexOfFirstDocument + 1} to{' '}
                                                    {Math.min(
                                                        indexOfLastDocument,
                                                        filteredDocuments.length,
                                                    )}{' '}
                                                    of {filteredDocuments.length} results
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage(Math.max(1, currentPage - 1))
                                                    }
                                                    disabled={currentPage === 1}
                                                    className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    <ChevronLeftIcon size={16} />
                                                </button>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            Math.min(totalPages, currentPage + 1),
                                                        )
                                                    }
                                                    disabled={currentPage === totalPages}
                                                    className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    <ChevronRightPaginationIcon size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

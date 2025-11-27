import { useMemo, useRef, useState } from "react";

import { BellIcon, MenuIcon, UploadIcon, XIcon } from "lucide-react";
import { DocumentNotification } from "../../../components/DocumentWallet/DocumentNotification";
import { DocumentWallet } from "../../../components/DocumentWallet/DocumentWallet";
import { useSidebar } from "../../../context/SidebarContext";
import { Can } from "../../../components/RBAC/Can";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { BreadcrumbItem, Breadcrumbs } from "../../../components/PageLayout";
import { useExpiringDocuments } from "../../../hooks/useExpiringDocuments";

export function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const uploadModalOpenerRef = useRef<(() => void) | null>(null);
  const { isOpen: sidebarOpen, toggleSidebar } = useSidebar();
  const { data: expiringData } = useExpiringDocuments();
  const expiringCount = expiringData?.count || 0;
  const openUploadModal = () => uploadModalOpenerRef.current?.();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard/overview" },
    { label: "Documents", current: true },
  ];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="sticky top-0 z-20 py-3 px-4 lg:px-6 bg-gray-50">
        {/* Breadcrumbs at the top */}
        <div className="flex items-center gap-3 mb-3">
          <div className="lg:hidden">
            <button
              className="lg:hidden text-gray-600 flex-shrink-0 z-40"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Title and action buttons */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Document Wallet</h1>

          {/* Notification + Upload buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 relative"
              >
                <BellIcon size={20} />
                {expiringCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {expiringCount}
                  </span>
                )}
              </button>
              {showNotifications && expiringCount > 0 && (
                <DocumentNotification
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* Upload buttons (desktop + mobile) */}
            <Can I="create" a="user-documents" passThrough>
              {(allowed) => {
                const desktopButton = (
                  <button
                    onClick={allowed ? openUploadModal : undefined}
                    disabled={!allowed}
                    className={`md:flex hidden items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 ${
                      !allowed ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-disabled={!allowed}
                  >
                    <UploadIcon size={16} className="mr-1" />
                    Upload Document
                  </button>
                );

                const mobileButton = (
                  <button
                    onClick={allowed ? openUploadModal : undefined}
                    disabled={!allowed}
                    className={`flex md:hidden items-center justify-center p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 ${
                      !allowed ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-disabled={!allowed}
                  >
                    <UploadIcon size={20} />
                  </button>
                );

                if (!allowed) {
                  return (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-block">
                              {desktopButton}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>You don't have permission to upload documents</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-block">{mobileButton}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>You don't have permission to upload documents</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  );
                }

                return (
                  <>
                    {desktopButton}
                    {mobileButton}
                  </>
                );
              }}
            </Can>
          </div>
        </div>
      </div>

      {/* Document Wallet */}
      <DocumentWallet
        onDocumentsUpdate={setDocuments}
        uploadModalOpenerRef={uploadModalOpenerRef}
      />
    </div>
  );
}

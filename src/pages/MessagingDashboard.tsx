import { useState, useEffect } from "react";

import { useAuth } from "../context/UnifiedAuthProvider";
import { ConversationList } from "../components/messaging/ConversationList";
import { ChatWindow } from "../components/messaging/ChatWindow";
import { NewConversationModal } from "../components/messaging/NewConversationModal";
import { GroupChatModal } from "../components/messaging/GroupChatModal";
import { Button } from "../components/ui/button";
import { Plus, WifiOff, Users, Home, RefreshCw } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../components/ui/breadcrumb";
import { MainLayout } from "../components/layouts/MainLayout";
import { PageLayout } from "../components/PageLayout";
export default function MessagingDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNewGroupChatOpen, setIsNewGroupChatOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Prevent page scroll on small/medium screens only
  useEffect(() => {
    const handleResize = () => {
      const mainElement = document.querySelector(
        'main[class*="overflow-y-auto"]'
      );
      if (mainElement instanceof HTMLElement) {
        // Only prevent scrolling on screens smaller than 1024px (lg breakpoint)
        if (window.innerWidth < 1024) {
          mainElement.style.overflow = "hidden";
        } else {
          mainElement.style.overflow = "";
        }
      }
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      const mainElement = document.querySelector(
        'main[class*="overflow-y-auto"]'
      );
      if (mainElement instanceof HTMLElement) {
        mainElement.style.overflow = "";
      }
    };
  }, []);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
    console.log("user", user);
  }, [user, authLoading, navigate]);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "Your connection has been restored.",
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "No connection",
        description: "You are currently offline.",
        variant: "destructive",
      });
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);
  const handleConversationCreated = (conversationId: string) => {
    setIsNewChatOpen(false);
    setSelectedConversationId(conversationId);
    // Trigger refresh of conversation list
    setRefreshTrigger((prev) => prev + 1);
  };
  const handleGroupCreated = (conversationId: string) => {
    setIsNewGroupChatOpen(false);
    setSelectedConversationId(conversationId);
    // Trigger refresh of conversation list
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleConversationDeleted = () => {
    // Clear selected conversation and refresh list
    setSelectedConversationId(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBackFromChat = () => {
    setSelectedConversationId(null);
    // Refresh conversation list to update unread counts
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log("[MessagingDashboard] Manual refresh triggered");

    // Trigger conversation list refresh
    setRefreshTrigger((prev) => prev + 1);

    // Show success toast
    toast({
      title: "Refreshed",
      description: "Messages and conversations updated.",
    });

    // Reset refreshing state after animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <MainLayout>
      <PageLayout>
        <div className="flex flex-col h-[calc(100vh-120px)] lg:h-screen overflow-hidden">
          {/* Header Section */}
          <div className="w-full px-2 sm:px-4 lg:px-6 py-3 sm:py-6 flex-shrink-0">
            {/* Breadcrumbs - Hidden on mobile */}
            <Breadcrumb className="mb-4 sm:mb-6 hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/communities">Communities</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Messages</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Messages & Connections
                </h1>
                <p className="text-xs sm:text-sm text-gray-700 mt-1">
                  Chat with community members
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleRefresh}
                  className="gap-2 flex-1 sm:flex-initial"
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  title="Refresh messages and conversations"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button
                  onClick={() => setIsNewChatOpen(true)}
                  className="gap-2 flex-1 sm:flex-initial"
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Chat</span>
                </Button>
                <Button
                  onClick={() => setIsNewGroupChatOpen(true)}
                  className="gap-2 flex-1 sm:flex-initial"
                  variant="outline"
                  size="sm"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">New Group</span>
                </Button>
              </div>
            </div>

            {!isOnline && (
              <div className="mb-3 sm:mb-4 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4 flex items-center gap-2 text-red-700">
                <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium">
                  You are currently offline. Messages will be sent when
                  connection is restored.
                </p>
              </div>
            )}
          </div>

          {/* Chat Container - Takes remaining space */}
          <div className="flex-1 min-h-0 px-2 sm:px-4 lg:px-6 pb-3 sm:pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] h-full max-h-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
              {/* Desktop: Conversation List */}
              <div className="border-r hidden lg:block h-full overflow-hidden">
                <ConversationList
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                  refreshTrigger={refreshTrigger}
                />
              </div>

              {/* Mobile: Show conversation list when no conversation selected */}
              <div className="lg:hidden flex flex-col h-full overflow-hidden">
                {!selectedConversationId ? (
                  <ConversationList
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                    refreshTrigger={refreshTrigger}
                  />
                ) : (
                  <ChatWindow
                    conversationId={selectedConversationId}
                    isOnline={isOnline}
                    onBack={handleBackFromChat}
                    onConversationDeleted={handleConversationDeleted}
                    refreshTrigger={refreshTrigger}
                  />
                )}
              </div>

              {/* Desktop: Show chat window */}
              <div className="hidden lg:block h-full overflow-hidden">
                {selectedConversationId ? (
                  <ChatWindow
                    conversationId={selectedConversationId}
                    isOnline={isOnline}
                    onConversationDeleted={handleConversationDeleted}
                    refreshTrigger={refreshTrigger}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-8">
                    <div className="rounded-full bg-gray-100 p-4 sm:p-6 mb-3 sm:mb-4">
                      <Plus className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      No conversation selected
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 max-w-sm">
                      Select a conversation from the list or start a new one to
                      begin messaging
                    </p>
                    <Button
                      onClick={() => setIsNewChatOpen(true)}
                      className="gap-2"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      New Chat
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <NewConversationModal
          open={isNewChatOpen}
          onOpenChange={setIsNewChatOpen}
          onConversationCreated={handleConversationCreated}
        />

        <GroupChatModal
          open={isNewGroupChatOpen}
          onOpenChange={setIsNewGroupChatOpen}
          onGroupCreated={handleGroupCreated}
        />
      </PageLayout>
    </MainLayout>
  );
}

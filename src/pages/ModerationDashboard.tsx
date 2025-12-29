import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/UnifiedAuthProvider";
import { supabase } from "../supabase/client";

import { ModerationSummaryCard } from "../components/moderation/ModerationSummaryCard";
import { ReportsTable } from "../components/moderation/ReportsTable";
import { ReportDetailDrawer } from "../components/moderation/ReportDetailDrawer";
import { ModerationLogCard } from "../components/moderation/ModerationLogCard";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { ModerationAPI, ModerationMetrics } from "../services/ModerationAPI";

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
import { ALLOWED_APP_ROLES, logRoleDebug } from "../services/roleMapper";
import { Role } from "../config/abilities";
interface Community {
  id: string;
  name: string;
}
export default function ModerationDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
  const [stats, setStats] = useState<ModerationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [checkingPermissions, setCheckingPermissions] = useState(true);
  const filterPostId = searchParams.get("postId") || undefined;
  // Check permissions and redirect if not authorized
  useEffect(() => {
    const checkAccess = async () => {
      setCheckingPermissions(true);
      
      if (!user) {
        setCheckingPermissions(false);
        navigate("/");
        return;
      }

      // Check if user is admin
      const { data: localUser } = await supabase
        .from("users_local")
        .select("role")
        .eq("email", user.email)
        .maybeSingle();

      const normalizedRole =
        localUser?.role && ALLOWED_APP_ROLES.includes(localUser.role as Role)
          ? (localUser.role as Role)
          : undefined;

      logRoleDebug(
        localUser?.role ?? "ModerationDashboard",
        normalizedRole,
        "ModerationDashboard"
      );

      if (!normalizedRole) {
        setCheckingPermissions(false);
        toast({
          title: "Access Denied",
          description:
            "Your account role does not have access to the moderation dashboard.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // If access is granted, fetch communities
      setCheckingPermissions(false);
      fetchModeratorCommunities();
    };

    checkAccess();
  }, [user, navigate]);
  // Fetch stats when community changes
  useEffect(() => {
    if (communities.length > 0) {
      fetchStats();
    }
  }, [selectedCommunity, communities, refreshKey]);

  // Setup realtime subscriptions
  useEffect(() => {
    console.log("user", user);
    if (communities.length === 0) return;
    const communityIds =
      selectedCommunity === "all"
        ? communities.map((c) => c.id)
        : [selectedCommunity];
    const unsubscribe = ModerationAPI.subscribe(communityIds, (event) => {
      if (event === "report") {
        toast({
          title: "New report received",
          description: "A new report has been submitted in your community",
        });
        setRefreshKey((prev) => prev + 1);
      } else if (event === "action") {
        setRefreshKey((prev) => prev + 1);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [communities, selectedCommunity]);
  const fetchModeratorCommunities = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Get user role from users_local table
      const { data: localUser } = await supabase
        .from("users_local")
        .select("id, role")
        .eq("email", user.email)
        .maybeSingle();

      if (!localUser) {
        setError("User not found");
        setLoading(false);
        return;
      }

      // Since we already checked user is admin in useEffect, just fetch all communities
      const { data: allCommunitiesData, error: allCommunitiesError } =
        await supabase.from("communities").select("id, name").order("name");

      if (allCommunitiesError) throw allCommunitiesError;
      const allCommunities = allCommunitiesData || [];

      if (allCommunities.length === 0) {
        setError("No communities available for moderation");
        setLoading(false);
        return;
      }
      setCommunities(allCommunities);
      setLoading(false);
    } catch (err) {
      setError("Failed to load moderation dashboard");
      setLoading(false);
    }
  };
  const fetchStats = async () => {
    if (communities.length === 0) return;
    const metrics = await ModerationAPI.getMetrics({
      communityId: selectedCommunity,
    });
    setStats(metrics);
  };
  const handleReportUpdate = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedReportId(null);
  };
  if (loading || checkingPermissions) {
    return (
      <MainLayout showSidebar>
        <PageLayout>
          <div className="min-h-screen">
            <main className="p-4 lg:p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Breadcrumbs Skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded bg-gray-300" />
                  <Skeleton className="h-4 w-2 bg-gray-300" />
                  <Skeleton className="h-4 w-24 bg-gray-300" />
                  <Skeleton className="h-4 w-2 bg-gray-300" />
                  <Skeleton className="h-4 w-28 bg-gray-300" />
                </div>

                {/* Page Header Skeleton */}
                <div className="flex items-start justify-between animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div>
                      <Skeleton className="h-9 w-64 mb-2 bg-gray-300" />
                      <Skeleton className="h-4 w-96 bg-gray-300" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-64 rounded-md bg-gray-300" />
                </div>

                {/* Summary Cards Skeleton */}
                <div className="grid gap-6 md:grid-cols-4 animate-fade-in">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-2 bg-gray-300" />
                          <Skeleton className="h-8 w-16 bg-gray-300" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-lg bg-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Content Grid Skeleton */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Reports Table Skeleton */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <Skeleton className="h-6 w-32 mb-2 bg-gray-300" />
                        <Skeleton className="h-4 w-48 bg-gray-300" />
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4 bg-gray-300" />
                                <Skeleton className="h-3 w-1/2 bg-gray-300" />
                              </div>
                              <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Moderation Log Skeleton */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <Skeleton className="h-6 w-32 mb-2 bg-gray-300" />
                        <Skeleton className="h-4 w-48 bg-gray-300" />
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 w-full bg-gray-300" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </PageLayout>
      </MainLayout>
    );
  }
  if (error) {
    return (
      <MainLayout showSidebar>
        <PageLayout>
          <div className="min-h-screen bg-gray-50">
            <main className="p-4 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
                  <div className="border border-red-200 bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={fetchModeratorCommunities}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </PageLayout>
      </MainLayout>
    );
  }
  return (
    <MainLayout showSidebar>
      <PageLayout>
        {" "}
        <div className="min-h-screen ">
          <main className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Breadcrumbs */}
              <Breadcrumb>
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
                    <BreadcrumbPage>Moderation</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="flex items-start justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  {/* <Shield className="h-8 w-8 text-red-600" /> */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                      Content Moderation
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Monitor and manage reported content across your
                      communities
                    </p>
                  </div>
                </div>

                {/* Community Filter */}
                <div className="w-64">
                  <Select
                    value={selectedCommunity}
                    onValueChange={setSelectedCommunity}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Filter by community" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="all">All Communities</SelectItem>
                      {communities.map((community) => (
                        <SelectItem key={community.id} value={community.id}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary Cards */}
              <ModerationSummaryCard stats={stats} />

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Reports Table */}
                <div className="lg:col-span-2">
                  <ReportsTable
                    communityIds={
                      selectedCommunity === "all"
                        ? communities.map((c) => c.id)
                        : [selectedCommunity]
                    }
                    refreshKey={refreshKey}
                    onSelectReport={setSelectedReportId}
                    filterPostId={filterPostId}
                  />
                </div>

                {/* Moderation Log */}
                <div>
                  <ModerationLogCard
                    communityIds={
                      selectedCommunity === "all"
                        ? communities.map((c) => c.id)
                        : [selectedCommunity]
                    }
                    refreshKey={refreshKey}
                  />
                </div>
              </div>
            </div>
          </main>

          {/* Report Detail Drawer */}
          {selectedReportId && (
            <ReportDetailDrawer
              reportId={selectedReportId}
              onClose={() => setSelectedReportId(null)}
              onUpdate={handleReportUpdate}
            />
          )}
        </div>
      </PageLayout>
    </MainLayout>
  );
}

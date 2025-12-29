import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/UnifiedAuthProvider';
import { supabase } from '../../supabase/client';
import { safeFetch } from '../../utils/safeFetch';
import { GeneralSettingsCard } from '../../components/community-settings/GeneralSettingsCard';
import { RolesAndPermissionsCard } from '../../components/community-settings/RolesAndPermissionsCard';
import { InviteMembersCard } from '../../components/community-settings/InviteMembersCard';
import { AuditLogCard } from '../../components/community-settings/AuditLogCard';
import { Skeleton } from '../../components/ui/skeleton';
import { AlertCircle, ChevronLeft, Shield, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '../../components/ui/breadcrumb';
import { ALLOWED_APP_ROLES, logRoleDebug } from "../../services/roleMapper";
import { Role } from "../../config/abilities";
interface Community {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
}
export default function CommunitySettings() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (id) {
      fetchCommunityAndCheckPermissions();
    }
  }, [id, user, navigate]);
  const fetchCommunityAndCheckPermissions = async () => {
    if (!user || !id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch community
      const communityQuery = supabase.from('communities').select('id, name, description, created_by, created_at').eq('id', id).maybeSingle();
      const [communityData, communityError] = await safeFetch(communityQuery);
      if (communityError || !communityData) {
        setError('Community not found');
        setLoading(false);
        return;
      }
      setCommunity(communityData as Community);

      // Check if user is owner
      const isUserOwner = communityData.created_by === user.id;
      setIsOwner(isUserOwner);

      // If not owner, check if role is allowed
      if (!isUserOwner) {
        const roleQuery = supabase.from('community_roles').select('role').eq('community_id', id).eq('user_id', user.id).maybeSingle();
        const [roleData] = await safeFetch(roleQuery);

        const normalizedRole =
          roleData?.role && ALLOWED_APP_ROLES.includes(roleData.role as Role)
            ? (roleData.role as Role)
            : undefined;

        logRoleDebug(
          roleData?.role ?? "CommunitySettings",
          normalizedRole,
          "CommunitySettings"
        );

        // Only owner and allowed roles can access settings
        if (!normalizedRole) {
          setError('You do not have permission to access this page');
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };
  const handleCommunityUpdate = () => {
    setRefreshKey(prev => prev + 1);
    fetchCommunityAndCheckPermissions();
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4 lg:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>;
  }
  if (error || !community) {
    return <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
              <div className="border border-red-200 bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error || 'Failed to load community settings'}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={fetchCommunityAndCheckPermissions}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
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
                <BreadcrumbLink asChild>
                  <Link to={`/community/${id}`}>{community.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Page Header */}
          <div className="animate-fade-in">
            <Link to={`/community/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-2 transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Back to Community
            </Link>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                  Community Settings
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Manage roles, access, and general preferences for {community.name}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <GeneralSettingsCard community={community} onUpdate={handleCommunityUpdate} />
              <InviteMembersCard communityId={id!} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <RolesAndPermissionsCard communityId={id!} isOwner={isOwner} currentUserId={user?.id || ''} refreshKey={refreshKey} onUpdate={handleCommunityUpdate} />
              <AuditLogCard communityId={id!} />
            </div>
          </div>
        </div>
      </main>
      <Footer isLoggedIn={true} />
    </div>;
}
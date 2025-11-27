import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { supabase } from '../../supabase/client';
import { Skeleton } from '../../components/ui/skeleton';
import { GradientAvatar } from '../../components/ui/gradient-avatar';
interface Community {
  id: string;
  name: string;
  category: string;
  imageurl: string | null;
  member_count: number;
}
interface MutualCommunitiesListProps {
  viewerId: string;
  profileUserId: string;
}
export function MutualCommunitiesList({
  viewerId,
  profileUserId
}: MutualCommunitiesListProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchMutualCommunities();
  }, [viewerId, profileUserId]);
  const fetchMutualCommunities = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.rpc('get_mutual_communities', {
        p_viewer_id: viewerId,
        p_profile_id: profileUserId
      });
      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching mutual communities:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Card className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <CardTitle className="text-lg font-bold text-gray-900">Shared Communities</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>;
  }
  if (communities.length === 0) {
    return <Card className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <CardTitle className="text-lg font-bold text-gray-900">Shared Communities</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 text-sm">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            No shared communities
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <CardTitle className="text-lg font-bold text-gray-900">
          Shared Communities ({communities.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {communities.map(community => <Link key={community.id} to={`/community/${community.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                {community.imageurl ? <img src={community.imageurl} alt={community.name} className="h-full w-full object-cover" /> : <GradientAvatar seed={community.id} className="h-full w-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                  {community.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {community.member_count} members
                </p>
              </div>
            </Link>)}
        </div>
      </CardContent>
    </Card>;
}
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Users, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../context/UnifiedAuthProvider';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
interface TrendingTopic {
  tag: string;
  post_count: number;
}
interface Community {
  id: string;
  name: string;
  membercount: number;
  imageurl?: string;
}
interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  community_id: string;
  description?: string;
}
interface FeedSidebarProps {
  onTagClick: (tag: string) => void;
}
interface CommunityMembership {
  community_id: string;
  joined: boolean;
}
export function FeedSidebar({
  onTagClick
}: FeedSidebarProps) {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [topCommunities, setTopCommunities] = useState<Community[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [memberships, setMemberships] = useState<CommunityMembership[]>([]);
  useEffect(() => {
    fetchTopCommunities();
    fetchUpcomingEvents();
    fetchTrendingTopics();
    if (user) {
      fetchMemberships();
    }
  }, [user]);
  const fetchTopCommunities = async () => {
    const {
      data
    } = await supabase.from('communities').select('id, name, membercount, imageurl').order('membercount', {
      ascending: false
    }).limit(4);
    if (data) {
      setTopCommunities(data);
    }
  };
  const fetchUpcomingEvents = async () => {
    const {
      data
    } = await supabase.from('events').select('*').gte('event_date', new Date().toISOString().split('T')[0]).order('event_date', {
      ascending: true
    }).limit(3);
    if (data) {
      setUpcomingEvents(data);
    }
  };
  const fetchTrendingTopics = async () => {
    const {
      data
    } = await supabase.rpc('get_trending_topics', {
      limit_count: 5
    });
    if (data) {
      setTrendingTopics(data);
    }
  };
  const fetchMemberships = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from('memberships').select('community_id').eq('user_id', user.id);
    if (data) {
      setMemberships(data.map(m => ({
        community_id: m.community_id,
        joined: true
      })));
    }
  };
  const handleJoinCommunity = async (communityId: string) => {
    if (!user) {
      navigate('/');
      return;
    }
    const isMember = memberships.some(m => m.community_id === communityId && m.joined);
    if (isMember) return;
    const {
      error
    } = await supabase.from('memberships').insert({
      community_id: communityId,
      user_id: user.id
    });
    if (!error) {
      setMemberships([...memberships, {
        community_id: communityId,
        joined: true
      }]);
    }
  };
  const isJoined = (communityId: string) => {
    return memberships.some(m => m.community_id === communityId && m.joined);
  };
  return <div className="space-y-4 lg:sticky lg:top-4">
    {/* Trending Topics */}
    <Card className="shadow-sm rounded-xl bg-white border border-gray-100 overflow-hidden">
      <CardHeader className="p-4 pb-3 bg-blue-50/30">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900">
          <Sparkles className="h-4 w-4 text-[#3b82f6]" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {trendingTopics.length > 0 ? trendingTopics.map(topic => <Badge key={topic.tag} variant="secondary" onClick={() => onTagClick(topic.tag)} className="cursor-pointer bg-gray-100 hover:bg-[#0030E3] hover:text-white transition-all duration-200 border-0 text-sm px-3 py-1.5 font-medium">
            #{topic.tag}
            <span className="ml-1.5 text-xs opacity-70">({topic.post_count})</span>
          </Badge>) : <p className="text-xs text-gray-500">No trending topics yet</p>}
        </div>
      </CardContent>
    </Card>

    {/* Top Communities */}
    <Card className="shadow-sm rounded-xl bg-white border border-gray-100">
      <CardHeader className="p-4 pb-3 bg-teal-50/30">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900">
          <Users className="h-4 w-4 text-[#3b82f6]" />
          Top Communities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {topCommunities.map(community => {
          const joined = isJoined(community.id);
          return <div key={community.id} className="flex items-center justify-between hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-all duration-200 cursor-pointer group" onClick={() => navigate(`/community/${community.id}`)}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={community.imageurl} />
                <AvatarFallback className="bg-[#0030E3] text-white text-xs font-semibold">
                  {community.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {community.name}
                </p>
                <p className="text-xs text-gray-500">
                  {community.membercount?.toLocaleString() || 0} members
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={e => {
              e.stopPropagation();
              if (!joined) handleJoinCommunity(community.id);
            }} disabled={joined} className={`h-8 text-xs px-3 ${joined ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'} transition-all duration-200`}>
              {joined ? 'Joined' : 'Join'}
            </Button>
          </div>;
        })}
      </CardContent>
    </Card>

    {/* Upcoming Events */}
    <Card className="shadow-sm rounded-xl bg-white border border-gray-100">
      <CardHeader className="p-4 pb-3 bg-purple-50/30">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900">
          <Calendar className="h-4 w-4 text-[#3b82f6]" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {upcomingEvents.length > 0 ? upcomingEvents.map(event => <div key={event.id} className="hover:bg-blue-50 p-3 -mx-2 rounded-lg transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-[#3b82f6] hover:shadow-sm">
          <p className="text-sm font-semibold text-gray-900">{event.title}</p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-[#3b82f6] font-medium">
              📅 {format(new Date(event.event_date), 'MMM dd, yyyy')} • {event.event_time?.slice(0, 5) || 'TBA'}
            </p>
            <Button size="sm" className="h-6 text-xs px-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white">
              Join
            </Button>
          </div>
        </div>) : <p className="text-xs text-gray-500 text-center py-4">No upcoming events</p>}
      </CardContent>
    </Card>
  </div>;
}
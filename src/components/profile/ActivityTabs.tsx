import { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { safeFetch } from "../../utils/safeFetch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "../../components/ui/skeleton";
import {
  AlertCircle,
  FileText,
  MessageSquare,
  Bell,
  AtSign,
  Megaphone,
  Info,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  community_name: string;
  community_id: string;
}
interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_title: string;
  post_id: string;
}
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
  related_user: {
    username: string;
    avatar_url: string | null;
  } | null;
  community: {
    name: string;
  } | null;
}
interface ActivityTabsProps {
  userId: string;
  isOwnProfile?: boolean;
}
export function ActivityTabs({
  userId,
  isOwnProfile = false,
}: ActivityTabsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );
  useEffect(() => {
    fetchPosts();
    fetchComments();
    if (isOwnProfile) {
      fetchNotifications();
    }
  }, [userId, isOwnProfile]);
  const fetchPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    const query = supabase
      .from("posts")
      .select(
        `
        id,
        title,
        content,
        created_at,
        communities!posts_community_id_fkey (
          id,
          name
        )
      `
      )
      .eq("created_by", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(10);
    const [data, err] = await safeFetch(query);
    if (err) {
      setPostsError("Failed to load posts");
      setPostsLoading(false);
      return;
    }
    if (data) {
      const formattedPosts = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        created_at: item.created_at,
        community_name: item.communities?.name || "Unknown",
        community_id: item.communities?.id || "",
      }));
      setPosts(formattedPosts);
    }
    setPostsLoading(false);
  };
  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentsError(null);
    const query = supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        posts!comments_post_id_fkey (
          id,
          title
        )
      `
      )
      .eq("created_by", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(10);
    const [data, err] = await safeFetch(query);
    if (err) {
      setCommentsError("Failed to load comments");
      setCommentsLoading(false);
      return;
    }
    if (data) {
      const formattedComments = data.map((item: any) => ({
        id: item.id,
        content: item.content,
        created_at: item.created_at,
        post_title: item.posts?.title || "Unknown Post",
        post_id: item.posts?.id || "",
      }));
      setComments(formattedComments);
    }
    setCommentsLoading(false);
  };
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError(null);
    const query = supabase
      .from("notifications")
      .select(
        `
        id,
        type,
        title,
        message,
        link,
        is_read,
        created_at,
        related_user:users_local!notifications_related_user_id_fkey (
          username,
          avatar_url
        ),
        community:communities!notifications_community_id_fkey (
          name
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(20);
    const [data, err] = await safeFetch(query);
    if (err) {
      setNotificationsError("Failed to load notifications");
      setNotificationsLoading(false);
      return;
    }
    if (data) {
      const formattedNotifications = data.map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        link: item.link,
        is_read: item.is_read,
        created_at: item.created_at,
        related_user: item.related_user
          ? {
              username: item.related_user.username,
              avatar_url: item.related_user.avatar_url,
            }
          : null,
        community: item.community
          ? {
              name: item.community.name,
            }
          : null,
      }));
      console.log(formattedNotifications);
      setNotifications(formattedNotifications);
    }
    setNotificationsLoading(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reply":
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-600" />;
      case "moderation_alert":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "community_update":
        return <Megaphone className="h-4 w-4 text-green-600" />;
      case "system":
        return <Info className="h-4 w-4 text-gray-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <Tabs defaultValue="posts" className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4"
            >
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger
                value="notifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="posts" className="p-6 m-0">
          {postsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : postsError ? (
            <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{postsError}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchPosts}>
                Retry
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No posts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="block border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:shadow-sm transition-all hover-scale"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {post.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(post.created_at), "MMM d")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                      {post.community_name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments" className="p-6 m-0">
          {commentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : commentsError ? (
            <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{commentsError}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={fetchComments}>
                Retry
              </Button>
            </div>
          ) : comments.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Link
                  key={comment.id}
                  to={`/post/${comment.post_id}`}
                  className="block border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:shadow-sm transition-all hover-scale"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs text-gray-500">
                      Comment on:{" "}
                      <span className="font-medium text-gray-700">
                        {comment.post_title}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(comment.created_at), "MMM d")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {comment.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="notifications" className="p-6 m-0">
            {notificationsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : notificationsError ? (
              <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{notificationsError}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchNotifications}
                >
                  Retry
                </Button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 transition-all ${
                      notification.is_read
                        ? "border-gray-100 bg-white"
                        : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2">
                          {notification.community && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 text-xs"
                            >
                              {notification.community.name}
                            </Badge>
                          )}
                          {!notification.is_read && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs border-blue-200">
                              New
                            </Badge>
                          )}
                        </div>
                        {notification.link && (
                          <Link
                            to={notification.link}
                            className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

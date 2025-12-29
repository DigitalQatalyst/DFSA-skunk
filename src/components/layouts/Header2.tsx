import { useEffect, useState } from 'react';
import { useAuth } from '../../context/UnifiedAuthProvider';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { LoginForm } from '../auth/LoginForm';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { LogOut, User, LogIn, Shield, BarChart3, Bell, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { NotificationsDrawer } from '../notifications/NotificationsDrawer';
import { supabase } from '../../supabase/client';
import { safeFetch } from '../../utils/safeFetch';
import { Badge } from '../ui/badge';
import { BurgerMenuButton } from '../AppSidebar';
interface HeaderProps {
  toggleSidebar?: () => void;
  sidebarOpen?: boolean;
}
export function Header({
  toggleSidebar,
  sidebarOpen
}: HeaderProps = {}) {
  const {
    user,
    signOut,
    loading
  } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      subscribeToNotifications();
    }
  }, [user]);
  const fetchUnreadCount = async () => {
    if (!user) return;
    const query = supabase.from('notifications').select('id', {
      count: 'exact',
      head: true
    }).eq('user_id', user.id).eq('is_read', false);
    const [data] = await safeFetch(query);
    setUnreadCount(data?.length ?? 0);
  };
  const subscribeToNotifications = () => {
    if (!user) return;
    const channel = supabase.channel('notifications-count').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user.id}`
    }, () => {
      fetchUnreadCount();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  };
  const getUserInitials = () => {
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };
  if (loading) {
    return <header className="sticky top-0 z-50 w-full border-b border-border/40 flex items-center bg-gradient-to-r from-teal-500/95 via-blue-500/95 to-purple-600/95 backdrop-blur">
        <Link to="/" className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-2 px-4 flex items-center h-16">
          <img src="/mzn_logo.svg" alt="Khalifa Fund Logo" className="h-10" />
        </Link>
        <div className="flex-1 flex justify-between items-center bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white px-4 h-16">
        </div>
      </header>;
  }
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 flex items-center bg-gradient-to-r from-teal-500/95 via-blue-500/95 to-purple-600/95 backdrop-blur">
      <Link to="/" className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-2 px-4 flex items-center h-16">
        <img src="/mzn_logo.svg" alt="Khalifa Fund Logo" className="h-10" />
      </Link>
      <div className="flex-1 flex justify-between items-center bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white px-4 h-16">
        <div className="flex items-center gap-4 sm:gap-6">
          {user && toggleSidebar && <BurgerMenuButton onClick={toggleSidebar} className="lg:hidden text-white" isLoggedIn={!!user} />}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/communities" className="hover:text-gray-200 transition-colors duration-200 cursor-pointer">
              Communities
            </Link>
            {user && <Link to="/messages" className="hover:text-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>}
            {user && (user.role === 'admin' || user.role === 'moderator') && <>
                <Link to="/moderation" className="hover:text-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Moderation
                </Link>
                <Link to="/analytics" className="hover:text-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </>}
          </nav>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          {user && <div className="relative">
              <Button variant="ghost" size="sm" onClick={() => setNotificationsOpen(true)} className="relative h-10 w-10 rounded-full p-0 text-white hover:bg-white/20">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>}
              </Button>
            </div>}
          {user ? <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-white/90">
                <span className="font-medium text-white">
                  {user.username || user.email}
                </span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-all hover:bg-white/20">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.username || user.email} />
                      <AvatarFallback className="bg-white/20 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {user.role && <p className="text-xs leading-none text-muted-foreground">
                          Role: <span className="capitalize">{user.role}</span>
                        </p>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> : <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-white/90 transition-opacity shadow-[var(--shadow-soft)]">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="sr-only">Sign In</DialogTitle>
                </DialogHeader>
                <LoginForm onSuccess={() => setLoginDialogOpen(false)} />
              </DialogContent>
            </Dialog>}
        </nav>
      </div>
      <NotificationsDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </header>;
}
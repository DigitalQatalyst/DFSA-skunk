/**
 * Query key factory for dashboard-related queries
 * 
 * Provides consistent query key structure for React Query cache management.
 * All dashboard queries should use these keys for proper cache invalidation.
 * 
 * Usage:
 *   const { data } = useQuery({
 *     queryKey: dashboardKeys.metrics('30d'),
 *     queryFn: () => fetchMetrics('30d'),
 *   });
 * 
 *   // Invalidate all metrics queries
 *   queryClient.invalidateQueries({ queryKey: dashboardKeys.metrics.all });
 */
export const dashboardKeys = {
  /**
   * All dashboard queries
   */
  all: ['dashboard'] as const,

  /**
   * Dashboard overview (aggregated data)
   */
  overview: {
    all: ['dashboard', 'overview'] as const,
    detail: () => [...dashboardKeys.overview.all] as const,
  },

  /**
   * Onboarding progress queries
   */
  onboardingProgress: {
    all: ['dashboard', 'onboarding-progress'] as const,
    detail: () => [...dashboardKeys.onboardingProgress.all] as const,
  },

  /**
   * Metrics queries
   */
  metrics: {
    all: ['dashboard', 'metrics'] as const,
    detail: (period: '30d' | '90d' | '12m') => 
      [...dashboardKeys.metrics.all, period] as const,
    lists: () => [...dashboardKeys.metrics.all, 'list'] as const,
  },

  /**
   * Obligations queries
   */
  obligations: {
    all: ['dashboard', 'obligations'] as const,
    detail: (id: string) => 
      [...dashboardKeys.obligations.all, id] as const,
    lists: (window?: '30d' | 'overdue' | 'all') => 
      [...dashboardKeys.obligations.all, 'list', window] as const,
  },

  /**
   * Service requests queries
   */
  serviceRequests: {
    all: ['dashboard', 'service-requests'] as const,
    detail: (id: string) => 
      [...dashboardKeys.serviceRequests.all, id] as const,
    lists: (limit?: number) => 
      [...dashboardKeys.serviceRequests.all, 'list', limit] as const,
    recent: (limit?: number) => 
      [...dashboardKeys.serviceRequests.all, 'recent', limit] as const,
  },

  /**
   * Announcements queries
   */
  announcements: {
    all: ['dashboard', 'announcements'] as const,
    detail: (id: string) => 
      [...dashboardKeys.announcements.all, id] as const,
    lists: (limit?: number) => 
      [...dashboardKeys.announcements.all, 'list', limit] as const,
  },

  /**
   * Notifications queries
   */
  notifications: {
    all: ['dashboard', 'notifications'] as const,
    detail: (id: string) => 
      [...dashboardKeys.notifications.all, id] as const,
    lists: (limit?: number, filters?: { read?: boolean }) => 
      [...dashboardKeys.notifications.all, 'list', limit, filters] as const,
    unread: () => 
      [...dashboardKeys.notifications.all, 'unread'] as const,
  },

  /**
   * Quick actions queries
   */
  quickActions: {
    all: ['dashboard', 'quick-actions'] as const,
    detail: () => [...dashboardKeys.quickActions.all] as const,
  },
} as const;


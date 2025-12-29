import { QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance with conservative caching defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
      gcTime: 5 * 60 * 1000, // 5 minutes - cache time (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus for profile data
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});

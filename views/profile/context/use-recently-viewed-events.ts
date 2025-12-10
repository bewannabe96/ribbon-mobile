import { useScreenContext } from "@/views/profile/context/profile-screen-context";

export function useRecentlyViewedEvents() {
  const {
    recentlyViewedEvents,
    isRecentlyViewedLoading,
    recentlyViewedNextToken,
  } = useScreenContext();

  return {
    recentlyViewedEvents,
    isLoading: isRecentlyViewedLoading,
    hasMore: recentlyViewedNextToken !== null,
  };
}

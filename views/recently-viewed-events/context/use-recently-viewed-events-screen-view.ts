import { useScreenContext } from "@/views/recently-viewed-events/context/recently-viewed-events-screen-context";

export function useRecentlyViewedEventsScreenView() {
  const { events, isLoading, nextToken } = useScreenContext();

  return {
    events,
    isLoading,
    nextToken,
  };
}

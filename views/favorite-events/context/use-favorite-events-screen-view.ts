import { useScreenContext } from "@/views/favorite-events/context/favorite-events-screen-context";

export function useFavoriteEventsScreenView() {
  const { events, isLoading, nextToken } = useScreenContext();

  return {
    events,
    isLoading,
    nextToken,
  };
}

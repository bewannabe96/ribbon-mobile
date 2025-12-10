import { useScreenContext } from "@/views/recommend/context/recommend-screen-context";

export function useRecommendScreenView() {
  const { customEvents, ongoingEvents, newEvents, isLoading } =
    useScreenContext();

  return {
    customEvents,
    ongoingEvents,
    newEvents,
    isLoading,
  };
}

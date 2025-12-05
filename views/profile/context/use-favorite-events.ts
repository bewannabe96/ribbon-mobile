import { useScreenContext } from "@/views/profile/context/profile-screen-context";

export function useFavoriteEvents() {
  const { favoriteEvents, isFavoriteLoading, favoriteNextToken } =
    useScreenContext();

  return {
    favoriteEvents,
    isLoading: isFavoriteLoading,
    hasMore: favoriteNextToken !== null,
  };
}

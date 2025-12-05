import { useEffect } from "react";
import { useOperation } from "@/views/profile/context/use-operation";
import { useAuth } from "@/contexts/AuthContext";

export function useScreenEffect() {
  const { isSignedIn } = useAuth();
  const {
    fetchFavoriteEvents,
    fetchRecentlyViewedEvents,
    emptyFavoriteEvents,
    emptyRecentlyViewedEvents,
  } = useOperation();

  useEffect(() => {
    if (isSignedIn) {
      fetchFavoriteEvents().then();
      fetchRecentlyViewedEvents().then();
    } else {
      emptyFavoriteEvents();
      emptyRecentlyViewedEvents();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);
}

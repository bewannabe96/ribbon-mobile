import { useCallback } from "react";
import { useOperation } from "@/views/profile/context/use-operation";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect } from "expo-router";
import { useLatest } from "@/hooks/use-latest";

export function useScreenEffect() {
  const { isSignedIn } = useAuth();
  const {
    loadFavoriteEvents,
    loadRecentlyViewedEvents,
    emptyFavoriteEvents,
    emptyRecentlyViewedEvents,
  } = useOperation();

  const loadFavoriteEventsRef = useLatest(loadFavoriteEvents);
  const loadRecentlyViewedEventsRef = useLatest(loadRecentlyViewedEvents);
  const emptyFavoriteEventsRef = useLatest(emptyFavoriteEvents);
  const emptyRecentlyViewedEventsRef = useLatest(emptyRecentlyViewedEvents);

  useFocusEffect(
    useCallback(() => {
      if (isSignedIn) {
        loadFavoriteEventsRef.current().then();
        loadRecentlyViewedEventsRef.current().then();
      } else {
        emptyFavoriteEventsRef.current();
        emptyRecentlyViewedEventsRef.current();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn]),
  );
}

import { useCallback } from "react";
import {
  ProfileEvent,
  useScreenContext,
} from "@/views/profile/context/profile-screen-context";
import { EventService, Event } from "@/lib/services";
import { DateTime } from "luxon";
import { useFavoriteEventsStore, useRecentlyViewedEventsStore } from "@/store";

function mapEventToProfileEvent(event: Event): ProfileEvent {
  const location =
    event.districts.length === 0 ? null : event.districts.join(" ");

  return {
    id: event.id,
    uuid: event.uuid,
    title: event.name,
    periodStart: DateTime.fromISO(event.period.start),
    periodEnd: DateTime.fromISO(event.period.end),
    location: location,
    participationFee: event.participationFee,
  };
}

export function useOperation() {
  const {
    favoriteEvents,
    recentlyViewedEvents,
    favoriteEventsLastLoadedAt,
    recentlyViewedEventsLastLoadedAt,
    setRecentlyViewedEventsLastLoadedAt,
    setFavoriteEventsLastLoadedAt,
    setFavoriteEvents,
    setRecentlyViewedEvents,
    setIsFavoriteLoading,
    setIsRecentlyViewedLoading,
    setFavoriteNextToken,
    setRecentlyViewedNextToken,
  } = useScreenContext();

  const favoriteEventsStore = useFavoriteEventsStore();
  const recentlyViewedEventsStore = useRecentlyViewedEventsStore();

  const loadFavoriteEvents = useCallback(async () => {
    if (
      favoriteEvents !== null &&
      favoriteEventsStore.lastUpdatedAt <= favoriteEventsLastLoadedAt
    ) {
      return;
    }

    try {
      setIsFavoriteLoading(true);
      const result = await EventService.getFavoriteEvents(null, 5);
      setFavoriteEvents(result.events.map(mapEventToProfileEvent));
      setFavoriteEventsLastLoadedAt(Date.now());
      setFavoriteNextToken(result.nextToken);
    } catch (e) {
      throw e;
    } finally {
      setIsFavoriteLoading(false);
    }
  }, [
    favoriteEvents,
    favoriteEventsStore.lastUpdatedAt,
    favoriteEventsLastLoadedAt,
    setIsFavoriteLoading,
    setFavoriteEvents,
    setFavoriteEventsLastLoadedAt,
    setFavoriteNextToken,
  ]);

  const loadRecentlyViewedEvents = useCallback(async () => {
    if (
      recentlyViewedEvents !== null &&
      recentlyViewedEventsStore.lastUpdatedAt <=
        recentlyViewedEventsLastLoadedAt
    ) {
      return;
    }

    try {
      setIsRecentlyViewedLoading(true);
      const result = await EventService.getViewHistory(null, 5);
      setRecentlyViewedEvents(result.events.map(mapEventToProfileEvent));
      setRecentlyViewedEventsLastLoadedAt(Date.now());
      setRecentlyViewedNextToken(result.nextToken);
    } catch (e) {
      throw e;
    } finally {
      setIsRecentlyViewedLoading(false);
    }
  }, [
    recentlyViewedEventsLastLoadedAt,
    recentlyViewedEventsStore.lastUpdatedAt,
    setIsRecentlyViewedLoading,
    setRecentlyViewedEvents,
    setRecentlyViewedEventsLastLoadedAt,
    setRecentlyViewedNextToken,
  ]);

  const emptyFavoriteEvents = useCallback(() => {
    setFavoriteEvents([]);
    setFavoriteEventsLastLoadedAt(0);
    setFavoriteNextToken(null);
  }, [setFavoriteEvents, setFavoriteEventsLastLoadedAt, setFavoriteNextToken]);

  const emptyRecentlyViewedEvents = useCallback(() => {
    setRecentlyViewedEvents([]);
    setRecentlyViewedEventsLastLoadedAt(0);
    setRecentlyViewedNextToken(null);
  }, [
    setRecentlyViewedEvents,
    setRecentlyViewedEventsLastLoadedAt,
    setRecentlyViewedNextToken,
  ]);

  return {
    loadFavoriteEvents,
    loadRecentlyViewedEvents,
    emptyFavoriteEvents,
    emptyRecentlyViewedEvents,
  };
}

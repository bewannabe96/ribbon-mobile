import { useCallback } from "react";
import {
  ProfileEvent,
  useScreenContext,
} from "@/views/profile/context/profile-screen-context";
import { EventService, Event } from "@/lib/services";
import { DateTime } from "luxon";

function mapEventToProfileEvent(event: Event): ProfileEvent {
  const location =
    event.districts.length === 0 ? null : event.districts.join(" ");

  return {
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
    setFavoriteEvents,
    setRecentlyViewedEvents,
    setIsFavoriteLoading,
    setIsRecentlyViewedLoading,
    setFavoriteNextToken,
    setRecentlyViewedNextToken,
  } = useScreenContext();

  const fetchFavoriteEvents = useCallback(async () => {
    try {
      setIsFavoriteLoading(true);
      const result = await EventService.getFavoriteEvents(null, 3);
      setFavoriteEvents(result.events.map(mapEventToProfileEvent));
      setFavoriteNextToken(result.nextToken);
    } catch (e) {
      throw e;
    } finally {
      setIsFavoriteLoading(false);
    }
  }, [setFavoriteEvents, setIsFavoriteLoading, setFavoriteNextToken]);

  const fetchRecentlyViewedEvents = useCallback(async () => {
    try {
      setIsRecentlyViewedLoading(true);
      const result = await EventService.getViewHistory(null, 3);
      setRecentlyViewedEvents(result.events.map(mapEventToProfileEvent));
      setRecentlyViewedNextToken(result.nextToken);
    } catch (e) {
      throw e;
    } finally {
      setIsRecentlyViewedLoading(false);
    }
  }, [
    setRecentlyViewedEvents,
    setIsRecentlyViewedLoading,
    setRecentlyViewedNextToken,
  ]);

  const emptyFavoriteEvents = useCallback(() => {
    setFavoriteEvents([]);
    setFavoriteNextToken(null);
  }, [setFavoriteEvents, setFavoriteNextToken]);

  const emptyRecentlyViewedEvents = useCallback(() => {
    setRecentlyViewedEvents([]);
    setRecentlyViewedNextToken(null);
  }, [setRecentlyViewedEvents, setRecentlyViewedNextToken]);

  return {
    fetchFavoriteEvents,
    fetchRecentlyViewedEvents,
    emptyFavoriteEvents,
    emptyRecentlyViewedEvents,
  };
}

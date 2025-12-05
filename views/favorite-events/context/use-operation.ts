import { useCallback } from "react";
import { Event, EventService } from "@/lib/services";
import {
  FavoriteEventItem,
  useScreenContext,
} from "@/views/favorite-events/context/favorite-events-screen-context";
import { DateTime } from "luxon";

function mapEventToFavoriteEventItem(event: Event): FavoriteEventItem {
  const registrationSession = event.registrationSessions[0];
  const registrationOpen = registrationSession?.open
    ? DateTime.fromISO(registrationSession.open)
    : null;
  const registrationClose = registrationSession?.close
    ? DateTime.fromISO(registrationSession.close)
    : null;

  const location =
    event.districts.length === 0 ? null : event.districts.join(" ");

  return {
    uuid: event.uuid,
    subName: event.originalName,
    mainName: event.name,
    location: location,
    fee: event.participationFee,
    category: event.category.name,
    tags: event.tags.map(({ name }) => name),
    registrationStatus: event.registrationStatus,
    status: event.status,
    registrationSession: { open: registrationOpen, close: registrationClose },
    period: {
      start: DateTime.fromISO(event.period.start),
      end: DateTime.fromISO(event.period.end),
    },
  };
}

export function useOperation() {
  const { events, setEvents, nextToken, setNextToken, setIsLoading } =
    useScreenContext();

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await EventService.getFavoriteEvents(null, 20);
      setEvents(result.events.map(mapEventToFavoriteEventItem));
      setNextToken(result.nextToken);
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setEvents, setNextToken]);

  const loadNextPage = useCallback(async () => {
    if (!nextToken) return;
    try {
      const result = await EventService.getFavoriteEvents(nextToken, 20);
      setEvents([...events, ...result.events.map(mapEventToFavoriteEventItem)]);
      setNextToken(result.nextToken);
    } catch (e) {
      throw e;
    }
  }, [nextToken, events, setEvents, setNextToken]);

  return {
    loadEvents,
    loadNextPage,
  };
}

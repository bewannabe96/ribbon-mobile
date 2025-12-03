import { useCallback } from "react";
import {
  type RecommendEvent,
  useScreenContext,
} from "@/views/recommend/context/recommend-screen-context";
import { DateTime } from "luxon";
import { EventService } from "@/lib/services";
import { Event } from "@/lib/services/dto/common.dto";

function mapEventToRecommendEvent(event: Event): RecommendEvent {
  const registrationSession = event.registrationSessions[0];
  const registrationStart = registrationSession?.open
    ? DateTime.fromISO(registrationSession.open)
    : null;
  const registrationEnd = registrationSession?.close
    ? DateTime.fromISO(registrationSession.close)
    : null;

  return {
    uuid: event.uuid,
    name: event.name,
    category: event.category.name,
    registrationStart,
    registrationEnd,
    eventStart: DateTime.fromISO(event.period.start),
    eventEnd: DateTime.fromISO(event.period.end),
    location: event.districts?.join(" ") ?? null,
    participationFee: event.participationFee,
    registrationStatus: event.registrationStatus,
  };
}

export function useOperation() {
  const { setCustomEvents, setOngoingEvents, setNewEvents, setIsLoading } =
    useScreenContext();

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);

      // API 호출
      const [personalizedData, ongoingData, newData] = await Promise.all([
        EventService.searchEvents(null, {}, 10),
        EventService.getOngoingFestivals(null, 10),
        EventService.getNewlyCreatedEvents(null, 10),
      ]);

      const personalizedEvents = personalizedData.events.map((event, index) =>
        mapEventToRecommendEvent(event),
      );
      const ongoingEvents = ongoingData.events.map((event, index) =>
        mapEventToRecommendEvent(event),
      );
      const newEvents = newData.events.map((event, index) =>
        mapEventToRecommendEvent(event),
      );

      setCustomEvents(personalizedEvents);
      setOngoingEvents(ongoingEvents);
      setNewEvents(newEvents);
    } catch (e) {
      console.error("Failed to load recommendations:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [setCustomEvents, setOngoingEvents, setNewEvents, setIsLoading]);

  return {
    loadRecommendations,
  };
}

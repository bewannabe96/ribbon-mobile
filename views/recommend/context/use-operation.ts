import { useCallback } from "react";
import {
  type RecommendEvent,
  useScreenContext,
} from "@/views/recommend/context/recommend-screen-context";
import { DateTime } from "luxon";
import { EventService } from "@/lib/services";
import { Event } from "@/lib/services/dto/common.dto";
import Storage from "@/lib/storage";
import { SearchEventsFilters } from "@/lib/services/dto";
import { SearchFilter } from "@/views/search/context/search-screen-context";

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
    location: event.districts.length === 0 ? null : event.districts.join(" "),
    participationFee: event.participationFee,
    registrationStatus: event.registrationStatus,
  };
}

function convertToSearchEventsFilters(
  filter: SearchFilter,
): SearchEventsFilters {
  const filters: SearchEventsFilters = {};

  if (filter.categories.length > 0) {
    filters.categories = filter.categories as any[];
  }

  if (filter.districts.length > 0) {
    filters.districts = filter.districts;
  }

  if (filter.minFee !== null) {
    filters.minParticipationFee = filter.minFee;
  }

  if (filter.maxFee !== null) {
    filters.maxParticipationFee = filter.maxFee;
  }

  if (filter.tags.length > 0) {
    filters.tags = filter.tags;
  }

  if (filter.status !== null) {
    filters.registrationStatus = filter.status;
  }

  if (filter.residenceOnly) {
    filters.targetResidencesDistrict = filter.districts;
  }

  return filters;
}

export function useOperation() {
  const { setCustomEvents, setOngoingEvents, setNewEvents, setIsLoading } =
    useScreenContext();

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load saved search filters from storage
      const savedFilters = await Storage.getSearchFilters();

      // Prepare filters for personalized events with "opened" status
      let personalizedFilters: SearchEventsFilters;

      if (savedFilters !== null) {
        personalizedFilters = convertToSearchEventsFilters(savedFilters);
        personalizedFilters.registrationStatus = "opened";
      } else {
        personalizedFilters = { registrationStatus: "opened" };
      }

      // Load personalized events with filters
      const personalizedData = await EventService.searchEvents(
        null,
        personalizedFilters,
        10,
      );

      let personalizedEvents = personalizedData.events.map(
        mapEventToRecommendEvent,
      );

      // If less than 10 events, fill remaining slots with random "opened" events
      if (personalizedEvents.length < 10) {
        const remaining = 10 - personalizedEvents.length;
        const randomData = await EventService.searchEvents(
          null,
          { registrationStatus: "opened" },
          100,
        );

        // Get event UUIDs to exclude already selected ones
        const selectedUuids = new Set(personalizedEvents.map((e) => e.uuid));

        // Filter out already selected events and shuffle
        const availableEvents = randomData.events.filter(
          (event) => !selectedUuids.has(event.uuid),
        );

        const shuffled = availableEvents
          .map((event) => ({ event, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ event }) => event)
          .slice(0, remaining);

        const additionalEvents = shuffled.map(mapEventToRecommendEvent);
        personalizedEvents = [...personalizedEvents, ...additionalEvents];
      }

      // Load other sections in parallel
      const [ongoingData, newData] = await Promise.all([
        EventService.getOngoingFestivals(null, 10),
        EventService.getNewlyCreatedEvents(null, 10),
      ]);

      const ongoingEvents = ongoingData.events.map(mapEventToRecommendEvent);
      const newEvents = newData.events.map(mapEventToRecommendEvent);

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

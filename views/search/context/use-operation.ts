import { useCallback, useMemo } from "react";
import { Event, EventService } from "@/lib/services";
import {
  SearchItem,
  useScreenContext,
  SearchFilter,
} from "@/views/search/context/search-screen-context";
import { SearchEventsFilters } from "@/lib/services/dto";
import { DateTime } from "luxon";

function mapEventToSearchItem(event: Event): SearchItem {
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
  const {
    searchItems,
    setSearchItems,
    nextToken,
    setNextToken,
    setIsSearching,
    isSearching,
    filter,
  } = useScreenContext();

  const searchFilters = useMemo(
    () => convertToSearchEventsFilters(filter),
    [filter],
  );

  const search = useCallback(async () => {
    if (isSearching) return;

    try {
      setIsSearching(true);
      const result = await EventService.searchEvents(null, searchFilters);
      setSearchItems(result.events.map(mapEventToSearchItem));
      setNextToken(result.nextToken);
    } catch (e) {
      throw e;
    } finally {
      setIsSearching(false);
    }
  }, [
    isSearching,
    setIsSearching,
    setSearchItems,
    setNextToken,
    searchFilters,
  ]);

  const loadNextPage = useCallback(async () => {
    if (!nextToken) return;
    try {
      const result = await EventService.searchEvents(nextToken, searchFilters);
      setSearchItems([
        ...searchItems,
        ...result.events.map(mapEventToSearchItem),
      ]);
      setNextToken(result.nextToken);
    } catch (e) {
      throw e;
    }
  }, [nextToken, searchItems, setSearchItems, setNextToken, searchFilters]);

  return {
    search,
    loadNextPage,
  };
}

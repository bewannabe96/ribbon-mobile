import { useCallback, useMemo, useState } from "react";
import { useScreenContext } from "./event-detail-screen-context";
import { DateTime } from "luxon";
import { useLocalSearchParams } from "expo-router";
import { calculateRegistrationStatus } from "@/lib/utils/calculate-registration-status";
import type { RegistrationStatus } from "@/lib/utils/calculate-registration-status";

export function useEventDetailScreenView() {
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();

  const { eventDetail } = useScreenContext();

  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = useCallback(async () => {
    setIsFavorite((prev) => !prev);
    // TODO: Add API call to update favorite status
  }, []);

  const externalShareUrl = useMemo(() => {
    return `https://www.naver.com/${eventUuid}`;
  }, [eventUuid]);

  const registrationStatus = useMemo<RegistrationStatus | null>(() => {
    if (!eventDetail) return null;
    return calculateRegistrationStatus(
      eventDetail.registrationSessions,
      eventDetail.period.start,
      DateTime.now(),
    );
  }, [eventDetail]);

  return {
    eventDetail,
    isFavorite,
    externalShareUrl,
    registrationStatus,
    //
    toggleFavorite,
  };
}

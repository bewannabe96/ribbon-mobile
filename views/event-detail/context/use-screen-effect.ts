import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useOperation } from "@/views/event-detail/context/use-operation";
import { useAuth } from "@/contexts/AuthContext";

export function useScreenEffect() {
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();
  const { loadEventDetail, recordEventView } = useOperation();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    loadEventDetail(eventUuid).then();

    if (isSignedIn) {
      recordEventView(eventUuid).then();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventUuid]);
}

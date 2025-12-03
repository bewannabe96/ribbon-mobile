import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useOperation } from "@/views/event-detail/context/use-operation";

export function useScreenEffect() {
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();

  const { loadEventDetail } = useOperation();

  useEffect(() => {
    loadEventDetail(eventUuid).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventUuid]);
}

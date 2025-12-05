import { useEffect } from "react";
import { useOperation } from "@/views/recently-viewed-events/context/use-operation";

export function useScreenEffect() {
  const { loadEvents } = useOperation();

  useEffect(() => {
    loadEvents().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

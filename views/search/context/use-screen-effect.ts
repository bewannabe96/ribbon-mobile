import { useScreenContext } from "@/views/search/context/search-screen-context";
import { useEffect } from "react";
import { useOperation } from "@/views/search/context/use-operation";

export function useScreenEffect() {
  const { filter, isFilterLoaded } = useScreenContext();
  const { search, loadFilters, saveFilters } = useOperation();

  // Load saved filters on mount
  useEffect(() => {
    loadFilters().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save filters whenever they change (after initial load)
  useEffect(() => {
    if (isFilterLoaded) {
      saveFilters(filter).then();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, isFilterLoaded]);

  // Trigger search when filter changes (after initial load)
  useEffect(() => {
    if (isFilterLoaded) {
      search().then();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, isFilterLoaded]);
}

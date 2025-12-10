import { useScreenContext } from "@/views/search/context/search-screen-context";

export function useSearchFilters() {
  const { filter, dispatchFilter } = useScreenContext();
  return { filter, dispatchFilter };
}

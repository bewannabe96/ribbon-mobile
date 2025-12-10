import { useScreenContext } from "@/views/search/context/search-screen-context";

export function useSearchScreenView() {
  const { searchItems, nextToken, isSearching } = useScreenContext();

  return { searchItems, nextToken, isSearching };
}

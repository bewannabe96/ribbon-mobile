import SearchScreenView from "@/views/search/search-screen-view";
import { SearchProvider } from "@/views/search/context/search-screen-context";

export default function SearchScreen() {
  return (
    <SearchProvider>
      <SearchScreenView />
    </SearchProvider>
  );
}

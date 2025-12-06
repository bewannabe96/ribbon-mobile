import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchFilter } from "@/views/search/context/search-screen-context";

const KEYS = {
  SEARCH_FILTERS: "@search_filters",
} as const;

/**
 * Service for managing app's persistent local storage
 */
class Storage {
  /**
   * Saves search filters to local storage
   * @param filters Search filter object to save
   */
  static async setSearchFilters(filters: SearchFilter): Promise<void> {
    try {
      const jsonValue = JSON.stringify(filters);
      await AsyncStorage.setItem(KEYS.SEARCH_FILTERS, jsonValue);
    } catch (e) {
      console.error("Failed to save search filters:", e);
      throw e;
    }
  }

  /**
   * Retrieves search filters from local storage
   * @returns Saved search filters or null if not found
   */
  static async getSearchFilters(): Promise<SearchFilter | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.SEARCH_FILTERS);
      if (jsonValue === null) {
        return null;
      }
      return JSON.parse(jsonValue) as SearchFilter;
    } catch (e) {
      console.error("Failed to load search filters:", e);
      throw e;
    }
  }

  /**
   * Removes search filters from local storage
   */
  static async clearSearchFilters(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.SEARCH_FILTERS);
    } catch (e) {
      console.error("Failed to clear search filters:", e);
      throw e;
    }
  }
}

export default Storage;

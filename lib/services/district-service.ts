import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/supabase-types";

type DBDistrict = Tables<"district">;

/**
 * Service for managing district data from the database.
 * Handles fetching and organizing hierarchical district information.
 */
class DistrictService {
  /**
   * Fetches all districts from the database.
   * Returns districts organized by level (1 and 2) with parent relationships.
   * @returns Object containing level 1 districts map and level 2 districts grouped by parent ID
   */
  static async fetchDistricts(): Promise<{
    level1Map: Map<string, DBDistrict>;
    level2Map: Map<string, DBDistrict[]>;
  }> {
    // Fetch level 1 and level 2 districts in parallel
    const [level1Result, level2Result] = await Promise.all([
      supabase.from("district").select("*").eq("level", 1),
      supabase.from("district").select("*").eq("level", 2),
    ]);

    if (level1Result.error) {
      throw new Error(
        `Failed to fetch level 1 districts from database: ${level1Result.error.message}`,
      );
    }

    if (level2Result.error) {
      throw new Error(
        `Failed to fetch level 2 districts from database: ${level2Result.error.message}`,
      );
    }

    const level1Districts = level1Result.data || [];
    const level2Districts = level2Result.data || [];

    // Create maps for quick lookup
    const level1Map = new Map<string, DBDistrict>();
    const level2Map = new Map<string, DBDistrict[]>();

    level1Districts.forEach((district) => {
      level1Map.set(district.name, district);
    });

    level2Districts.forEach((district) => {
      if (district.parent_district_id) {
        const parentId = district.parent_district_id;
        if (!level2Map.has(String(parentId))) {
          level2Map.set(String(parentId), []);
        }
        level2Map.get(String(parentId))!.push(district);
      }
    });

    return { level1Map, level2Map };
  }
}

export default DistrictService;

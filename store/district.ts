import { create } from "zustand";
import { useCallback, useMemo } from "react";
import { matchJaso } from "@/lib/utils/korean-jaso-search";
import DistrictService from "@/lib/services/district-service";

type District = { id: number; name: string };

type DistrictTree = {
  firstLevels: (District & { secondLevels: District[] })[];
};

const LEVEL_ONE_ID_ORDER = [
  1, // 서울
  50, // 부산
  // 대구
  60, // 인천
  // 광주
  65, // 대전
  77, // 울산
  44, // 경기
  71, // 강원
  // 충북
  86, // 충남
  82, // 전북
  // 전남
  56, // 경북
  // 경남
  74, // 제주
];

const LEVEL_ONE_NAMES: Record<number, string> = {
  1: "서울특별시",
  50: "부산광역시",
  // _: "대구광역시",
  60: "인천광역시",
  // _: "광주광역시",
  65: "대전광역시",
  77: "울산광역시",
  44: "경기도",
  71: "강원도",
  // _: "충청북도",
  86: "충청남도",
  82: "전라북도",
  // _: "전라남도",
  56: "경상북도",
  // _: "경상남도",
  74: "제주특별자치도",
};

// ===================================================================
// Zustand Store - Only manages state
// ===================================================================
interface DistrictStoreState {
  districtTree: DistrictTree | null;
  setDistrictTree: (district: DistrictTree | null) => void;
}

const useDistrictStore = create<DistrictStoreState>((set) => ({
  districtTree: null,
  setDistrictTree: (districtTree) => set({ districtTree }),
}));

// ===================================================================
// Custom Hook - Encapsulates business logic
// ===================================================================

// Promise lock to prevent concurrent initialization
let initializingPromise: Promise<void> | null = null;

export function useDistrict() {
  const { districtTree, setDistrictTree } = useDistrictStore();

  const isInitialized = useMemo(() => districtTree !== null, [districtTree]);

  const initialize = useCallback(async () => {
    if (isInitialized) {
      return;
    }

    // If already initializing, return the existing promise
    if (initializingPromise) {
      return initializingPromise;
    }

    initializingPromise = (async () => {
      try {
        // Fetch all districts from database
        const { level1Map, level2Map } = await DistrictService.fetchDistricts();

        if (level1Map.size === 0 && level2Map.size === 0) return;

        // Build tree from DB data only
        const firstLevels = Array.from(level1Map.values()).map(
          (firstLevel) => ({
            id: firstLevel.id,
            name: LEVEL_ONE_NAMES[firstLevel.id] || firstLevel.name, // Override with hardcoded name
            secondLevels: (level2Map.get(String(firstLevel.id)) || []).map(
              (secondLevel) => ({
                id: secondLevel.id,
                name: secondLevel.name,
              }),
            ),
          }),
        );

        // Sort: LEVEL_ONE_ID_ORDER items first (maintaining their order), then others
        firstLevels.sort((a, b) => {
          const aIndex = LEVEL_ONE_ID_ORDER.indexOf(a.id);
          const bIndex = LEVEL_ONE_ID_ORDER.indexOf(b.id);

          // Both in order array - maintain their order
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }

          // Only a is in order array - a comes first
          if (aIndex !== -1) {
            return -1;
          }

          // Only b is in order array - b comes first
          if (bIndex !== -1) {
            return 1;
          }

          // Neither in order array - maintain original order
          return 0;
        });

        const districtTree: DistrictTree = {
          firstLevels,
        };

        setDistrictTree(districtTree);
      } catch (error) {
        console.error("Error initializing district store:", error);
      } finally {
        initializingPromise = null;
      }
    })();

    return initializingPromise;
  }, [isInitialized, setDistrictTree]);

  const getLevelOneDistricts = useCallback((): District[] => {
    if (districtTree === null) {
      initialize().then();
      return [];
    }

    return districtTree.firstLevels.map((value) => ({
      id: value.id,
      name: value.name,
    }));
  }, [districtTree, initialize]);

  const getLevelTwoDistricts = useCallback(
    (levelOneDistrictId: number): District[] => {
      if (districtTree === null) {
        initialize().then();
        return [];
      }

      for (const firstLevel of districtTree.firstLevels) {
        if (firstLevel.id === levelOneDistrictId) {
          return firstLevel.secondLevels.map((value) => ({
            id: value.id,
            name: value.name,
          }));
        }
      }
      return [];
    },
    [districtTree, initialize],
  );

  const getLevelTwoDistrictsByIds = useCallback(
    (ids: number[]): District[] => {
      if (districtTree === null) {
        initialize().then();
        return [];
      }

      const searchResult: Record<number, District> = {};
      for (const firstLevel of districtTree.firstLevels) {
        for (const secondLevel of firstLevel.secondLevels) {
          if (ids.includes(secondLevel.id)) {
            searchResult[secondLevel.id] = secondLevel;
          }
        }
      }

      return ids.map((id) => searchResult[id]);
    },
    [districtTree, initialize],
  );

  const searchDistricts = useCallback(
    (query: string): (District & { parentName: string })[] => {
      if (districtTree === null) {
        initialize().then();
        return [];
      }

      const result: { id: number; name: string; parentName: string }[] = [];
      for (const firstLevel of districtTree.firstLevels) {
        for (const secondLevel of firstLevel.secondLevels) {
          if (matchJaso(query, secondLevel.name)) {
            result.push({
              id: secondLevel.id,
              name: secondLevel.name,
              parentName: firstLevel.name,
            });
          }
        }
      }

      return result;
    },
    [districtTree, initialize],
  );

  return {
    isInitialized,
    initialize,
    getLevelOneDistricts,
    getLevelTwoDistricts,
    getLevelTwoDistrictsByIds,
    searchDistricts,
  };
}

import { create } from "zustand";
import { DateTime } from "luxon";

interface FavoriteEventsStore {
  status: { [uuid: string]: DateTime | null };
  addFavorite: (uuid: string) => void;
  removeFavorite: (uuid: string) => void;
  lastUpdatedAt: number;
}

type Setter = (partial: Partial<FavoriteEventsStore>) => void;

type Getter = () => FavoriteEventsStore;

// ===================================================================
function addFavorite(set: Setter, getState: Getter, uuid: string) {
  const state = getState();

  set({
    status: { ...state.status, [uuid]: DateTime.now() },
    lastUpdatedAt: Date.now(),
  });
}

// ===================================================================
function removeFavorite(set: Setter, getState: Getter, uuid: string) {
  const state = getState();

  set({
    status: { ...state.status, [uuid]: null },
    lastUpdatedAt: Date.now(),
  });
}

// ===================================================================
export const useFavoriteEventsStore = create<FavoriteEventsStore>(
  (set, getState) => ({
    status: {},
    addFavorite: addFavorite.bind(null, set, getState),
    removeFavorite: removeFavorite.bind(null, set, getState),
    lastUpdatedAt: Date.now(),
  }),
);

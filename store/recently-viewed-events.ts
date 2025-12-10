import { create } from "zustand";

interface RecentlyViewedEventsStore {
  uuids: string[];
  recordEventView: (uuid: string) => void;
  lastUpdatedAt: number;
}

type Setter = (partial: Partial<RecentlyViewedEventsStore>) => void;

type Getter = () => RecentlyViewedEventsStore;

// ===================================================================
function recordEventView(set: Setter, getState: Getter, uuid: string) {
  const state = getState();

  set({
    uuids: [uuid, ...state.uuids.filter((_uuid) => _uuid !== uuid)],
    lastUpdatedAt: Date.now(),
  });
}

// ===================================================================
export const useRecentlyViewedEventsStore = create<RecentlyViewedEventsStore>(
  (set, getState) => ({
    uuids: [],
    recordEventView: recordEventView.bind(null, set, getState),
    lastUpdatedAt: Date.now(),
  }),
);

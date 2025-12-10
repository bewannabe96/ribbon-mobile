import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;
  show: () => void;
  hide: () => void;
}

type Setter = (partial: Partial<LoadingStore>) => void;

// ===================================================================
function show(set: Setter) {
  set({ isLoading: true });
}

// ===================================================================
function hide(set: Setter) {
  set({ isLoading: false });
}

// ===================================================================
export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  show: show.bind(null, set),
  hide: hide.bind(null, set),
}));

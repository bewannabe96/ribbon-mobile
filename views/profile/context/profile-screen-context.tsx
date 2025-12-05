import { createContext, ReactNode, useContext, useState } from "react";
import { DateTime } from "luxon";

export type ProfileEvent = {
  id: number;
  uuid: string;
  title: string;
  periodStart: DateTime;
  periodEnd: DateTime;
  location: string | null;
  participationFee: number | null;
};

export type ProfileScreenContextValue = {
  favoriteEvents: ProfileEvent[] | null;
  setFavoriteEvents: (value: ProfileEvent[] | null) => void;
  favoriteEventsLastLoadedAt: number;
  setFavoriteEventsLastLoadedAt: (value: number) => void;
  recentlyViewedEvents: ProfileEvent[] | null;
  setRecentlyViewedEvents: (value: ProfileEvent[] | null) => void;
  recentlyViewedEventsLastLoadedAt: number;
  setRecentlyViewedEventsLastLoadedAt: (value: number) => void;
  isFavoriteLoading: boolean;
  setIsFavoriteLoading: (value: boolean) => void;
  isRecentlyViewedLoading: boolean;
  setIsRecentlyViewedLoading: (value: boolean) => void;
  favoriteNextToken: string | null;
  setFavoriteNextToken: (value: string | null) => void;
  recentlyViewedNextToken: string | null;
  setRecentlyViewedNextToken: (value: string | null) => void;
};

export const ProfileScreenContext = createContext<
  ProfileScreenContextValue | undefined
>(undefined);

type ProfileProviderProps = {
  children: ReactNode;
};

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [favoriteEvents, setFavoriteEvents] = useState<ProfileEvent[] | null>(
    null,
  );
  const [favoriteEventsLastLoadedAt, setFavoriteEventsLastLoadedAt] =
    useState(0);
  const [recentlyViewedEvents, setRecentlyViewedEvents] = useState<
    ProfileEvent[] | null
  >(null);
  const [
    recentlyViewedEventsLastLoadedAt,
    setRecentlyViewedEventsLastLoadedAt,
  ] = useState(0);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isRecentlyViewedLoading, setIsRecentlyViewedLoading] = useState(false);
  const [favoriteNextToken, setFavoriteNextToken] = useState<string | null>(
    null,
  );
  const [recentlyViewedNextToken, setRecentlyViewedNextToken] = useState<
    string | null
  >(null);

  return (
    <ProfileScreenContext.Provider
      value={{
        favoriteEvents,
        setFavoriteEvents,
        favoriteEventsLastLoadedAt,
        setFavoriteEventsLastLoadedAt,
        recentlyViewedEvents,
        setRecentlyViewedEvents,
        recentlyViewedEventsLastLoadedAt,
        setRecentlyViewedEventsLastLoadedAt,
        isFavoriteLoading,
        setIsFavoriteLoading,
        isRecentlyViewedLoading,
        setIsRecentlyViewedLoading,
        favoriteNextToken,
        setFavoriteNextToken,
        recentlyViewedNextToken,
        setRecentlyViewedNextToken,
      }}
    >
      {children}
    </ProfileScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(ProfileScreenContext);

  if (context === undefined) {
    throw new Error("useScreenContext must be used within ProfileProvider");
  }

  return context;
}

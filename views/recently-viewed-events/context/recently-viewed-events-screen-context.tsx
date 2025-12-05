import { createContext, ReactNode, useContext, useState } from "react";
import { DateTime } from "luxon";

export type RecentlyViewedEventItem = {
  uuid: string;
  subName: string;
  mainName: string;
  location: string | null;
  fee: number | null;
  category: string;
  tags: string[];
  registrationStatus: "upcoming" | "opened" | "closed" | null;
  status: "upcoming" | "ongoing" | "ended";
  registrationSession: { open: DateTime | null; close: DateTime | null };
  period: { start: DateTime; end: DateTime };
};

export type RecentlyViewedEventsScreenContextValue = {
  events: RecentlyViewedEventItem[];
  setEvents: (value: RecentlyViewedEventItem[]) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  nextToken: string | null;
  setNextToken: (value: string | null) => void;
};

export const RecentlyViewedEventsScreenContext = createContext<
  RecentlyViewedEventsScreenContextValue | undefined
>(undefined);

type RecentlyViewedEventsProviderProps = {
  children: ReactNode;
};

export function RecentlyViewedEventsProvider({
  children,
}: RecentlyViewedEventsProviderProps) {
  const [events, setEvents] = useState<RecentlyViewedEventItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <RecentlyViewedEventsScreenContext.Provider
      value={{
        events,
        setEvents,
        isLoading,
        setIsLoading,
        nextToken,
        setNextToken,
      }}
    >
      {children}
    </RecentlyViewedEventsScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(RecentlyViewedEventsScreenContext);

  if (context === undefined) {
    throw new Error(
      "useScreenContext must be used within RecentlyViewedEventsProvider",
    );
  }

  return context;
}

import { createContext, ReactNode, useContext, useState } from "react";
import { DateTime } from "luxon";

export type FavoriteEventItem = {
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

export type FavoriteEventsScreenContextValue = {
  events: FavoriteEventItem[];
  setEvents: (value: FavoriteEventItem[]) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  nextToken: string | null;
  setNextToken: (value: string | null) => void;
};

export const FavoriteEventsScreenContext = createContext<
  FavoriteEventsScreenContextValue | undefined
>(undefined);

type FavoriteEventsProviderProps = {
  children: ReactNode;
};

export function FavoriteEventsProvider({
  children,
}: FavoriteEventsProviderProps) {
  const [events, setEvents] = useState<FavoriteEventItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FavoriteEventsScreenContext.Provider
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
    </FavoriteEventsScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(FavoriteEventsScreenContext);

  if (context === undefined) {
    throw new Error(
      "useScreenContext must be used within FavoriteEventsProvider",
    );
  }

  return context;
}

import { createContext, ReactNode, useContext, useState } from "react";
import { DateTime } from "luxon";

export type RecommendEvent = {
  uuid: string;
  name: string;
  category: string;
  registrationStart: DateTime | null;
  registrationEnd: DateTime | null;
  eventStart: DateTime;
  eventEnd: DateTime;
  location: string | null;
  participationFee: number | null;
  registrationStatus: "upcoming" | "opened" | "closed" | null;
};

export type RecommendScreenContextValue = {
  customEvents: RecommendEvent[];
  setCustomEvents: (value: RecommendEvent[]) => void;
  ongoingEvents: RecommendEvent[];
  setOngoingEvents: (value: RecommendEvent[]) => void;
  newEvents: RecommendEvent[];
  setNewEvents: (value: RecommendEvent[]) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const RecommendScreenContext = createContext<
  RecommendScreenContextValue | undefined
>(undefined);

type RecommendProviderProps = {
  children: ReactNode;
};

export function RecommendProvider({ children }: RecommendProviderProps) {
  const [customEvents, setCustomEvents] = useState<RecommendEvent[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<RecommendEvent[]>([]);
  const [newEvents, setNewEvents] = useState<RecommendEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <RecommendScreenContext.Provider
      value={{
        customEvents,
        setCustomEvents,
        ongoingEvents,
        setOngoingEvents,
        newEvents,
        setNewEvents,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </RecommendScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(RecommendScreenContext);

  if (context === undefined) {
    throw new Error("useScreenContext must be used within RecommendProvider");
  }

  return context;
}

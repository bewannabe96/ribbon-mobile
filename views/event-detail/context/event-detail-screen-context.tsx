import { createContext, ReactNode, useContext, useState } from "react";
import { DateTime } from "luxon";

export type EventDetail = {
  uuid: string;
  name: string;
  refinedName: string;
  categories: string[];
  institutionName: string;
  contactPhone: string | null;
  websiteUrl: string;
  capacity: number | null;
  fee: number | null;
  period: { start: DateTime; end: DateTime };
  timetable: [string, string, string, number][];
  estimatedDayCount: number | null;
  registrationSessions: { open: DateTime | null; close: DateTime | null }[];
  registrationMethods: string[] | null;
  venue: { name: string; address: string; location: [number, number] };
  description: string;
};

export type EventDetailScreenContextValue = {
  eventDetail: EventDetail | null;
  setEventDetail: (value: EventDetail) => void;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  isProcessingFavorite: boolean;
  setIsProcessingFavorite: (value: boolean) => void;
  isEventDetailLoading: boolean;
  setIsEventDetailLoading: (value: boolean) => void;
};

export const EventDetailScreenContext = createContext<
  EventDetailScreenContextValue | undefined
>(undefined);

type EventDetailProviderProps = {
  children: ReactNode;
};

export function EventDetailProvider({ children }: EventDetailProviderProps) {
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProcessingFavorite, setIsProcessingFavorite] = useState(false);
  const [isEventDetailLoading, setIsEventDetailLoading] = useState(false);

  return (
    <EventDetailScreenContext.Provider
      value={{
        eventDetail,
        setEventDetail,
        isFavorite,
        setIsFavorite,
        isProcessingFavorite,
        setIsProcessingFavorite,
        isEventDetailLoading,
        setIsEventDetailLoading,
      }}
    >
      {children}
    </EventDetailScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(EventDetailScreenContext);

  if (context === undefined) {
    throw new Error("useScreenContext must be used within EventDetailProvider");
  }

  return context;
}

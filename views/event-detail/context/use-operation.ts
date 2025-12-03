import {
  type EventDetail,
  useScreenContext,
} from "@/views/event-detail/context/event-detail-screen-context";
import { useCallback } from "react";
import { EventService } from "@/lib/services";
import { DateTime } from "luxon";

function calculateDayCount(
  startDate: DateTime,
  endDate: DateTime,
  weekDays: Set<number>,
): number | null {
  if (weekDays.size === 0) return null;

  let count = 0;
  let cur = startDate.startOf("day");
  const end = endDate.startOf("day");
  while (cur <= end) {
    if (weekDays.has(cur.weekday)) count++;
    cur = cur.plus({ days: 1 });
  }
  return count;
}

const dayOfWeekStringMap: Record<number, string> = {
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  7: "일",
};

export function useOperation() {
  const {
    eventDetail,
    setEventDetail,
    setIsEventDetailLoading,
    setIsFavorite,
    isFavorite,
  } = useScreenContext();

  const loadEventDetail = useCallback(
    async (eventUuid: string) => {
      try {
        setIsEventDetailLoading(true);

        // TODO: logging should be removed after resolved (slow query)
        const start_t = Date.now();
        const [eventDetailDto, isFavorite] = await Promise.all([
          EventService.getEventDetail(eventUuid),
          EventService.isFavorite(eventUuid),
        ]);
        const end_t = Date.now();
        console.log(
          "`EventService.getEventDetail` took: ",
          (end_t - start_t) / 1000,
        );

        const periodStart = DateTime.fromISO(eventDetailDto.period.start);

        const periodEnd = DateTime.fromISO(eventDetailDto.period.end);

        const weekDays: Set<number> = new Set();

        const timetable: EventDetail["timetable"] =
          eventDetailDto.timetableSlots
            .sort((a, b) => a.day - b.day)
            .map((slot) => {
              weekDays.add(slot.day);

              const startTime = DateTime.fromISO(
                "1970-01-01T" + slot.startTime,
              );
              let endTime = DateTime.fromISO("1970-01-01T" + slot.endTime);
              if (endTime < startTime) endTime = endTime.plus({ days: 1 });
              const duration = endTime.diff(startTime, "minute").minutes;
              return [
                dayOfWeekStringMap[slot.day],
                startTime.toFormat("HH:mm"),
                endTime.toFormat("HH:mm"),
                duration,
              ];
            });

        const registrationSessions = eventDetailDto.registrationSessions.map(
          (session) => ({
            open: session.open ? DateTime.fromISO(session.open) : null,
            close: session.close ? DateTime.fromISO(session.close) : null,
          }),
        );

        const categories: string[] = [eventDetailDto.category.name];
        categories.push(...eventDetailDto.tags.map((tag) => tag.name));

        const estimatedDayCount = calculateDayCount(
          periodStart,
          periodEnd,
          weekDays,
        );

        setEventDetail({
          uuid: eventUuid,
          name: eventDetailDto.name,
          refinedName: eventDetailDto.refinedName,
          categories: categories,
          institutionName: eventDetailDto.institutionName,
          contactPhone: eventDetailDto.contactPhone,
          websiteUrl: eventDetailDto.sourceUrl,
          capacity: eventDetailDto.capacity,
          fee: eventDetailDto.participationFee,
          period: { start: periodStart, end: periodEnd },
          timetable: timetable,
          estimatedDayCount: estimatedDayCount,
          registrationSessions: registrationSessions,
          registrationMethods: eventDetailDto.registrationMethods,
          venue: {
            name: eventDetailDto.venue.name,
            address: eventDetailDto.venue.address,
            location: eventDetailDto.venue.location,
          },
          description: `<body>${eventDetailDto.description}</body>`,
        });
        setIsFavorite(isFavorite);
      } finally {
        setIsEventDetailLoading(false);
      }
    },
    [setEventDetail, setIsEventDetailLoading, setIsFavorite],
  );

  const toggleFavorite = useCallback(async () => {
    if (eventDetail === null) return;

    try {
      setIsFavorite(!isFavorite);
      if (isFavorite) {
        await EventService.removeFavorite(eventDetail.uuid);
      } else {
        await EventService.addFavorite(eventDetail.uuid);
      }
    } catch (error) {
      setIsFavorite(isFavorite);
      console.log("Failed toggle favorite: " + error);
      throw error;
    }
  }, [eventDetail, isFavorite, setIsFavorite]);

  return { loadEventDetail, toggleFavorite };
}

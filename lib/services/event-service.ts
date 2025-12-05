import { supabase } from "@/lib/supabase";
import {
  GetEventDetailDto,
  SearchEventsFilters,
  SearchEventsResponseDto,
  GetOngoingFestivalsResponseDto,
  GetNewlyCreatedEventsResponseDto,
  GetFavoriteEventsResponseDto,
  GetViewHistoryResponseDto,
} from "@/lib/services/dto";
import { Event, RegistrationSession, TimetableSlot } from "./dto/common.dto";
import { DateTime } from "luxon";

class EventService {
  /**
   * Gets the current authenticated user's ID from the user table.
   * @returns User ID (user.id)
   * @throws Error if user is not authenticated or not found
   */
  private static async getCurrentUserId(): Promise<number | null> {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("auth_id", authData.user.id)
      .single();

    if (userError || !userData) {
      throw new Error("User not found");
    }

    return userData.id;
  }

  /**
   * Gets the event ID from UUID.
   * @param uuid - Event UUID
   * @returns Event ID (public_event.id)
   * @throws Error if event not found
   */
  private static async getEventIdByUuid(uuid: string): Promise<number> {
    const { data: eventData, error: eventError } = await supabase
      .from("public_event")
      .select("id")
      .eq("uuid", uuid)
      .single();

    if (eventError || !eventData) {
      throw new Error(`Event with UUID ${uuid} not found`);
    }

    return eventData.id;
  }

  private static mapCategoryName(value: string) {
    const map: Record<string, string> = {
      lecture: "강의/강좌",
      exhibition: "전시",
      experience: "문화체험",
      performance: "공연",
      festival: "행사/축제",
    };
    return map[value] ?? value.toLocaleUpperCase();
  }

  private static mapTagName(value: string) {
    const map: Record<string, string> = {
      art: "미술",
      sports: "스포츠",
      music: "음악",
      cooking: "요리",
      handicraft: "수공예",
      tradition: "전통문화",
      financial_management: "재테크/투자",
      computer_technology: "IT/컴퓨터",
      computer_software: "소프트웨어/프로그램",
      ai: "AI/인공지능",
      nature: "자연",
      literature: "문학",
      foreign_language: "외국어",
      health: "건강/의료",
      activity: "신체활동",
      career: "진로/취업",
      certificate: "자격증/면허증",
      tax: "세무",
      law: "법률/법무",
      real_estate: "부동산",
      social_welfare: "사회복지",
    };

    return map[value] ?? value.toLocaleUpperCase();
  }

  /**
   * Compares two registration sessions by their earliest date.
   * Returns negative if `a` is earlier, positive if `b` is earlier.
   */
  private static compareRegistrationSession(
    a: RegistrationSession,
    b: RegistrationSession,
  ): number {
    const a_target = Date.parse((a.open || a.close)!);
    const b_target = Date.parse((b.open || b.close)!);
    return a_target - b_target;
  }

  /**
   * Calculates the registration status based on registration sessions.
   * Returns the status of the earliest active or upcoming registration session.
   * @param registrationSessions - Array of registration sessions sorted by earliest date
   * @returns Registration status: null (no sessions), "upcoming", "opened", or "closed"
   */
  private static calculateRegistrationStatus(
    registrationSessions: RegistrationSession[],
  ): "upcoming" | "opened" | "closed" | null {
    if (registrationSessions.length === 0) {
      return null;
    }

    const now = DateTime.now();

    // Find the first session that is not closed yet
    for (const session of registrationSessions) {
      const openDate = session.open ? DateTime.fromISO(session.open) : null;
      const closeDate = session.close ? DateTime.fromISO(session.close) : null;

      // If both dates are null, skip
      if (!openDate && !closeDate) continue;

      // If only close date exists, and it's in the future, consider it opened
      if (!openDate && closeDate && now < closeDate) {
        return "opened";
      }

      // If only open date exists, and it's in the past, consider it opened
      if (openDate && !closeDate && now >= openDate) {
        return "opened";
      }

      // Both dates exist
      if (openDate && closeDate) {
        if (now < openDate) {
          return "upcoming";
        }
        if (now >= openDate && now <= closeDate) {
          return "opened";
        }
        // If this session is closed, continue to next session
      }
    }

    // All sessions are closed
    return "closed";
  }

  /**
   * Calculates the event status based on start and end dates.
   * @param startDate - Event start date in ISO string format
   * @param endDate - Event end date in ISO string format
   * @returns Event status: "upcoming", "ongoing", or "ended"
   */
  private static calculateEventStatus(
    startDate: string,
    endDate: string,
  ): "upcoming" | "ongoing" | "ended" {
    const now = DateTime.now();
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    if (now < start) {
      return "upcoming";
    }
    if (now >= start && now <= end) {
      return "ongoing";
    }
    return "ended";
  }

  /**
   * Fetches detailed event information by UUID.
   * Includes all event data, registration sessions, and timetable slots.
   */
  static async getEventDetail(uuid: string): Promise<GetEventDetailDto> {
    const { data, error } = await supabase
      .from("public_event")
      .select(
        `
        uuid,
        name,
        refined_name,
        description,
        category,
        institution_name,
        start_date,
        end_date,
        venue_name,
        venue_address,
        venue_location,
        capacity,
        participation_fee,
        contact_phone,
        target_residence,
        registration_methods,
        source_url,
        tags:pe_tag(tag),
        registration_sessions:pe_registration_session(id, open_dt, close_dt),
        timetable_slots:pe_timetable_slot(id, day, start_time, end_time),
        districts:pe_district(district(level, name))
      `,
      )
      .eq("uuid", uuid)
      .single();

    if (error || data === null) {
      throw new Error(`Event with UUID ${uuid} not found`);
    }

    const registrationSessions: RegistrationSession[] =
      data.registration_sessions?.map((session: any) => ({
        open: session.open_dt,
        close: session.close_dt,
      })) ?? [];

    const timetableSlots: TimetableSlot[] =
      data.timetable_slots?.map((slot: any) => ({
        id: slot.id,
        day: slot.day,
        startTime: slot.start_time,
        endTime: slot.end_time,
      })) ?? [];

    const districts = data.districts
      .sort((a, b) => a.district.level - b.district.level)
      .map(({ district }) => district.name);

    return {
      uuid: data.uuid,
      name: data.name,
      refinedName: data.refined_name,
      description: data.description,
      category: {
        value: data.category,
        name: EventService.mapCategoryName(data.category),
      },
      institutionName: data.institution_name,
      period: {
        start: data.start_date,
        end: data.end_date,
      },
      venue: {
        t: "offline",
        name: data.venue_name ?? "",
        address: data.venue_address ?? "",
        location: data.venue_location as [number, number],
      },
      districts: districts.length === 0 ? null : districts,
      capacity: data.capacity,
      participationFee: data.participation_fee,
      contactPhone: data.contact_phone,
      targetResidence: data.target_residence,
      registrationMethods: data.registration_methods,
      registrationSessions: registrationSessions,
      timetableSlots: timetableSlots,
      tags: data.tags.map(({ tag }) => ({
        value: tag,
        name: EventService.mapTagName(tag),
      })),
      sourceUrl: data.source_url,
    };
  }

  /**
   * Encodes pagination cursor from an array of field values.
   * Fields are joined with underscore separator.
   * @param fields - Array of field values to encode
   * @returns Encoded cursor string
   */
  private static encodeCursor(fields: (string | number)[]): string {
    return fields.join("_");
  }

  /**
   * Decodes pagination cursor into an array of field values.
   * @param token - Encoded cursor string
   * @param fieldCount - Expected number of fields in the cursor
   * @returns Array of decoded field values, or null if decoding fails
   */
  private static decodeCursor(
    token: string,
    fieldCount: number,
  ): string[] | null {
    const parts = token.split("_");

    // For backwards compatibility with "value1_value2" format,
    // if we have more than expected parts, assume the first parts
    // might contain underscores and rejoin them
    if (parts.length < fieldCount) {
      return null;
    }

    if (parts.length === fieldCount) {
      return parts;
    }

    // If we have more parts than expected, merge all but the last (fieldCount - 1) parts
    const result: string[] = [];
    const firstFieldPartCount = parts.length - fieldCount + 1;
    result.push(parts.slice(0, firstFieldPartCount).join("_"));
    result.push(...parts.slice(firstFieldPartCount));

    return result;
  }

  private static async applicationJoinEvent(ids: number[]): Promise<Event[]> {
    const { data, error } = await supabase
      .from("public_event")
      .select(
        `
        id,
        uuid,
        name,
        refined_name,
        participation_fee,
        start_date,
        end_date,
        category,
        tags:pe_tag(tag),
        districts:pe_district(district(name)),
        registration_sessions:pe_registration_session(id, open_dt, close_dt)
      `,
      )
      .in("id", ids);

    if (error || data === null) {
      throw new Error("Error occurred while fetching event details");
    }

    const sortedData = data.sort(
      (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
    );

    return sortedData.map((row) => {
      const registrationSessions: RegistrationSession[] =
        row.registration_sessions
          .map((session) => ({
            open: session.open_dt,
            close: session.close_dt,
          }))
          .sort(EventService.compareRegistrationSession);

      const districts: string[] = row.districts.map(
        ({ district }) => district.name,
      );

      return {
        id: row.id,
        uuid: row.uuid,
        category: {
          value: row.category,
          name: EventService.mapCategoryName(row.category),
        },
        tags: row.tags.map(({ tag }) => ({
          value: tag,
          name: EventService.mapTagName(tag),
        })),
        originalName: row.name,
        name: row.refined_name,
        participationFee: row.participation_fee,
        period: {
          start: row.start_date,
          end: row.end_date,
        },
        districts: districts,
        registrationSessions: registrationSessions,
        registrationStatus:
          EventService.calculateRegistrationStatus(registrationSessions),
        status: EventService.calculateEventStatus(row.start_date, row.end_date),
      };
    });
  }

  /**
   * Searches events with cursor-based pagination and filtering.
   * Uses two-query approach: first query filters and gets IDs, second query fetches full data.
   * Returns events in descending order by created_at, then by id.
   * @param token - Pagination token
   * @param limit - Number of events per page (default: 20)
   * @param filters - Search filters
   */
  static async searchEvents(
    token: string | null,
    filters: SearchEventsFilters,
    limit: number = 20,
  ): Promise<SearchEventsResponseDto> {
    let createdAtCursor: string | undefined = undefined;
    let idCursor: number | undefined = undefined;
    if (token) {
      const cursor = EventService.decodeCursor(token, 2);
      if (cursor) {
        createdAtCursor = cursor[0];
        idCursor = Number(cursor[1]);
      }
    }

    const { data: filterData, error: filterError } = await supabase.rpc(
      "filter_public_event",
      {
        f_categories: filters?.categories,
        f_districts: filters?.districts,
        f_min_fee: filters?.minParticipationFee,
        f_max_fee: filters?.maxParticipationFee,
        f_registration_status: filters?.registrationStatus,
        // f_target_residences: filters?.targetResidencesDistrict,
        f_tags: filters?.tags,

        f_created_at_cursor: createdAtCursor,
        f_id_cursor: idCursor,
        f_limit: limit + 1,
      },
    );

    if (filterError || filterData === null) {
      throw new Error(
        "Error occurred while filtering events: " + filterError?.message,
      );
    }

    if (filterData.length === 0) {
      return { events: [], nextToken: null };
    }

    const hasMore = filterData.length > limit;
    const records = filterData.slice(0, limit);
    const lastRecord = records[records.length - 1];

    const ids = records.map((row) => row.id);
    const nextToken = hasMore
      ? EventService.encodeCursor([lastRecord.created_at, lastRecord.id])
      : null;

    const events = await EventService.applicationJoinEvent(ids);

    return { events, nextToken };
  }

  /**
   * Fetches ongoing festivals with cursor-based pagination.
   * Returns festivals where current date is between start_date and end_date.
   * Results are ordered by created_at (descending), then by id (descending).
   * @param token - Pagination token
   * @param limit - Number of events per page (default: 20)
   */
  static async getOngoingFestivals(
    token?: string | null,
    limit: number = 20,
  ): Promise<GetOngoingFestivalsResponseDto> {
    let createdAtCursor: string | undefined = undefined;
    let idCursor: number | undefined = undefined;
    if (token) {
      const cursor = EventService.decodeCursor(token, 2);
      if (cursor) {
        createdAtCursor = cursor[0];
        idCursor = Number(cursor[1]);
      }
    }

    const now = DateTime.now().toISODate();

    let query = supabase
      .from("public_event")
      .select("id, created_at")
      .eq("category", "festival")
      .lte("start_date", now)
      .gte("end_date", now)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1);

    if (createdAtCursor && idCursor) {
      query = query.or(
        `created_at.lt.${createdAtCursor},and(created_at.eq.${createdAtCursor},id.lt.${idCursor})`,
      );
    }

    const { data: filterData, error: filterError } = await query;

    if (filterError || filterData === null) {
      throw new Error(
        "Error occurred while fetching ongoing festivals: " +
          filterError?.message,
      );
    }

    if (filterData.length === 0) {
      return { events: [], nextToken: null };
    }

    const hasMore = filterData.length > limit;
    const records = filterData.slice(0, limit);
    const lastRecord = records[records.length - 1];

    const ids = records.map((row) => row.id);
    const nextToken = hasMore
      ? EventService.encodeCursor([lastRecord.created_at, lastRecord.id])
      : null;

    const events = await EventService.applicationJoinEvent(ids);

    return { events, nextToken };
  }

  /**
   * Fetches newly created events with cursor-based pagination.
   * Returns events ordered by created_at (descending), then by id (descending).
   * @param token - Pagination token
   * @param limit - Number of events per page (default: 20)
   */
  static async getNewlyCreatedEvents(
    token?: string | null,
    limit: number = 20,
  ): Promise<GetNewlyCreatedEventsResponseDto> {
    let createdAtCursor: string | undefined = undefined;
    let idCursor: number | undefined = undefined;
    if (token) {
      const cursor = EventService.decodeCursor(token, 2);
      if (cursor) {
        createdAtCursor = cursor[0];
        idCursor = Number(cursor[1]);
      }
    }

    let query = supabase
      .from("public_event")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1);

    if (createdAtCursor && idCursor) {
      query = query.or(
        `created_at.lt.${createdAtCursor},and(created_at.eq.${createdAtCursor},id.lt.${idCursor})`,
      );
    }

    const { data: filterData, error: filterError } = await query;

    if (filterError || filterData === null) {
      throw new Error(
        "Error occurred while fetching newly created events: " +
          filterError?.message,
      );
    }

    if (filterData.length === 0) {
      return { events: [], nextToken: null };
    }

    const hasMore = filterData.length > limit;
    const records = filterData.slice(0, limit);
    const lastRecord = records[records.length - 1];

    const ids = records.map((row) => row.id);
    const nextToken = hasMore
      ? EventService.encodeCursor([lastRecord.created_at, lastRecord.id])
      : null;

    const events = await EventService.applicationJoinEvent(ids);

    return { events, nextToken };
  }

  /**
   * Adds an event to the current user's favorites.
   * @param eventUuid - UUID of the event to add to favorites
   * @throws Error if user is not authenticated or event not found
   */
  static async addFavorite(eventUuid: string): Promise<void> {
    const [userId, eventId] = await Promise.all([
      EventService.getCurrentUserId(),
      EventService.getEventIdByUuid(eventUuid),
    ]);

    if (userId === null) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("user_favorite").insert({
      user_id: userId,
      pe_id: eventId,
    });

    if (error) {
      // Check if it's a duplicate key error (already favorited)
      // https://postgrest.org/en/stable/references/errors.html
      if (error.code === "23505") return;
      throw new Error(`Failed to add favorite: ${error.message}`);
    }
  }

  /**
   * Removes an event from the current user's favorites.
   * @param eventUuid - UUID of the event to remove from favorites
   * @throws Error if user is not authenticated or event not found
   */
  static async removeFavorite(eventUuid: string): Promise<void> {
    const [userId, eventId] = await Promise.all([
      EventService.getCurrentUserId(),
      EventService.getEventIdByUuid(eventUuid),
    ]);

    if (userId === null) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("user_favorite")
      .delete()
      .eq("user_id", userId)
      .eq("pe_id", eventId);

    if (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  }

  /**
   * Checks if an event is in the current user's favorites.
   * @param eventUuid - UUID of the event to check
   * @returns True if the event is favorited, false otherwise
   * @throws Error if user is not authenticated or event not found
   */
  static async isFavorite(eventUuid: string): Promise<boolean> {
    const [userId, eventId] = await Promise.all([
      EventService.getCurrentUserId(),
      EventService.getEventIdByUuid(eventUuid),
    ]);

    if (userId === null) {
      return false;
    }

    const { data, error } = await supabase
      .from("user_favorite")
      .select("id")
      .eq("user_id", userId)
      .eq("pe_id", eventId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to check favorite status: ${error.message}`);
    }

    return data !== null;
  }

  /**
   * Records a view history for an event.
   * If a view history already exists for this user and event, updates the viewed_at timestamp.
   * @param eventUuid - UUID of the event to record view history
   * @throws Error if user is not authenticated or event not found
   */
  static async recordEventView(eventUuid: string): Promise<void> {
    const [userId, eventId] = await Promise.all([
      EventService.getCurrentUserId(),
      EventService.getEventIdByUuid(eventUuid),
    ]);

    if (userId === null) {
      throw new Error("User not authenticated");
    }

    const now = DateTime.now().toISO();

    const { error } = await supabase.from("user_event_view_history").upsert(
      {
        user_id: userId,
        pe_id: eventId,
        viewed_at: now,
      },
      {
        onConflict: "user_id,pe_id",
      },
    );

    if (error) {
      throw new Error(`Failed to record event view: ${error.message}`);
    }
  }

  /**
   * Fetches the current user's favorite events with cursor-based pagination.
   * Returns events ordered by favorite creation date (descending), then by id (descending).
   * @param token - Pagination token
   * @param limit - Number of events per page (default: 20)
   * @throws Error if user is not authenticated
   */
  static async getFavoriteEvents(
    token?: string | null,
    limit: number = 20,
  ): Promise<GetFavoriteEventsResponseDto> {
    const userId = await EventService.getCurrentUserId();

    if (userId === null) {
      throw new Error("User not authenticated");
    }

    let createdAtCursor: string | undefined = undefined;
    let idCursor: number | undefined = undefined;
    if (token) {
      const cursor = EventService.decodeCursor(token, 2);
      if (cursor) {
        createdAtCursor = cursor[0];
        idCursor = Number(cursor[1]);
      }
    }

    let query = supabase
      .from("user_favorite")
      .select("pe_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1);

    if (createdAtCursor && idCursor) {
      query = query.or(
        `created_at.lt.${createdAtCursor},and(created_at.eq.${createdAtCursor},id.lt.${idCursor})`,
      );
    }

    const { data: filterData, error: filterError } = await query;

    if (filterError || filterData === null) {
      throw new Error("Error occurred while fetching favorite events");
    }

    if (filterData.length === 0) {
      return { events: [], nextToken: null };
    }

    const hasMore = filterData.length > limit;
    const records = filterData.slice(0, limit);
    const lastRecord = records[records.length - 1];

    const ids = records.map((row) => row.pe_id);
    const nextToken = hasMore
      ? EventService.encodeCursor([lastRecord.created_at, lastRecord.pe_id])
      : null;

    const events = await EventService.applicationJoinEvent(ids);

    return { events, nextToken };
  }

  /**
   * Fetches the current user's event view history with cursor-based pagination.
   * Returns events ordered by last viewed date (descending), then by id (descending).
   * @param token - Pagination token
   * @param limit - Number of events per page (default: 20)
   * @throws Error if user is not authenticated
   */
  static async getViewHistory(
    token?: string | null,
    limit: number = 20,
  ): Promise<GetViewHistoryResponseDto> {
    const userId = await EventService.getCurrentUserId();

    if (userId === null) {
      throw new Error("User not authenticated");
    }

    let viewedAtCursor: string | undefined = undefined;
    let idCursor: number | undefined = undefined;
    if (token) {
      const cursor = EventService.decodeCursor(token, 2);
      if (cursor) {
        viewedAtCursor = cursor[0];
        idCursor = Number(cursor[1]);
      }
    }

    let query = supabase
      .from("user_event_view_history")
      .select("pe_id, viewed_at")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1);

    if (viewedAtCursor && idCursor) {
      query = query.or(
        `viewed_at.lt.${viewedAtCursor},and(viewed_at.eq.${viewedAtCursor},id.lt.${idCursor})`,
      );
    }

    const { data: filterData, error: filterError } = await query;

    if (filterError || filterData === null) {
      throw new Error("Error occurred while fetching event view history");
    }

    if (filterData.length === 0) {
      return { events: [], nextToken: null };
    }

    const hasMore = filterData.length > limit;
    const records = filterData.slice(0, limit);
    const lastRecord = records[records.length - 1];

    const ids = records.map((row) => row.pe_id);
    const nextToken = hasMore
      ? EventService.encodeCursor([lastRecord.viewed_at, lastRecord.pe_id])
      : null;

    const events = await EventService.applicationJoinEvent(ids);

    return { events, nextToken };
  }
}

export default EventService;

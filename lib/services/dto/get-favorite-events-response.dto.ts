import { Event } from "./common.dto";

export interface GetFavoriteEventsResponseDto {
  events: Event[];
  nextToken: string | null;
}

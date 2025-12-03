import { Event } from "./common.dto";

export interface GetNewlyCreatedEventsResponseDto {
  events: Event[];
  nextToken: string | null;
}

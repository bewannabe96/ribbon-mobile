import { Event } from "./common.dto";

export interface GetViewHistoryResponseDto {
  events: Event[];
  nextToken: string | null;
}

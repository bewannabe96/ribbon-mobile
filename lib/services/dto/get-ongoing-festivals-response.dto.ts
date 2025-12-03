import { Event } from "./common.dto";

export interface GetOngoingFestivalsResponseDto {
  events: Event[];
  nextToken: string | null;
}

import { Event } from "./common.dto";

export type Category =
  | "lecture"
  | "exhibition"
  | "experience"
  | "performance"
  | "festival";

export type RegistrationStatus = "upcoming" | "opened";

export interface SearchEventsFilters {
  categories?: Category[];
  districts?: number[];
  minParticipationFee?: number;
  maxParticipationFee?: number;
  registrationStatus?: RegistrationStatus;
  targetResidencesDistrict?: number[];
  tags?: string[];
}

export interface SearchEventsResponseDto {
  events: Event[];
  nextToken: string | null;
}

/**
 * Data Transfer Object types for service layer
 */

export interface EventPeriod {
  start: string;
  end: string;
}

export interface RegistrationSession {
  open: string | null;
  close: string | null;
}

export interface TimetableSlot {
  id: number;
  day: number;
  startTime: string;
  endTime: string;
}

export type Venue = {
  t: "offline";
  name: string;
  address: string;
  location: [number, number]; // lng, lat
};

export interface Event {
  id: number;
  uuid: string;
  category: { value: string; name: string };
  tags: { value: string; name: string }[];
  originalName: string;
  name: string;
  districts: string[];
  participationFee: number | null;
  period: EventPeriod;
  registrationSessions: RegistrationSession[];
  registrationStatus: "upcoming" | "opened" | "closed" | null;
  status: "upcoming" | "ongoing" | "ended";
}

export interface EventDetail {
  uuid: string;
  name: string;
  refinedName: string;
  category: { value: string; name: string };
  tags: { value: string; name: string }[];
  period: EventPeriod;
  timetableSlots: TimetableSlot[];
  districts: string[] | null;
  venue: Venue;
  institutionName: string;
  sourceUrl: string;
  contactPhone: string | null;
  registrationSessions: RegistrationSession[];
  registrationMethods: string[] | null;
  description: string | null;
  capacity: number | null;
  participationFee: number | null;
  targetResidence: string | null;
}

export interface User {
  uid: string;
  username: string;
  email: string | null;
  profileImageUrl: string | null;
  createdAt: string;
}

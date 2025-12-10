import { DateTime } from "luxon";
import {
  calculateRegistrationStatus,
  type RegistrationSession,
} from "../calculate-registration-status";

describe("calculateRegistrationStatus", () => {
  const baseDate = DateTime.fromISO("2025-01-15T10:00:00");
  const periodStart = DateTime.fromISO("2025-02-01T09:00:00");

  describe("Empty sessions", () => {
    it("should return closed when there are no sessions", () => {
      const result = calculateRegistrationStatus([], periodStart, baseDate);
      expect(result).toBeNull();
    });
  });

  describe("Right-open sessions (special case)", () => {
    it("should return opened (first-come-served) when right-open and before period start", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-10T09:00:00"),
          close: null, // right-open
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: true });
    });

    it("should return closed when right-open and after period start", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-10T09:00:00"),
          close: null, // right-open
        },
      ];

      const afterPeriodStart = DateTime.fromISO("2025-02-02T10:00:00");
      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        afterPeriodStart,
      );
      expect(result).toEqual({ t: "closed" });
    });

    it("should handle multiple sessions ending with right-open", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-01T09:00:00"),
          close: DateTime.fromISO("2025-01-05T18:00:00"),
        },
        {
          open: DateTime.fromISO("2025-01-10T09:00:00"),
          close: null, // right-open
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: true });
    });
  });

  describe("Left-open sessions", () => {
    it("should return opened (not first-come-served) when within left-open session", () => {
      const sessions: RegistrationSession[] = [
        {
          open: null, // left-open
          close: DateTime.fromISO("2025-01-20T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: false });
    });

    it("should return closed when left-open session has passed", () => {
      const sessions: RegistrationSession[] = [
        {
          open: null, // left-open
          close: DateTime.fromISO("2025-01-10T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "closed" });
    });

    it("should handle left-open + closed sessions", () => {
      const sessions: RegistrationSession[] = [
        {
          open: null, // left-open
          close: DateTime.fromISO("2025-01-10T18:00:00"),
        },
        {
          open: DateTime.fromISO("2025-01-20T09:00:00"),
          close: DateTime.fromISO("2025-01-25T18:00:00"),
        },
      ];

      // Should return upcoming for the next closed session
      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "upcoming", leftDays: 5 });
    });
  });

  describe("Closed sessions", () => {
    it("should return upcoming with correct leftDays when before session open", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-20T09:00:00"),
          close: DateTime.fromISO("2025-01-25T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      // 2025-01-15 to 2025-01-20 = 5 days
      expect(result).toEqual({ t: "upcoming", leftDays: 5 });
    });

    it("should return opened (not first-come-served) when within closed session", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-10T09:00:00"),
          close: DateTime.fromISO("2025-01-20T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: false });
    });

    it("should return closed when all closed sessions have passed", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-01T09:00:00"),
          close: DateTime.fromISO("2025-01-05T18:00:00"),
        },
        {
          open: DateTime.fromISO("2025-01-08T09:00:00"),
          close: DateTime.fromISO("2025-01-10T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "closed" });
    });

    it("should handle multiple closed sessions and return first upcoming", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-20T09:00:00"),
          close: DateTime.fromISO("2025-01-22T18:00:00"),
        },
        {
          open: DateTime.fromISO("2025-01-25T09:00:00"),
          close: DateTime.fromISO("2025-01-27T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "upcoming", leftDays: 5 });
    });
  });

  describe("Edge cases", () => {
    it("should handle session exactly at open time", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-15T10:00:00"), // exact same time as baseDate
          close: DateTime.fromISO("2025-01-20T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: false });
    });

    it("should handle session exactly at close time", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-10T09:00:00"),
          close: DateTime.fromISO("2025-01-15T10:00:00"), // exact same time as baseDate
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: false });
    });

    it("should handle left-open and right-open (entire period open)", () => {
      const sessions: RegistrationSession[] = [
        {
          open: null,
          close: null,
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: true });
    });

    it("should calculate leftDays correctly with fractional days", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-15T15:00:00"), // 5 hours from baseDate
          close: DateTime.fromISO("2025-01-20T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      // Should ceil fractional days (5 hours = 0.208 days -> 1 day)
      expect(result).toEqual({ t: "upcoming", leftDays: 1 });
    });
  });

  describe("Complex scenarios", () => {
    it("should handle left-open + closed + right-open combination", () => {
      const sessions: RegistrationSession[] = [
        {
          open: null, // left-open (passed)
          close: DateTime.fromISO("2025-01-10T18:00:00"),
        },
        {
          open: DateTime.fromISO("2025-01-12T09:00:00"), // closed (passed)
          close: DateTime.fromISO("2025-01-14T18:00:00"),
        },
        {
          open: DateTime.fromISO("2025-01-20T09:00:00"), // right-open (not started)
          close: null,
        },
      ];

      // Currently at 2025-01-15, before period start (2025-02-01)
      // Last session is right-open, so should return opened (first-come-served)
      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: true });
    });

    it("should prioritize current open session over future ready sessions", () => {
      const sessions: RegistrationSession[] = [
        {
          open: DateTime.fromISO("2025-01-10T09:00:00"),
          close: DateTime.fromISO("2025-01-20T18:00:00"), // currently open
        },
        {
          open: DateTime.fromISO("2025-01-25T09:00:00"), // future session
          close: DateTime.fromISO("2025-01-30T18:00:00"),
        },
      ];

      const result = calculateRegistrationStatus(
        sessions,
        periodStart,
        baseDate,
      );
      expect(result).toEqual({ t: "opened", isFirstComeServed: false });
    });
  });
});

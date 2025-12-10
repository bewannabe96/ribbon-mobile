import type { DateTime } from "luxon";

export type RegistrationSession = {
  open: DateTime | null;
  close: DateTime | null;
};

export type RegistrationStatus =
  | {
      t: "upcoming";
      leftDays: number;
    }
  | {
      t: "opened";
      isFirstComeServed: boolean;
    }
  | {
      t: "closed";
    };

export function calculateRegistrationStatus(
  sessions: RegistrationSession[],
  periodStart: DateTime,
  now: DateTime,
): RegistrationStatus | null {
  if (sessions.length === 0) {
    return null;
  }

  // Check if last session is right-open
  const lastSession = sessions[sessions.length - 1];
  const isLastSessionRightOpen = lastSession.close === null;

  if (isLastSessionRightOpen) {
    // Special case: right-open ends
    if (now < periodStart) {
      return { t: "opened", isFirstComeServed: true };
    } else {
      return { t: "closed" };
    }
  }

  // Find current applicable session
  for (const session of sessions) {
    const isLeftOpen = session.open === null;
    const isRightOpen = session.close === null;

    if (isLeftOpen && isRightOpen) {
      // Entire period is open (shouldn't happen based on requirements)
      return { t: "opened", isFirstComeServed: true };
    } else if (isLeftOpen) {
      // Left-open: open until close
      if (now <= session.close!) {
        return { t: "opened", isFirstComeServed: false };
      }
    } else if (isRightOpen) {
      // Right-open: open from open onwards (handled above)
      if (now >= session.open!) {
        return { t: "opened", isFirstComeServed: true };
      }
    } else {
      // Closed session
      if (now < session.open!) {
        const leftDays = Math.ceil(session.open!.diff(now, "days").days);
        return { t: "upcoming", leftDays };
      } else if (now >= session.open! && now <= session.close!) {
        return { t: "opened", isFirstComeServed: false };
      }
    }
  }

  return { t: "closed" };
}

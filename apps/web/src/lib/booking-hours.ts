/** Fixed reservation length per table (minutes) */
export const RESERVATION_DURATION_MINUTES = 120;

/** Business hours: 12:00 noon → 12:00 midnight (last booking), every 30 min */
export const BOOKING_SLOT_VALUES = buildBookingSlots();

export type BookingSlotGroupId = "midday" | "afternoon" | "evening";

export type BookingSlotGroup = {
  id: BookingSlotGroupId;
  slots: string[];
};

/** Part-of-day groups for a clearer picker (all still within open hours). */
export const BOOKING_SLOT_GROUPS: BookingSlotGroup[] = [
  {
    id: "midday",
    slots: BOOKING_SLOT_VALUES.filter((s) => {
      const h = Number(s.slice(0, 2));
      return h >= 12 && h < 16;
    }),
  },
  {
    id: "afternoon",
    slots: BOOKING_SLOT_VALUES.filter((s) => {
      const h = Number(s.slice(0, 2));
      return h >= 16 && h < 19;
    }),
  },
  {
    id: "evening",
    slots: BOOKING_SLOT_VALUES.filter((s) => {
      const h = Number(s.slice(0, 2));
      return h >= 19 || h === 0;
    }),
  },
];

function buildBookingSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 12; hour <= 23; hour++) {
    for (const minute of [0, 30] as const) {
      slots.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      );
    }
  }
  // Last booking: 12:00 midnight
  slots.push("00:00");
  return slots;
}

export type Time12 = {
  /** e.g. "7:00" or "12:30" */
  clock: string;
  /** Arabic ص / م */
  periodAr: "ص" | "م";
  /** English am / pm */
  periodEn: "am" | "pm";
  /** Display e.g. "7:00 م" (ar) or "7:00 pm" (en) */
  label: string;
  /** Same as label — locale-pure, no mixed scripts */
  labelFull: string;
};

/** Format 24h "HH:mm" → 12h with locale-aware period */
export function formatTime12(
  hhmm: string,
  locale: "ar" | "en" = "ar"
): Time12 {
  const [hRaw, m = "00"] = hhmm.split(":");
  let h = Number(hRaw);
  let periodAr: "ص" | "م" = "ص";
  let periodEn: "am" | "pm" = "am";

  if (h === 0) {
    h = 12;
    periodAr = "ص";
    periodEn = "am";
  } else if (h === 12) {
    periodAr = "م";
    periodEn = "pm";
  } else if (h > 12) {
    h = h - 12;
    periodAr = "م";
    periodEn = "pm";
  } else {
    periodAr = "ص";
    periodEn = "am";
  }

  const clock = `${h}:${m}`;
  const label =
    locale === "en" ? `${clock} ${periodEn}` : `${clock} ${periodAr}`;
  return {
    clock,
    periodAr,
    periodEn,
    label,
    labelFull: label,
  };
}

/** Build ISO local start */
export function toReservationStartsAt(date: string, time: string): string {
  return `${date}T${time}:00`;
}

export const DEFAULT_BOOKING_TIME = "19:00";

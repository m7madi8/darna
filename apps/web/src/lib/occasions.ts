import type { Locale } from "@/lib/i18n/messages";

export type OccasionId =
  | "none"
  | "dinner"
  | "birthday"
  | "anniversary"
  | "engagement"
  | "wedding"
  | "business"
  | "private"
  | "other";

export type OccasionOption = {
  id: OccasionId;
  label: Record<Locale, string>;
  hint: Record<Locale, string>;
  /** Highlight for celebrations */
  featured?: boolean;
};

export const OCCASIONS: OccasionOption[] = [
  {
    id: "none",
    label: { ar: "عشاء عادي", en: "Regular dinner" },
    hint: { ar: "بدون مناسبة خاصة", en: "No special occasion" },
  },
  {
    id: "dinner",
    label: { ar: "عشاء خاص", en: "Private dinner" },
    hint: { ar: "أمسية هادئة ومميزة", en: "An intimate evening" },
  },
  {
    id: "birthday",
    label: { ar: "عيد ميلاد", en: "Birthday" },
    hint: { ar: "احتفال بالأحباء", en: "Celebrate with loved ones" },
    featured: true,
  },
  {
    id: "anniversary",
    label: { ar: "ذكرى سنوية", en: "Anniversary" },
    hint: { ar: "لحظة تستحق التوقف", en: "A moment worth pausing for" },
    featured: true,
  },
  {
    id: "engagement",
    label: { ar: "خطوبة", en: "Engagement" },
    hint: { ar: "بداية قصة جديدة", en: "The start of a new chapter" },
    featured: true,
  },
  {
    id: "wedding",
    label: { ar: "فرح / زفاف", en: "Wedding celebration" },
    hint: { ar: "طاولات للأفراح والمناسبات الكبيرة", en: "Tables for weddings & large celebrations" },
    featured: true,
  },
  {
    id: "business",
    label: { ar: "عمل / ضيافة", en: "Business hosting" },
    hint: { ar: "لقاء رسمي بأناقة", en: "Formal hosting, refined" },
  },
  {
    id: "private",
    label: { ar: "مناسبة خاصة", en: "Private occasion" },
    hint: { ar: "حدث خاص بترتيبكم", en: "A private gathering your way" },
    featured: true,
  },
  {
    id: "other",
    label: { ar: "أخرى", en: "Other" },
    hint: { ar: "اكتبوا التفاصيل في الملاحظات", en: "Add details in the notes" },
  },
];

export function occasionLabel(id: OccasionId, locale: Locale): string {
  return OCCASIONS.find((o) => o.id === id)?.label[locale] ?? id;
}

/** Encode occasion into reservation notes for staff visibility */
export function composeReservationNotes(opts: {
  occasion: OccasionId;
  locale: Locale;
  notes?: string;
  vip?: boolean;
}): string {
  const parts: string[] = [];
  if (opts.vip) parts.push(opts.locale === "ar" ? "VIP" : "VIP");
  if (opts.occasion !== "none") {
    const label = occasionLabel(opts.occasion, opts.locale);
    parts.push(opts.locale === "ar" ? `مناسبة: ${label}` : `Occasion: ${label}`);
  }
  if (opts.notes?.trim()) parts.push(opts.notes.trim());
  return parts.join(" · ");
}

import type { Locale } from "@/lib/i18n/messages";

export type PackageId = "intimate" | "heritage" | "royal" | "grand";

export type ExtraId = "chef" | "service" | "runners" | "coordinator";

export type EventsPackage = {
  id: PackageId;
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  includes: Record<Locale, string[]>;
  /** Fixed price per guest (ILS) */
  pricePerGuest: number;
  guestMin: number;
  guestMax: number;
  accent: string;
};

export type EventsExtra = {
  id: ExtraId;
  name: Record<Locale, string>;
  hint: Record<Locale, string>;
  /** Fixed add-on price (ILS) */
  price: number;
  /** If true, price scales with quantity of staff */
  perUnit?: boolean;
  unitLabel?: Record<Locale, string>;
};

export const EVENTS_PACKAGES: EventsPackage[] = [
  {
    id: "intimate",
    name: { ar: "الحميمية", en: "Intimate" },
    tagline: {
      ar: "تجمّعات صغيرة بطابع دارنا الدافئ",
      en: "Small gatherings with Darna’s warm touch",
    },
    includes: {
      ar: [
        "مقبّلات وموائد رئيسية",
        "مشروبات غير كحولية",
        "تقديم أنيق على المائدة",
        "ترتيب طاولات بسيط",
      ],
      en: [
        "Starters & mains",
        "Soft drinks",
        "Elegant table service",
        "Simple table styling",
      ],
    },
    pricePerGuest: 95,
    guestMin: 20,
    guestMax: 40,
    accent: "#c4b48a",
  },
  {
    id: "heritage",
    name: { ar: "التراث", en: "Heritage" },
    tagline: {
      ar: "قائمة كاملة لمناسبات العائلة والأصدقاء",
      en: "A full menu for family & friends celebrations",
    },
    includes: {
      ar: [
        "قائمة متعددة الأطباق",
        "محطة حلويات خفيفة",
        "تنسيق طاولات دارنا",
        "مشروبات ساخنة وباردة",
      ],
      en: [
        "Multi-course menu",
        "Light dessert station",
        "Darna table styling",
        "Hot & cold drinks",
      ],
    },
    pricePerGuest: 140,
    guestMin: 40,
    guestMax: 80,
    accent: "#d4c4a0",
  },
  {
    id: "royal",
    name: { ar: "الملكية", en: "Royal" },
    tagline: {
      ar: "للأفراح والمناسبات التي تستحق وقفة",
      en: "For weddings and moments that deserve a pause",
    },
    includes: {
      ar: [
        "قائمة فاخرة متعددة المسارات",
        "محطة حلويات ومشروبات",
        "ترتيب مائدة احتفالي",
        "استقبال ترحيبي للضيوف",
      ],
      en: [
        "Premium multi-course menu",
        "Dessert & drinks station",
        "Celebratory table design",
        "Welcome hosting for guests",
      ],
    },
    pricePerGuest: 195,
    guestMin: 60,
    guestMax: 120,
    accent: "#e8dcc0",
  },
  {
    id: "grand",
    name: { ar: "الكبرى", en: "Grand" },
    tagline: {
      ar: "تموين خارجي كامل للمناسبات الكبيرة",
      en: "Full off-site catering for grand occasions",
    },
    includes: {
      ar: [
        "تموين خارجي متكامل",
        "قائمة مخصّصة حسب المناسبة",
        "محطات تقديم حيّة",
        "تنسيق كامل مع فريق دارنا",
      ],
      en: [
        "Complete off-site catering",
        "Menu tailored to your occasion",
        "Live serving stations",
        "Full coordination with Darna’s team",
      ],
    },
    pricePerGuest: 250,
    guestMin: 80,
    guestMax: 200,
    accent: "#f0e6d0",
  },
];

export const EVENTS_EXTRAS: EventsExtra[] = [
  {
    id: "chef",
    name: { ar: "شيف خاص", en: "Private chef" },
    hint: {
      ar: "شيف دارنا يُشرف على المطبخ طوال المناسبة",
      en: "A Darna chef oversees the kitchen throughout your event",
    },
    price: 900,
  },
  {
    id: "service",
    name: { ar: "طاقم خدمة", en: "Service staff" },
    hint: {
      ar: "مضيفون محترفون للعناية بالضيوف والمائدة",
      en: "Professional hosts for guests and the table",
    },
    price: 380,
    perUnit: true,
    unitLabel: { ar: "موظف", en: "staff" },
  },
  {
    id: "runners",
    name: { ar: "طاقم تقديم", en: "Food runners" },
    hint: {
      ar: "فريق تقديم سريع بين المطبخ والمائدة",
      en: "A swift team between kitchen and table",
    },
    price: 280,
    perUnit: true,
    unitLabel: { ar: "موظف", en: "staff" },
  },
  {
    id: "coordinator",
    name: { ar: "منسّق مناسبة", en: "Event coordinator" },
    hint: {
      ar: "تنسيق التوقيت والضيافة من البداية حتى الختام",
      en: "Timing and hospitality coordinated from start to finish",
    },
    price: 650,
  },
];

export function packageById(id: PackageId): EventsPackage {
  return EVENTS_PACKAGES.find((p) => p.id === id) ?? EVENTS_PACKAGES[0]!;
}

export function formatIls(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-PS" : "en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
  return locale === "ar" ? `${formatted} ₪` : `₪${formatted}`;
}

export function estimateEventsTotal(opts: {
  packageId: PackageId;
  guests: number;
  extras: Partial<Record<ExtraId, number>>;
}): number {
  const pkg = packageById(opts.packageId);
  const guests = Math.max(pkg.guestMin, Math.min(pkg.guestMax, opts.guests));
  let total = pkg.pricePerGuest * guests;

  for (const extra of EVENTS_EXTRAS) {
    const qty = opts.extras[extra.id] ?? 0;
    if (qty <= 0) continue;
    total += extra.perUnit ? extra.price * qty : extra.price;
  }

  return total;
}

export function composeEventsNotes(opts: {
  locale: Locale;
  packageId: PackageId;
  guests: number;
  extras: Partial<Record<ExtraId, number>>;
  notes?: string;
  eventDate?: string;
}): string {
  const pkg = packageById(opts.packageId);
  const parts: string[] = [
    opts.locale === "ar" ? "تموين / مناسبات" : "Events / Catering",
    opts.locale === "ar"
      ? `الباقة: ${pkg.name.ar}`
      : `Package: ${pkg.name.en}`,
    opts.locale === "ar"
      ? `الضيوف: ${opts.guests}`
      : `Guests: ${opts.guests}`,
  ];

  if (opts.eventDate) {
    parts.push(
      opts.locale === "ar"
        ? `التاريخ: ${opts.eventDate}`
        : `Date: ${opts.eventDate}`
    );
  }

  const selectedExtras = EVENTS_EXTRAS.filter(
    (e) => (opts.extras[e.id] ?? 0) > 0
  ).map((e) => {
    const qty = opts.extras[e.id] ?? 0;
    const label = e.name[opts.locale];
    return e.perUnit ? `${label} ×${qty}` : label;
  });

  if (selectedExtras.length) {
    parts.push(
      opts.locale === "ar"
        ? `إضافات: ${selectedExtras.join("، ")}`
        : `Extras: ${selectedExtras.join(", ")}`
    );
  }

  const estimate = estimateEventsTotal({
    packageId: opts.packageId,
    guests: opts.guests,
    extras: opts.extras,
  });
  parts.push(
    opts.locale === "ar"
      ? `تقدير: ${formatIls(estimate, "ar")}`
      : `Estimate: ${formatIls(estimate, "en")}`
  );

  if (opts.notes?.trim()) parts.push(opts.notes.trim());
  return parts.join(" · ");
}

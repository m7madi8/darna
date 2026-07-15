export type Locale = "ar" | "en";

export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_STORAGE_KEY = "darna-locale";

type Msg = {
  brand: string;
  brandLatin: string;
  tagline: string;
  reserveCta: string;
  location: string;
  getDirections: string;
  openMaps: string;
  reserveEvening: string;
  tablesOpen: (n: number) => string;
  evening: string;
  table: string;
  details: string;
  whichEvening: string;
  whichEveningHint: string;
  date: string;
  time: string;
  timeHint: string;
  durationHint: string;
  timeGroupMidday: string;
  timeGroupAfternoon: string;
  timeGroupEvening: string;
  tableWord: string;
  guests: string;
  guestsWord: string;
  atTheTable: string;
  chooseTable: string;
  chooseYourTable: string;
  chooseTableHint: string;
  green: string;
  red: string;
  tooSmallForParty: string;
  am: string;
  pm: string;
  selected: string;
  seats: string;
  yourDetails: string;
  holdTable: (n: string | number) => string;
  fullName: string;
  phone: string;
  notes: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  notesPlaceholder: string;
  back: string;
  continue: string;
  requestTable: string;
  requestReceived: string;
  pendingConfirm: (code: string) => string;
  backHome: string;
  floor: string;
  free: string;
  taken: string;
  stepOf: (s: number) => string;
  langShort: string;
  switchTo: string;
  fewerGuests: string;
  moreGuests: string;
};

function tablesOpenAr(n: number): string {
  if (n <= 0) {
    return "لا تتوفر طاولات حاليًا — جرّب موعدًا آخر، وسنسعد باستقبالكم.";
  }
  if (n === 1) {
    return "طاولة واحدة بانتظاركم الليلة. اختاروا ساعتكم ومقعدكم… ونرحّب بكم كما يليق.";
  }
  if (n === 2) {
    return "طاولتان متاحتان الليلة. اختاروا ساعتكم ومقعدكم… ونرحّب بكم كما يليق.";
  }
  if (n >= 3 && n <= 10) {
    return `${n} طاولات متاحة الليلة. اختاروا ساعتكم ومقعدكم… ونرحّب بكم كما يليق.`;
  }
  return `${n} طاولة متاحة الليلة. اختاروا ساعتكم ومقعدكم… ونرحّب بكم كما يليق.`;
}

function tablesOpenEn(n: number): string {
  if (n <= 0) {
    return "No tables right now — try another time. We’d love to welcome you.";
  }
  if (n === 1) {
    return "One table awaits you tonight. Choose your hour and your seat — we’ll host you with care.";
  }
  return `${n} tables await you tonight. Choose your hour and your seat — we’ll host you with care.`;
}

export const messages: Record<Locale, Msg> = {
  ar: {
    brand: "دارنا",
    brandLatin: "DARNA",
    tagline: "حيث تلتقي الألفة بالمذاق — احجزوا طاولتكم في قلب رام الله.",
    reserveCta: "احجز طاولتك",
    location: "فلسطين · رام الله",
    getDirections: "الموقع على الخريطة",
    openMaps: "فتح موقع دارنا على خرائط Google",
    reserveEvening: "أمسيتكم تبدأ هنا",
    tablesOpen: tablesOpenAr,
    evening: "الموعد",
    table: "الطاولة",
    details: "تفاصيلكم",
    whichEvening: "متى نراكم؟",
    whichEveningHint: "نرحّب بكم يوميًا من الساعة ١٢ ظهرًا حتى ١٢ ليلاً.",
    date: "اليوم",
    time: "الساعة",
    timeHint: "١٢ ظهرًا – ١٢ ليلاً",
    durationHint: "جلسة لساعتين",
    timeGroupMidday: "الظهيرة",
    timeGroupAfternoon: "العصر",
    timeGroupEvening: "المساء",
    tableWord: "طاولة",
    guests: "عدد الضيوف",
    guestsWord: "ضيوف",
    atTheTable: "على المائدة",
    chooseTable: "اختَر طاولتك",
    chooseYourTable: "طاولتكم… أين تحبّون الجلوس؟",
    chooseTableHint: "أخضر: متاحة · رمادي: أصغر من العدد · أحمر: محجوزة",
    green: "متاحة",
    red: "محجوزة",
    tooSmallForParty: "أصغر من العدد",
    am: "ص",
    pm: "م",
    selected: "طاولتكم",
    seats: "تتسع لـ",
    yourDetails: "لنتعارف",
    holdTable: (n) =>
      `سنحتفظ بالطاولة ${n} ريثما نؤكّد حجزكم — بضع لحظات فقط.`,
    fullName: "الاسم",
    phone: "رقم الهاتف",
    notes: "ملاحظة خاصة",
    namePlaceholder: "كيف نناديكم؟",
    phonePlaceholder: "+٩٧٠…",
    notesPlaceholder: "مناسبة خاصة، نافذة، كرسي إضافي…",
    back: "رجوع",
    continue: "التالي",
    requestTable: "تأكيد الطلب",
    requestReceived: "وصلت رسالتكم",
    pendingConfirm: (code) =>
      `طلب الحجز ${code} بين أيدينا — نؤكّده لكم قريبًا.`,
    backHome: "العودة للرئيسية",
    floor: "قاعة الجلوس",
    free: "متاحة",
    taken: "محجوزة",
    stepOf: (s) => `الخطوة ${s} من ٣`,
    langShort: "ع",
    switchTo: "English",
    fewerGuests: "تقليل العدد",
    moreGuests: "زيادة العدد",
  },
  en: {
    brand: "DARNA",
    brandLatin: "DARNA",
    tagline: "Where warmth meets the table — reserve your place in the heart of Ramallah.",
    reserveCta: "Book your table",
    location: "Palestine · Ramallah",
    getDirections: "Get directions",
    openMaps: "Open DARNA on Google Maps",
    reserveEvening: "Your evening begins here",
    tablesOpen: tablesOpenEn,
    evening: "When",
    table: "Table",
    details: "You",
    whichEvening: "When shall we see you?",
    whichEveningHint: "We’re open every day from 12 noon to 12 midnight.",
    date: "Date",
    time: "Time",
    timeHint: "12 noon – 12 midnight",
    durationHint: "Two-hour seating",
    timeGroupMidday: "Midday",
    timeGroupAfternoon: "Afternoon",
    timeGroupEvening: "Evening",
    tableWord: "Table",
    guests: "Party size",
    guestsWord: "guests",
    atTheTable: "at the table",
    chooseTable: "Choose a table",
    chooseYourTable: "Where would you like to sit?",
    chooseTableHint: "Green: open · Grey: too small · Red: taken",
    green: "Open",
    red: "Taken",
    tooSmallForParty: "Too small",
    am: "am",
    pm: "pm",
    selected: "Your table",
    seats: "Seats",
    yourDetails: "A little about you",
    holdTable: (n) =>
      `We’ll hold table ${n} while we confirm — just a moment.`,
    fullName: "Name",
    phone: "Phone",
    notes: "A special note",
    namePlaceholder: "How should we greet you?",
    phonePlaceholder: "+970…",
    notesPlaceholder: "Celebration, window seat, high chair…",
    back: "Back",
    continue: "Next",
    requestTable: "Send request",
    requestReceived: "We’ve received you",
    pendingConfirm: (code) =>
      `Request ${code} is with us — we’ll confirm shortly.`,
    backHome: "Back to home",
    floor: "Dining room",
    free: "Open",
    taken: "Taken",
    stepOf: (s) => `Step ${s} of 3`,
    langShort: "EN",
    switchTo: "العربية",
    fewerGuests: "Fewer guests",
    moreGuests: "More guests",
  },
};

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "ar" || value === "en";
}

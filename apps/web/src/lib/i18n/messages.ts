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
  vipCta: string;
  vipHint: string;
  vipToggle: string;
  vipEyebrow: string;
  vipTitle: string;
  vipTagline: string;
  eventsCta: string;
  eventsEyebrow: string;
  eventsTitle: string;
  eventsTagline: string;
  eventsHeroCta: string;
  eventsPackagesTitle: string;
  eventsPackagesHint: string;
  eventsPerGuest: string;
  eventsGuestsRange: (min: number, max: number) => string;
  eventsIncludes: string;
  eventsExtrasTitle: string;
  eventsExtrasHint: string;
  eventsQuoteTitle: string;
  eventsQuoteHint: string;
  eventsSubmit: string;
  eventsDisclaimer: string;
  eventsReceived: string;
  eventsPending: (code: string) => string;
  eventsEstimate: string;
  eventsEventDate: string;
  eventsGuestCount: string;
  eventsBackHome: string;
  eventsAdd: string;
  eventsRemove: string;
  perkTable: string;
  perkHost: string;
  perkParty: string;
  perkOccasion: string;
  vipRequestTitle: string;
  vipRequestHint: string;
  vipDuration: string;
  vipNotesPlaceholder: string;
  vipSubmit: string;
  vipDisclaimer: string;
  vipBackRegular: string;
  vipReceived: string;
  vipPending: (code: string) => string;
  occasionTitle: string;
  occasionHint: string;
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
    vipCta: "حجز VIP",
    vipHint: "طاولة مميزة وخدمة خاصة",
    vipToggle: "طلب طاولة VIP",
    vipEyebrow: "تجربة دارنا الخاصة",
    vipTitle: "VIP",
    vipTagline:
      "أمسية بطابع خاص — طاولة مفضّلة، استقبال شخصي، وترتيب يليق بالمناسبات والأفراح.",
    eventsCta: "مناسبات وتموين",
    eventsEyebrow: "لحظة تليق بالذهب · خارج القاعة",
    eventsTitle: "مناسبات",
    eventsTagline:
      "أفراح ومناسبات تُروى — تموين دارنا يفتح القوس على مائدة تُضيء الليلة كلها.",
    eventsHeroCta: "ادخلوا عالم الباقات",
    eventsPackagesTitle: "باقات ومزاياها",
    eventsPackagesHint: "كل باقة بمزاياها كاملة — اختاروا ما يليق بمناسبتكم.",
    eventsPerGuest: "للضيف",
    eventsGuestsRange: (min, max) => `من ${min} إلى ${max} ضيفًا`,
    eventsIncludes: "تشمل",
    eventsExtrasTitle: "فريقكم الخاص",
    eventsExtrasHint: "أضيفوا شيفًا أو طاقم خدمة… وكأن دارنا جاءت إليكم.",
    eventsQuoteTitle: "اكتبوا دعوة مناسبتكم",
    eventsQuoteHint: "نراجع التفاصيل ونردّ عليكم بترتيب يليق باللحظة.",
    eventsSubmit: "إرسال طلب المناسبة",
    eventsDisclaimer: "الأسعار تقديرية وتُؤكَّد حسب التاريخ وعدد الضيوف وموقع المناسبة.",
    eventsReceived: "وصل طلب مناسبتكم",
    eventsPending: (code) =>
      `طلبكم ${code} بين أيدينا — سنتواصل معكم قريبًا لترتيب التفاصيل.`,
    eventsEstimate: "التقدير الأولي",
    eventsEventDate: "تاريخ المناسبة",
    eventsGuestCount: "عدد الضيوف",
    eventsBackHome: "العودة للرئيسية",
    eventsAdd: "إضافة",
    eventsRemove: "إزالة",
    perkTable: "طاولة مميزة في أفضل المواقع داخل القاعة",
    perkHost: "استقبال وعناية خاصة طوال الأمسية",
    perkParty: "مناسب للمجموعات حتى ٤٠ ضيفًا",
    perkOccasion: "أفراح، خطوبة، ذكريات، ومناسبات خاصة",
    vipRequestTitle: "اطلبوا أمسيتكم",
    vipRequestHint: "نراجع طلب VIP خلال وقت قصير ونؤكّده لكم شخصيًا.",
    vipDuration: "جلسة VIP حتى ٣ ساعات",
    vipNotesPlaceholder: "تفاصيل الزينة، الكعكة، ترتيب الطاولات، أو أي طلب خاص…",
    vipSubmit: "إرسال طلب VIP",
    vipDisclaimer: "طلبات VIP تخضع للتأكيد حسب التوفر وترتيب القاعة.",
    vipBackRegular: "حجز طاولة عادي",
    vipReceived: "وصل طلب VIP",
    vipPending: (code) =>
      `طلبكم ${code} بين أيدينا — سنتواصل معكم لتأكيد التفاصيل قريبًا.`,
    occasionTitle: "نوع المناسبة",
    occasionHint: "أفراح، مناسبات خاصة، أو عشاء هادئ — اختاروا ما يناسبكم.",
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
    chooseYourTable: "أين تحبّون الجلوس؟",
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
    vipCta: "VIP booking",
    vipHint: "Preferred table & attentive service",
    vipToggle: "Request a VIP table",
    vipEyebrow: "The Darna private experience",
    vipTitle: "VIP",
    vipTagline:
      "An elevated evening — preferred seating, personal hosting, and arrangements for celebrations & weddings.",
    eventsCta: "Events & catering",
    eventsEyebrow: "A golden hour · beyond the dining room",
    eventsTitle: "Events",
    eventsTagline:
      "Weddings and private occasions, told in light — Darna catering opens the arch onto a table that carries the night.",
    eventsHeroCta: "Enter the packages",
    eventsPackagesTitle: "Packages & inclusions",
    eventsPackagesHint: "Four fixed per-guest packages — every inclusion listed clearly.",
    eventsPerGuest: "per guest",
    eventsGuestsRange: (min, max) => `${min}–${max} guests`,
    eventsIncludes: "Includes",
    eventsExtrasTitle: "Your private team",
    eventsExtrasHint: "Add a chef or service staff — as if Darna came to you.",
    eventsQuoteTitle: "Write your invitation",
    eventsQuoteHint: "We review the details and reply with an arrangement worthy of the moment.",
    eventsSubmit: "Send event request",
    eventsDisclaimer:
      "Prices are estimates and confirmed by date, guest count, and venue.",
    eventsReceived: "Event request received",
    eventsPending: (code) =>
      `Request ${code} is with us — we’ll reach out shortly to arrange the details.`,
    eventsEstimate: "Initial estimate",
    eventsEventDate: "Event date",
    eventsGuestCount: "Guest count",
    eventsBackHome: "Back to home",
    eventsAdd: "Add",
    eventsRemove: "Remove",
    perkTable: "Preferred table in the best room positions",
    perkHost: "Attentive hosting throughout your evening",
    perkParty: "Groups up to 40 guests",
    perkOccasion: "Weddings, engagements, anniversaries & private events",
    vipRequestTitle: "Request your evening",
    vipRequestHint: "We review VIP requests quickly and confirm with you personally.",
    vipDuration: "VIP seating up to 3 hours",
    vipNotesPlaceholder: "Florals, cake, table layout, or any special request…",
    vipSubmit: "Send VIP request",
    vipDisclaimer: "VIP requests are confirmed based on availability and floor plan.",
    vipBackRegular: "Regular table booking",
    vipReceived: "VIP request received",
    vipPending: (code) =>
      `Request ${code} is with us — we’ll confirm the details shortly.`,
    occasionTitle: "Occasion",
    occasionHint: "Weddings, private celebrations, or a quiet dinner — choose what fits.",
    reserveEvening: "Your evening begins here",
    tablesOpen: tablesOpenEn,
    evening: "Evening",
    table: "Table",
    details: "Details",
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
    chooseYourTable: "Choose your table",
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

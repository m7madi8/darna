"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Minus,
  Plus,
  Sparkles,
  Users,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LocationLink } from "@/components/brand/location-link";
import { LanguageToggle } from "@/components/locale/language-toggle";
import { useLocale } from "@/components/locale/locale-provider";
import { Button } from "@/components/ui/button";
import { useCreatePublicReservation } from "@/features/public/use-public-booking";
import { toReservationStartsAt } from "@/lib/booking-hours";
import {
  EVENTS_EXTRAS,
  EVENTS_PACKAGES,
  composeEventsNotes,
  estimateEventsTotal,
  formatIls,
  packageById,
  type ExtraId,
  type PackageId,
} from "@/lib/events-packages";
import { driftBlob, softEase, softSpring } from "@/lib/guest-motion";
import { PUBLIC_BRANCH_SLUG } from "@/lib/public-branch";
import { guestBrandClass, guestHeadingClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

const EVENTS_DURATION_MINUTES = 240;

const EXTRA_ICONS: Record<ExtraId, typeof ChefHat> = {
  chef: ChefHat,
  service: Users,
  runners: UtensilsCrossed,
  coordinator: ClipboardList,
};

const PACKAGE_OBJECTS: Record<PackageId, string> = {
  intimate: "object-[center_55%]",
  heritage: "object-[center_35%]",
  royal: "object-[center_22%]",
  grand: "object-[center_40%]",
};

export default function EventsPage() {
  const { t, locale, dir } = useLocale();
  const reduce = useReducedMotion();
  const create = useCreatePublicReservation(PUBLIC_BRANCH_SLUG);
  const CtaArrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  const [packageId, setPackageId] = useState<PackageId>("royal");
  const [extras, setExtras] = useState<Partial<Record<ExtraId, number>>>({});
  const [guests, setGuests] = useState(80);
  const [eventDate, setEventDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const selected = packageById(packageId);

  const estimate = useMemo(
    () => estimateEventsTotal({ packageId, guests, extras }),
    [packageId, guests, extras]
  );

  function setExtraQty(id: ExtraId, qty: number) {
    setExtras((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onSelectPackage(id: PackageId) {
    const pkg = packageById(id);
    setPackageId(id);
    setGuests((g) => Math.min(pkg.guestMax, Math.max(pkg.guestMin, g)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    try {
      const res = await create.mutateAsync({
        guest_name: name,
        guest_phone: phone,
        party_size: guests,
        starts_at: toReservationStartsAt(eventDate, "19:00"),
        duration_minutes: EVENTS_DURATION_MINUTES,
        is_vip: true,
        notes: composeEventsNotes({
          locale,
          packageId,
          guests,
          extras,
          notes,
          eventDate,
        }),
      });
      setSubmitted(res.code || "EVT");
    } catch {
      setSubmitted(`EVT-${format(new Date(), "HHmm")}`);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#060d0a] text-cream-100">
      <Atmosphere reduce={Boolean(reduce)} />

      <motion.header
        className="relative z-40 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8"
        initial={reduce ? false : { opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: softEase }}
      >
        <BrandLogo href="/" size="sm" priority />
        <div className="flex items-center gap-1">
          <LocationLink variant="icon" />
          <LanguageToggle />
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {submitted ? (
          <SuccessView
            key="done"
            code={submitted}
            locale={locale}
            reduce={Boolean(reduce)}
            title={t.eventsReceived}
            body={t.eventsPending(submitted)}
            home={t.eventsBackHome}
          />
        ) : (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ── Classic luxury hero ── */}
            <section ref={heroRef} className="relative isolate min-h-dvh w-full">
              <div className="absolute inset-0 overflow-hidden" aria-hidden>
                <motion.div
                  className="absolute inset-[-4%]"
                  style={
                    reduce
                      ? undefined
                      : { y: heroY, scale: heroScale, opacity: heroOpacity }
                  }
                >
                  <Image
                    src="/hero-dining.jpg"
                    alt=""
                    fill
                    priority
                    quality={75}
                    sizes="100vw"
                    className="object-cover object-[center_28%]"
                  />
                </motion.div>

                <div className="absolute inset-0 bg-[#060d0a]/52" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(196,180,138,0.12),transparent_55%)]" />
                <div
                  className="absolute inset-x-0 bottom-0 h-[55%]"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(6,13,10,0) 0%, rgba(6,13,10,0.4) 35%, rgba(6,13,10,0.88) 75%, #060d0a 100%)",
                  }}
                />
              </div>

              <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-5 pb-[max(4rem,env(safe-area-inset-bottom))] pt-28 text-center sm:px-8 sm:pb-20 sm:pt-24">
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: softEase }}
                  className="text-[10px] tracking-[0.35em] text-[#d4c4a0]/70 sm:text-[11px]"
                >
                  {t.eventsEyebrow}
                </motion.p>

                {locale === "en" ? (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: softEase }}
                    className="mt-8"
                    dir="ltr"
                  >
                    <Image
                      src="/logo.png"
                      alt="DARNA"
                      width={720}
                      height={220}
                      priority
                      className="mx-auto h-auto w-[min(72vw,20rem)] object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                    />
                  </motion.div>
                ) : (
                  <motion.h1
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: softEase }}
                    className={guestBrandClass(
                      locale,
                      "mt-7 text-[clamp(2.75rem,11svh,5.5rem)] leading-[1.05] text-cream-50"
                    )}
                  >
                    {t.brand}
                  </motion.h1>
                )}

                <motion.div
                  className="mt-7 flex items-center gap-3"
                  initial={reduce ? false : { opacity: 0, scaleX: 0.6 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.85, delay: 0.25, ease: softEase }}
                  aria-hidden
                >
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#c4b48a]/60 sm:w-14" />
                  <span className="h-1 w-1 rotate-45 bg-[#c4b48a]/80" />
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#c4b48a]/60 sm:w-14" />
                </motion.div>

                <motion.h2
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.35, ease: softEase }}
                  className="events-wordmark mt-5 text-[clamp(2rem,8vw,3.75rem)]"
                  dir="ltr"
                >
                  {locale === "ar" ? "تموين" : "CATERING"}
                </motion.h2>

                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.48, ease: softEase }}
                  className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-cream-100/68 sm:text-base"
                >
                  {t.eventsTagline}
                </motion.p>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.58, ease: softEase }}
                  className="mt-10"
                >
                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.02 }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    transition={softSpring}
                  >
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => scrollTo("events-packages")}
                      className="h-12 rounded-full bg-[#ece9d4] px-9 text-base font-medium text-[#1a1810] shadow-[0_10px_36px_rgba(0,0,0,0.28)] hover:bg-[#f5f2e3]"
                    >
                      {t.eventsHeroCta}
                      <CtaArrow className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* ── Packages with full features ── */}
            <section
              id="events-packages"
              className="relative z-10 scroll-mt-8 px-4 py-16 sm:px-8 sm:py-24"
            >
              <div className="mx-auto max-w-6xl">
                <motion.div
                  className="mx-auto max-w-2xl text-center"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: softEase }}
                >
                  <p className="text-[11px] tracking-[0.32em] text-[#c4b48a]/75">
                    {locale === "ar" ? "٠١" : "01"}
                  </p>
                  <h2
                    className={guestHeadingClass(
                      locale,
                      "mt-3 text-3xl text-cream-50 sm:text-4xl"
                    )}
                  >
                    {t.eventsPackagesTitle}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-200/55 sm:text-base">
                    {t.eventsPackagesHint}
                  </p>
                </motion.div>

                <div className="mt-12 space-y-5 lg:space-y-6">
                  {EVENTS_PACKAGES.map((pkg, index) => {
                    const active = packageId === pkg.id;
                    const featured = pkg.id === "royal" || pkg.id === "grand";
                    return (
                      <motion.button
                        key={pkg.id}
                        type="button"
                        onClick={() => onSelectPackage(pkg.id)}
                        initial={reduce ? false : { opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          duration: 0.6,
                          delay: reduce ? 0 : index * 0.08,
                          ease: softEase,
                        }}
                        whileHover={reduce ? undefined : { y: -3 }}
                        className={cn(
                          "group relative grid w-full overflow-hidden rounded-[1.75rem] border text-start transition sm:rounded-[2rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]",
                          active
                            ? "border-[#e8dcc0]/55 bg-[#101a14] shadow-[0_0_0_1px_rgba(232,220,192,0.2),0_28px_70px_rgba(0,0,0,0.45)]"
                            : "border-cream-200/12 bg-[#0c1410]/85 hover:border-cream-200/28"
                        )}
                      >
                        {/* Media side */}
                        <div className="relative min-h-[13rem] overflow-hidden sm:min-h-[16rem] lg:min-h-full">
                          <Image
                            src="/hero-dining.jpg"
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className={cn(
                              "object-cover transition duration-700",
                              PACKAGE_OBJECTS[pkg.id],
                              active ? "scale-105" : "scale-100 group-hover:scale-105"
                            )}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1410] via-[#0c1410]/45 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#0c1410]/35 lg:to-[#0c1410]" />
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(232,220,192,0.12),transparent_55%)]" />

                          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6 lg:inset-auto lg:start-0 lg:top-0 lg:flex-col lg:items-start lg:p-7">
                            <div>
                              <p
                                className="font-brand text-[10px] tracking-[0.28em] text-[#e8dcc0]/75"
                                dir="ltr"
                              >
                                {String(index + 1).padStart(2, "0")}
                              </p>
                              <h3
                                className={guestHeadingClass(
                                  locale,
                                  "mt-1 text-2xl text-cream-50 sm:text-3xl"
                                )}
                              >
                                {pkg.name[locale]}
                              </h3>
                            </div>
                            {featured ? (
                              <span className="rounded-full border border-[#e8dcc0]/35 bg-[#e8dcc0]/12 px-3 py-1 text-[10px] tracking-[0.14em] text-[#f0e6d0]">
                                {locale === "ar" ? "الأكثر طلبًا" : "Most loved"}
                              </span>
                            ) : null}
                          </div>

                          {active ? (
                            <motion.span
                              layoutId="pkg-check"
                              className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#e8dcc0] text-[#1a1810] shadow-[0_8px_24px_rgba(232,220,192,0.35)]"
                            >
                              <Check className="h-4 w-4" />
                            </motion.span>
                          ) : (
                            <span className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-cream-200/25 bg-black/25 text-cream-200/35 backdrop-blur-sm" />
                          )}
                        </div>

                        {/* Features side */}
                        <div className="relative flex flex-col justify-between gap-6 p-5 sm:p-7 lg:p-8">
                          {active && !reduce ? (
                            <motion.div
                              className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-[#c4b48a]/12 blur-3xl"
                              animate={{ opacity: [0.35, 0.7, 0.35] }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          ) : null}

                          <div className="relative">
                            <p className="max-w-md text-sm leading-relaxed text-cream-100/65 sm:text-[15px]">
                              {pkg.tagline[locale]}
                            </p>
                            <p className="mt-2 text-xs tracking-wide text-cream-200/40">
                              {t.eventsGuestsRange(pkg.guestMin, pkg.guestMax)}
                            </p>

                            <div className="mt-5">
                              <p className="text-[11px] tracking-[0.2em] text-[#c4b48a]/80">
                                {t.eventsIncludes}
                              </p>
                              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                                {pkg.includes[locale].map((item) => (
                                  <li
                                    key={item}
                                    className={cn(
                                      "flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm leading-snug transition",
                                      active
                                        ? "border-[#e8dcc0]/20 bg-[#e8dcc0]/6 text-cream-50"
                                        : "border-cream-200/8 bg-black/20 text-cream-100/75"
                                    )}
                                  >
                                    <Sparkles
                                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c4b48a]"
                                      aria-hidden
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="relative flex flex-wrap items-end justify-between gap-4 border-t border-cream-200/10 pt-5">
                            <div>
                              <p className="text-[11px] tracking-[0.14em] text-cream-200/40">
                                {t.eventsPerGuest}
                              </p>
                              <p
                                className="mt-0.5 font-brand text-3xl tracking-wide text-[#f5efd8]"
                                dir="ltr"
                              >
                                {formatIls(pkg.pricePerGuest, locale)}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition",
                                active
                                  ? "bg-gradient-to-r from-[#e8dcc0] to-[#c9b896] text-[#1a1810]"
                                  : "border border-cream-200/20 text-cream-200/70 group-hover:border-cream-200/40 group-hover:text-cream-100"
                              )}
                            >
                              {active ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  {locale === "ar" ? "مختارة" : "Selected"}
                                </>
                              ) : locale === "ar" ? (
                                "اختيار هذه الباقة"
                              ) : (
                                "Select package"
                              )}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── Extras ── */}
            <section className="relative z-10 px-4 py-10 sm:px-8 sm:py-16">
              <div className="mx-auto max-w-5xl">
                <motion.div
                  className="mx-auto max-w-2xl text-center"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: softEase }}
                >
                  <p className="text-[11px] tracking-[0.32em] text-[#c4b48a]/75">
                    {locale === "ar" ? "٠٢" : "02"}
                  </p>
                  <h2
                    className={guestHeadingClass(
                      locale,
                      "mt-3 text-3xl text-cream-50 sm:text-4xl"
                    )}
                  >
                    {t.eventsExtrasTitle}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm text-cream-200/55">
                    {t.eventsExtrasHint}
                  </p>
                </motion.div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {EVENTS_EXTRAS.map((extra, index) => {
                    const Icon = EXTRA_ICONS[extra.id];
                    const qty = extras[extra.id] ?? 0;
                    const active = qty > 0;
                    return (
                      <motion.div
                        key={extra.id}
                        initial={reduce ? false : { opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{
                          duration: 0.55,
                          delay: reduce ? 0 : index * 0.06,
                          ease: softEase,
                        }}
                        className={cn(
                          "relative overflow-hidden rounded-[1.5rem] border p-5 transition sm:p-6",
                          active
                            ? "border-[#e8dcc0]/45 bg-gradient-to-br from-[#1a2a20] to-[#0c1611] shadow-[0_0_40px_rgba(196,180,138,0.12)]"
                            : "border-cream-200/12 bg-[#0c1410]/80"
                        )}
                      >
                        {active && !reduce ? (
                          <motion.div
                            className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-[#c4b48a]/15 blur-2xl"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{
                              duration: 3.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        ) : null}

                        <div className="relative flex items-start gap-4">
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border",
                              active
                                ? "border-[#e8dcc0]/55 bg-[#e8dcc0]/12 text-[#f0e6d0]"
                                : "border-cream-200/15 text-cream-200/45"
                            )}
                          >
                            <Icon className="h-5 w-5" aria-hidden />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h3 className="text-base font-medium text-cream-50">
                                {extra.name[locale]}
                              </h3>
                              <p className="text-sm text-[#d4c4a0]" dir="ltr">
                                {formatIls(extra.price, locale)}
                                {extra.perUnit
                                  ? ` / ${extra.unitLabel?.[locale] ?? ""}`
                                  : ""}
                              </p>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-cream-200/50 sm:text-sm">
                              {extra.hint[locale]}
                            </p>

                            <div className="mt-4">
                              {extra.perUnit ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-cream-200/15 bg-black/25 p-1">
                                  <button
                                    type="button"
                                    aria-label={t.eventsRemove}
                                    disabled={qty <= 0}
                                    onClick={() => setExtraQty(extra.id, qty - 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-cream-200/70 transition hover:bg-cream-200/10 disabled:opacity-30"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="w-6 text-center text-sm tabular-nums text-cream-50">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    aria-label={t.eventsAdd}
                                    onClick={() =>
                                      setExtraQty(extra.id, Math.min(12, qty + 1))
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-cream-200/70 transition hover:bg-cream-200/10"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setExtraQty(extra.id, active ? 0 : 1)}
                                  className={cn(
                                    "rounded-full px-5 py-2.5 text-xs font-medium transition",
                                    active
                                      ? "bg-gradient-to-r from-[#e8dcc0] to-[#c9b896] text-[#1a1810]"
                                      : "border border-cream-200/25 text-cream-200/85 hover:bg-cream-200/8"
                                  )}
                                >
                                  {active ? (
                                    <span className="inline-flex items-center gap-1.5">
                                      <Check className="h-3.5 w-3.5" />
                                      {t.eventsRemove}
                                    </span>
                                  ) : (
                                    t.eventsAdd
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── Quote sanctuary ── */}
            <section
              id="events-quote"
              className="relative z-10 px-4 pb-[max(6rem,env(safe-area-inset-bottom))] pt-10 sm:px-8 sm:pb-28 sm:pt-16"
            >
              <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-[#e8dcc0]/22 bg-gradient-to-b from-[#142018]/95 to-[#0a1210] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)] sm:rounded-[2.5rem] sm:p-10">
                <div
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#e8dcc0]/50 to-transparent"
                  aria-hidden
                />
                {!reduce ? (
                  <motion.div
                    className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-[#c4b48a]/15 blur-3xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                ) : null}

                <div className="relative text-center">
                  <p className="text-[11px] tracking-[0.32em] text-[#c4b48a]/75">
                    {locale === "ar" ? "٠٣" : "03"}
                  </p>
                  <h2
                    className={guestHeadingClass(
                      locale,
                      "mt-3 text-3xl text-cream-50 sm:text-4xl"
                    )}
                  >
                    {t.eventsQuoteTitle}
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-cream-200/55">
                    {t.eventsQuoteHint}
                  </p>
                </div>

                <motion.div
                  layout
                  className="relative mt-8 overflow-hidden rounded-2xl border border-[#e8dcc0]/2 bg-black/30 p-5"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(232,220,192,0.15) 50%, transparent 60%)",
                      backgroundSize: "200% 100%",
                      animation: reduce ? undefined : "events-shimmer 4s ease-in-out infinite",
                    }}
                    aria-hidden
                  />
                  <div className="relative flex flex-wrap items-end justify-between gap-3">
                    <div className="text-start">
                      <p className="text-[11px] tracking-[0.18em] text-cream-200/45">
                        {selected.name[locale]}
                      </p>
                      <p className="mt-1 text-sm text-cream-100/70">
                        {guests} {t.guestsWord}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="text-[11px] tracking-[0.14em] text-cream-200/45">
                        {t.eventsEstimate}
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={estimate}
                          initial={reduce ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="mt-0.5 font-brand text-3xl tracking-wide text-[#f5efd8]"
                          dir="ltr"
                        >
                          {formatIls(estimate, locale)}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>

                <form onSubmit={submit} className="relative mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                        {t.eventsEventDate}
                      </span>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className={fieldClass()}
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                        {t.eventsGuestCount}
                      </span>
                      <input
                        type="number"
                        required
                        min={selected.guestMin}
                        max={selected.guestMax}
                        value={guests}
                        onChange={(e) => {
                          const n = Number(e.target.value) || selected.guestMin;
                          setGuests(
                            Math.min(
                              selected.guestMax,
                              Math.max(selected.guestMin, n)
                            )
                          );
                        }}
                        className={fieldClass()}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                        {t.fullName}
                      </span>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className={fieldClass()}
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                        {t.phone}
                      </span>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        className={fieldClass()}
                        dir="ltr"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                      {t.notes}
                    </span>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t.vipNotesPlaceholder}
                      className={cn(fieldClass(), "h-auto resize-none py-3.5")}
                    />
                  </label>

                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.02, y: -2 }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    transition={softSpring}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      loading={create.isPending}
                      className="relative h-14 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#e8dcc0] via-[#fff8e7] to-[#c9b896] text-base font-medium text-[#1a1810] shadow-[0_16px_50px_rgba(212,196,160,0.3)] hover:from-[#f0e6d0] hover:to-[#d4c4a0]"
                    >
                      {!reduce ? (
                        <span
                          className="pointer-events-none absolute inset-0 opacity-35"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.75) 50%, transparent 60%)",
                            backgroundSize: "200% 100%",
                            animation: "events-shimmer 3s ease-in-out infinite",
                          }}
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative z-10 inline-flex items-center gap-2">
                        {t.eventsSubmit}
                        <CtaArrow className="h-4 w-4" />
                      </span>
                    </Button>
                  </motion.div>

                  <p className="text-center text-[11px] leading-relaxed text-cream-200/35">
                    {t.eventsDisclaimer}
                  </p>
                </form>
              </div>
            </section>

            {/* Floating estimate pill */}
            <motion.button
              type="button"
              onClick={() => scrollTo("events-quote")}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#e8dcc0]/30 bg-[#0a1210]/90 px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-[#e8dcc0]" aria-hidden />
              <span className="text-xs text-cream-200/60">{t.eventsEstimate}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={estimate}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="font-brand text-sm tracking-wide text-[#f5efd8]"
                  dir="ltr"
                >
                  {formatIls(estimate, locale)}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Atmosphere({ reduce }: { reduce: boolean }) {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -15%, rgba(212,196,160,0.14), transparent 52%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(35,68,49,0.35), transparent 50%), linear-gradient(180deg, #060d0a 0%, #0c1612 40%, #060d0a 100%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {!reduce ? (
        <>
          <motion.div
            className="pointer-events-none fixed bottom-[8%] left-[4%] -z-10 h-96 w-96 rounded-full bg-[#c4b48a]/10 blur-3xl"
            animate={driftBlob(26, [0, 28, 0], [0, -20, 0])}
          />
          <motion.div
            className="pointer-events-none fixed right-[6%] top-[30%] -z-10 h-72 w-72 rounded-full bg-[#234431]/40 blur-3xl"
            animate={driftBlob(22, [0, -18, 0], [0, 22, 0])}
          />
        </>
      ) : null}
    </>
  );
}

function SuccessView({
  code,
  locale,
  reduce,
  title,
  body,
  home,
}: {
  code: string;
  locale: "ar" | "en";
  reduce: boolean;
  title: string;
  body: string;
  home: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.75, ease: softEase }}
      className="relative z-10 mx-auto mt-24 max-w-md px-4 pb-[max(3rem,env(safe-area-inset-bottom))] text-center"
    >
      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-[#c4b48a]/25 blur-3xl"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      <motion.div
        className="relative mx-auto mb-8 flex justify-center"
        animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/logo.png"
          alt={locale === "ar" ? "دارنا" : "DARNA"}
          width={280}
          height={86}
          className="h-14 w-auto object-contain"
        />
      </motion.div>
      <motion.div
        className="relative mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[#e8dcc0]/4 bg-[#e8dcc0]/12"
        initial={reduce ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.55, ease: softEase }}
      >
        <Sparkles className="h-7 w-7 text-[#e8dcc0]" />
      </motion.div>
      <h1 className={guestHeadingClass(locale, "text-3xl text-cream-50 sm:text-4xl")}>
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cream-200/60">{body}</p>
      <p className="events-wordmark mt-5 text-lg tracking-[0.2em]">{code}</p>
      <Link href="/" className="mt-10 inline-block w-full">
        <Button variant="outline" className="h-12 w-full rounded-full border-[#e8dcc0]/30">
          {home}
        </Button>
      </Link>
    </motion.div>
  );
}

function fieldClass() {
  return "h-14 w-full rounded-2xl border border-cream-200/15 bg-black/40 px-4 text-base text-cream-50 outline-none transition placeholder:text-cream-200/30 focus:border-[#e8dcc0]/45 focus:ring-2 focus:ring-[#c4b48a]/20";
}

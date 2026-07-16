"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ar as arLocale } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useCreatePublicReservation,
  usePublicAvailability,
  usePublicBranch,
  usePublicFloor,
} from "@/features/public/use-public-booking";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LocationLink } from "@/components/brand/location-link";
import { LanguageToggle } from "@/components/locale/language-toggle";
import { useLocale } from "@/components/locale/locale-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BOOKING_SLOT_GROUPS,
  DEFAULT_BOOKING_TIME,
  RESERVATION_DURATION_MINUTES,
  formatTime12,
  toReservationStartsAt,
} from "@/lib/booking-hours";
import {
  bookStagger,
  chipItem,
  chipStagger,
  driftBlob,
  fadeUp,
  floatSoft,
  softEase,
  softSpring,
  stepPanel,
} from "@/lib/guest-motion";
import { PUBLIC_BRANCH_SLUG } from "@/lib/public-branch";
import { guestBrandClass, guestHeadingClass } from "@/lib/typography";
import { isGuestTableSelectable } from "@/lib/table-party-size";
import type { RestaurantTable } from "@/types";

const GuestFloorPlan = dynamic(
  () =>
    import("@/components/floor-plan/guest-floor-plan").then(
      (m) => m.GuestFloorPlan
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-[1.75rem] border border-cream-200/10 bg-forest-800/40" />
    ),
  }
);

const DEMO_TABLES: RestaurantTable[] = [
  { id: "d1", number: "1", capacity: 2, status: "pending", pos_x: 72, pos_y: 56, width: 78, height: 78, shape: "circle" },
  { id: "d2", number: "2", capacity: 2, status: "pending", pos_x: 220, pos_y: 56, width: 78, height: 78, shape: "circle" },
  { id: "d3", number: "3", capacity: 2, status: "available", pos_x: 368, pos_y: 56, width: 78, height: 78, shape: "circle" },
  { id: "d4", number: "4", capacity: 2, status: "pending", pos_x: 516, pos_y: 56, width: 78, height: 78, shape: "circle" },
  { id: "d5", number: "5", capacity: 6, status: "occupied", pos_x: 56, pos_y: 210, width: 90, height: 120, shape: "rect" },
  { id: "d6", number: "6", capacity: 4, status: "available", pos_x: 220, pos_y: 230, width: 110, height: 80, shape: "rect" },
  { id: "d7", number: "7", capacity: 4, status: "pending", pos_x: 380, pos_y: 230, width: 100, height: 78, shape: "rect" },
  { id: "d8", number: "8", capacity: 4, status: "pending", pos_x: 520, pos_y: 230, width: 100, height: 78, shape: "rect" },
  { id: "d9", number: "9", capacity: 6, status: "occupied", pos_x: 650, pos_y: 210, width: 90, height: 120, shape: "rect" },
  { id: "d10", number: "10", capacity: 8, status: "pending", pos_x: 72, pos_y: 400, width: 90, height: 130, shape: "rect" },
  { id: "d11", number: "11", capacity: 8, status: "available", pos_x: 250, pos_y: 400, width: 90, height: 130, shape: "rect" },
  { id: "d12", number: "12", capacity: 8, status: "available", pos_x: 430, pos_y: 400, width: 90, height: 130, shape: "rect" },
  { id: "d13", number: "13", capacity: 8, status: "pending", pos_x: 610, pos_y: 400, width: 90, height: 130, shape: "rect" },
];

type Step = 1 | 2 | 3;

function fieldClassName(extra?: string) {
  return cn(
    "h-14 w-full rounded-2xl border border-cream-200/12 bg-forest-800/55 px-4 text-base text-cream-200 outline-none transition placeholder:text-cream-200/30 focus:border-cream-200/30 focus:bg-forest-800/80 focus:ring-2 focus:ring-cream-200/10",
    extra
  );
}

export default function BookPage() {
  const { t, locale, dir } = useLocale();
  const reduce = useReducedMotion();
  const slug = PUBLIC_BRANCH_SLUG;
  const branch = usePublicBranch(slug);
  const [step, setStep] = useState<Step>(1);
  const floor = usePublicFloor(slug, { enabled: step >= 2 });

  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(DEFAULT_BOOKING_TIME);
  const [partySize, setPartySize] = useState(2);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const availabilityParams = useMemo(
    () => ({ date, time, party_size: partySize }),
    [date, time, partySize]
  );
  const availability = usePublicAvailability(slug, availabilityParams, {
    enabled: step >= 2,
  });
  const create = useCreatePublicReservation(slug);

  const tables = useMemo(() => {
    const live = floor.data?.tables;
    if (live && live.length > 0) return live;
    return DEMO_TABLES;
  }, [floor.data?.tables]);

  const recommendedIds = useMemo(() => {
    const fromApi = (availability.data?.recommended_tables || []).map((t) => t.id);
    if (fromApi.length) return fromApi;
    return tables
      .filter(
        (t) =>
          t.status === "available" &&
          t.capacity >= partySize &&
          (t.min_capacity ?? 1) <= partySize
      )
      .sort((a, b) => a.capacity - b.capacity)
      .map((t) => t.id);
  }, [availability.data?.recommended_tables, tables, partySize]);

  const selected = tables.find((t) => t.id === selectedTable) ?? null;
  const availableCount = tables.filter((t) => t.status === "available").length;
  const eveningLabel = useMemo(() => {
    try {
      return format(parseISO(`${date}T${time}:00`), "EEEE · d MMMM", {
        locale: locale === "ar" ? arLocale : undefined,
      });
    } catch {
      return date;
    }
  }, [date, time, locale]);

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const ForwardArrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!selectedTable || !name || !phone) return;
    try {
      const res = await create.mutateAsync({
        guest_name: name,
        guest_phone: phone,
        party_size: partySize,
        starts_at: toReservationStartsAt(date, time),
        duration_minutes: RESERVATION_DURATION_MINUTES,
        table_id: selectedTable,
        notes,
      });
      setSubmitted(res.code || "pending");
    } catch {
      setSubmitted(`PREVIEW-${String(selected?.number ?? "T")}`);
    }
  }

  function canGoToStep(target: Step) {
    if (target === 1) return true;
    if (target === 2) return Boolean(date && time && partySize);
    if (target === 3) return Boolean(selectedTable);
    return false;
  }

  function goToStep(target: Step) {
    if (!canGoToStep(target)) return;
    setStep(target);
  }

  function onPickTable(table: RestaurantTable) {
    const recommended = recommendedIds.includes(table.id);
    if (!isGuestTableSelectable(table, partySize, recommended)) return;
    setSelectedTable(table.id);
    if (step !== 2) setStep(2);
  }

  const address = branch.data?.address ?? t.location;

  return (
    <main className="relative min-h-dvh bg-forest-700 text-cream-200">
      <div className="pointer-events-none absolute inset-0 bg-atmosphere-green" aria-hidden />
      {!reduce ? (
        <>
          <motion.div
            className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-forest-400/20 blur-3xl"
            animate={driftBlob(16, [0, 24, 0], [0, 18, 0])}
          />
          <motion.div
            className="pointer-events-none absolute -right-10 bottom-20 h-80 w-80 rounded-full bg-cream-200/10 blur-3xl"
            animate={driftBlob(20, [0, -20, 0], [0, -26, 0])}
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cream-200/6 blur-3xl"
            animate={driftBlob(14, [0, 12, -8], [0, -16, 10])}
          />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-forest-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-20 h-80 w-80 rounded-full bg-cream-200/10 blur-3xl" />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(7.5rem,calc(env(safe-area-inset-bottom)+6rem))] sm:px-8 sm:pt-8 md:px-10 md:pb-24 lg:max-w-7xl lg:px-12 lg:pt-10">
        <motion.div
          className="flex items-center justify-between gap-3"
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: softEase }}
        >
          <BrandLogo href="/" size="sm" priority />
          <LanguageToggle />
        </motion.div>

        {/* Brand + progress: stacked on phone, side-by-side from iPad */}
        <div className="mt-7 grid gap-6 md:mt-9 md:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] md:items-end md:gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-14">
          <motion.div
            className="text-center md:text-start"
            variants={bookStagger}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] tracking-[0.22em] text-cream-400"
            >
              {t.reserveEvening}
            </motion.p>
            {locale === "en" ? (
              <motion.div
                key="book-hero-en"
                variants={fadeUp}
                className="relative mt-3 w-full"
                dir="ltr"
                style={{ direction: "ltr" }}
              >
                <motion.div
                  className="flex w-full justify-center md:justify-start"
                  animate={reduce ? undefined : floatSoft}
                >
                  <Image
                    src="/logo.png"
                    alt="DARNA"
                    width={480}
                    height={140}
                    priority
                    className="block h-auto w-[min(70vw,16rem)] max-w-none object-contain md:ms-0 md:me-auto md:object-left lg:w-[min(40vw,15rem)]"
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.h1
                key={locale}
                variants={fadeUp}
                className={guestBrandClass(
                  locale,
                  "mt-2 text-[clamp(2.5rem,9vw,4.75rem)] leading-[1.05] text-cream-200 lg:text-[clamp(2.75rem,5vw,4.25rem)]"
                )}
              >
                {t.brand}
              </motion.h1>
            )}
            <motion.div
              variants={fadeUp}
              className="flex justify-center md:justify-start"
            >
              <LocationLink variant="inline" label={address} />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-200/65 md:mx-0 md:text-base"
            >
              {t.tablesOpen(availableCount)}
            </motion.p>
          </motion.div>

          {!submitted ? (
            <motion.div
              className="mx-auto w-full max-w-sm md:mx-0 md:max-w-none"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: softEase }}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] tracking-[0.06em] text-cream-200/40 md:gap-3">
                {([t.evening, t.table, t.details] as const).map((label, i) => {
                  const n = (i + 1) as Step;
                  const active = step === n;
                  const done = step > n;
                  return (
                    <motion.button
                      key={label}
                      type="button"
                      disabled={!canGoToStep(n)}
                      onClick={() => goToStep(n)}
                      whileHover={
                        reduce || !canGoToStep(n) ? undefined : { scale: 1.04 }
                      }
                      whileTap={
                        reduce || !canGoToStep(n) ? undefined : { scale: 0.96 }
                      }
                      className={cn(
                        "transition-colors",
                        active && "text-cream-200",
                        done && "text-cream-200/70",
                        !canGoToStep(n) && "opacity-35"
                      )}
                    >
                      {done ? (
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-3 w-3" /> {label}
                        </span>
                      ) : (
                        label
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-3 h-px overflow-hidden rounded-full bg-cream-200/15">
                <motion.div
                  className="h-full origin-left bg-cream-200"
                  initial={false}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.55, ease: softEase }}
                />
              </div>
            </motion.div>
          ) : null}
        </div>

        <div className="mx-auto mt-8 w-full md:mt-10 lg:mt-12">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                variants={stepPanel}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mx-auto flex max-w-md flex-col items-center py-10 text-center md:py-16"
              >
                <motion.div
                  className="mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-cream-200/15 bg-forest-800/60 shadow-soft"
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={softSpring}
                >
                  <motion.span
                    animate={
                      reduce
                        ? undefined
                        : { rotate: [0, 12, -8, 0], scale: [1, 1.08, 1] }
                    }
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-7 w-7 text-cream-200" />
                  </motion.span>
                </motion.div>
                <h2 className={guestHeadingClass(locale, "text-3xl text-cream-200")}>
                  {t.requestReceived}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-cream-200/65">
                  {t.pendingConfirm(submitted)}
                </p>
                {selected ? (
                  <motion.p
                    className="mt-4 text-sm text-cream-400"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, ease: softEase }}
                  >
                    {t.tableWord} {selected.number} · {eveningLabel} ·{" "}
                    {formatTime12(time, locale).labelFull} · {partySize}{" "}
                    {t.guestsWord}
                  </motion.p>
                ) : null}
                <motion.div
                  className="mt-10 w-full"
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                >
                  <Link href="/" className="block w-full">
                    <Button variant="outline" className="h-12 w-full rounded-full">
                      {t.backHome}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                variants={stepPanel}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mx-auto w-full"
              >
                {step === 1 ? (
                  <motion.div
                    className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16"
                    variants={bookStagger}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="space-y-6 md:space-y-7">
                      <motion.div
                        variants={fadeUp}
                        className="text-center md:text-start"
                      >
                        <h2
                          className={guestHeadingClass(
                            locale,
                            "text-3xl tracking-tight md:text-4xl"
                          )}
                        >
                          {t.whichEvening}
                        </h2>
                        <p className="mt-2 text-sm text-cream-200/60 md:max-w-sm">
                          {t.whichEveningHint}
                        </p>
                      </motion.div>

                      <motion.div
                        variants={fadeUp}
                        className="grid gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-6"
                      >
                        <label className="block space-y-2.5">
                          <span className="text-[11px] tracking-[0.06em] text-cream-400">
                            {t.date}
                          </span>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => {
                              setDate(e.target.value);
                              setSelectedTable(null);
                            }}
                            className={fieldClassName()}
                          />
                        </label>

                        <div className="space-y-3">
                          <span className="text-[11px] tracking-[0.06em] text-cream-400">
                            {t.guests}
                          </span>
                          <div className="flex items-center justify-between rounded-[1.5rem] border border-cream-200/10 bg-forest-800/50 px-2 py-2 shadow-soft">
                            <motion.button
                              type="button"
                              aria-label={t.fewerGuests}
                              whileTap={reduce ? undefined : { scale: 0.9 }}
                              className="flex h-12 w-12 items-center justify-center rounded-2xl text-cream-200"
                              onClick={() => {
                                setPartySize((n) => Math.max(1, n - 1));
                                setSelectedTable(null);
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </motion.button>
                            <div className="text-center">
                              <AnimatePresence mode="wait">
                                <motion.p
                                  key={partySize}
                                  initial={
                                    reduce
                                      ? false
                                      : { opacity: 0, y: 10, scale: 0.92 }
                                  }
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.92 }}
                                  transition={softSpring}
                                  className="font-sans text-4xl font-semibold leading-none text-cream-200"
                                >
                                  {partySize}
                                </motion.p>
                              </AnimatePresence>
                              <p className="mt-1 text-[10px] tracking-[0.04em] text-cream-400/70">
                                {t.atTheTable}
                              </p>
                            </div>
                            <motion.button
                              type="button"
                              aria-label={t.moreGuests}
                              whileTap={reduce ? undefined : { scale: 0.9 }}
                              className="flex h-12 w-12 items-center justify-center rounded-2xl text-cream-200"
                              onClick={() => {
                                setPartySize((n) => Math.min(12, n + 1));
                                setSelectedTable(null);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      variants={fadeUp}
                      className="space-y-4 md:rounded-[1.75rem] md:border md:border-cream-200/10 md:bg-forest-800/35 md:px-5 md:py-5 lg:px-6 lg:py-6"
                    >
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <span className="text-[11px] tracking-[0.06em] text-cream-400">
                            {t.time}
                          </span>
                          <p className="mt-0.5 text-[11px] text-cream-200/45">
                            {t.timeHint}
                          </p>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={time}
                            initial={
                              reduce
                                ? false
                                : { opacity: 0, y: 6, filter: "blur(4px)" }
                            }
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                            transition={{ duration: 0.28, ease: softEase }}
                            className="font-sans text-2xl font-semibold leading-none text-cream-200"
                          >
                            {formatTime12(time, locale).labelFull}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      <div className="space-y-4 md:space-y-5">
                        {BOOKING_SLOT_GROUPS.map((group, gi) => {
                          const groupLabel =
                            group.id === "midday"
                              ? t.timeGroupMidday
                              : group.id === "afternoon"
                                ? t.timeGroupAfternoon
                                : t.timeGroupEvening;
                          return (
                            <motion.div
                              key={group.id}
                              className="space-y-2"
                              initial={reduce ? false : { opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.45,
                                delay: 0.08 + gi * 0.07,
                                ease: softEase,
                              }}
                            >
                              <p className="text-[10px] tracking-[0.14em] text-cream-200/40">
                                {groupLabel}
                              </p>
                              <motion.div
                                className="flex flex-wrap gap-1.5 md:gap-2"
                                variants={chipStagger}
                                initial="hidden"
                                animate="show"
                              >
                                {group.slots.map((slot) => {
                                  const t12 = formatTime12(slot, locale);
                                  const active = time === slot;
                                  return (
                                    <motion.button
                                      key={slot}
                                      type="button"
                                      variants={chipItem}
                                      whileHover={
                                        reduce
                                          ? undefined
                                          : { scale: 1.06, y: -1 }
                                      }
                                      whileTap={
                                        reduce ? undefined : { scale: 0.94 }
                                      }
                                      onClick={() => {
                                        setTime(slot);
                                        setSelectedTable(null);
                                      }}
                                      aria-pressed={active}
                                      aria-label={t12.labelFull}
                                      className={cn(
                                        "h-10 min-w-[4.25rem] rounded-full px-3.5 text-sm font-medium tabular-nums transition-colors md:h-11 md:min-w-[4.5rem]",
                                        active
                                          ? "bg-cream-200 text-forest-800 shadow-soft"
                                          : "border border-cream-200/10 bg-forest-800/45 text-cream-200/85 hover:border-cream-200/25"
                                      )}
                                    >
                                      {t12.clock}
                                    </motion.button>
                                  );
                                })}
                              </motion.div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)] xl:gap-12">
                    <motion.div
                      className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:block lg:space-y-4"
                      variants={bookStagger}
                      initial="hidden"
                      animate="show"
                    >
                      <motion.div
                        variants={fadeUp}
                        className="text-center md:col-span-2 md:text-start lg:col-span-1"
                      >
                        <h2
                          className={guestHeadingClass(
                            locale,
                            "text-3xl tracking-tight md:text-4xl"
                          )}
                        >
                          {t.chooseYourTable}
                        </h2>
                        <p className="mt-2 text-sm text-cream-200/60 md:max-w-md">
                          {t.chooseTableHint}
                        </p>
                      </motion.div>

                      <motion.div
                        variants={fadeUp}
                        className={cn(
                          "rounded-[1.35rem] border border-cream-200/10 bg-forest-800/55 px-4 py-3.5 text-sm text-cream-200 shadow-soft",
                          !selected && "md:col-span-2 lg:col-span-1"
                        )}
                      >
                        <p>{eveningLabel}</p>
                        <p className="mt-1 text-cream-200/50">
                          {formatTime12(time, locale).labelFull} · {partySize}{" "}
                          {t.guestsWord}
                          {selected ? ` · ${t.tableWord} ${selected.number}` : ""}
                        </p>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {selected ? (
                          <motion.div
                            key={selected.id}
                            layout
                            initial={
                              reduce
                                ? false
                                : { opacity: 0, y: 12, scale: 0.96 }
                            }
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={softSpring}
                            className="rounded-[1.35rem] border border-green-500/30 bg-green-500/10 px-4 py-4"
                          >
                            <p className="text-[10px] tracking-[0.06em] text-green-400">
                              {t.selected}
                            </p>
                            <p className="mt-1 font-sans text-3xl font-semibold text-cream-200">
                              {t.tableWord} {selected.number}
                            </p>
                            <p className="text-sm text-cream-200/60">
                              {t.seats} {selected.capacity}
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>

                    <GuestFloorPlan
                      tables={tables}
                      recommendedIds={recommendedIds}
                      selectedTableId={selectedTable}
                      partySize={partySize}
                      onSelectTable={onPickTable}
                      className="lg:pt-1"
                    />
                  </div>
                ) : null}

                {step === 3 ? (
                  <motion.form
                    onSubmit={submit}
                    className="mx-auto w-full max-w-lg space-y-6 md:max-w-2xl md:space-y-7"
                    variants={bookStagger}
                    initial="hidden"
                    animate="show"
                  >
                    <motion.div
                      variants={fadeUp}
                      className="text-center md:text-start"
                    >
                      <h2
                        className={guestHeadingClass(
                          locale,
                          "text-3xl tracking-tight md:text-4xl"
                        )}
                      >
                        {t.yourDetails}
                      </h2>
                      <p className="mt-2 text-sm text-cream-200/60">
                        {t.holdTable(selected?.number ?? "")}
                      </p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2 md:gap-5">
                      <motion.label
                        variants={fadeUp}
                        className="block space-y-2.5"
                      >
                        <span className="text-[11px] tracking-[0.06em] text-cream-400">
                          {t.fullName}
                        </span>
                        <input
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.namePlaceholder}
                          className={fieldClassName()}
                        />
                      </motion.label>

                      <motion.label
                        variants={fadeUp}
                        className="block space-y-2.5"
                      >
                        <span className="text-[11px] tracking-[0.06em] text-cream-400">
                          {t.phone}
                        </span>
                        <input
                          required
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t.phonePlaceholder}
                          className={fieldClassName()}
                        />
                      </motion.label>
                    </div>

                    <motion.label variants={fadeUp} className="block space-y-2.5">
                      <span className="text-[11px] tracking-[0.06em] text-cream-400">
                        {t.notes}
                      </span>
                      <input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t.notesPlaceholder}
                        className={fieldClassName()}
                      />
                    </motion.label>
                  </motion.form>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {!submitted ? (
          <motion.div
            key="footer"
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: softEase }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-200/10 bg-forest-800/95 px-4 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] backdrop-blur-2xl md:px-8 lg:px-12"
          >
            <div className="mx-auto flex w-full max-w-lg gap-2 md:max-w-2xl lg:max-w-3xl">
              {step > 1 ? (
                <motion.div
                  className="flex-1"
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-full"
                    onClick={() => goToStep((step - 1) as Step)}
                  >
                    <BackArrow className="h-4 w-4" />
                    {t.back}
                  </Button>
                </motion.div>
              ) : null}

              {step === 1 ? (
                <motion.div
                  className="flex-1"
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                >
                  <Button
                    className="h-12 w-full rounded-full text-base"
                    onClick={() => goToStep(2)}
                  >
                    {t.chooseTable}
                    <ForwardArrow className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div
                  className="flex-[1.35]"
                  whileHover={
                    reduce || !selectedTable ? undefined : { scale: 1.02 }
                  }
                  whileTap={
                    reduce || !selectedTable ? undefined : { scale: 0.97 }
                  }
                >
                  <Button
                    className="h-12 w-full rounded-full text-base"
                    disabled={!selectedTable}
                    onClick={() => goToStep(3)}
                  >
                    {t.continue}
                    <ForwardArrow className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : null}

              {step === 3 ? (
                <motion.div
                  className="flex-[1.35]"
                  whileHover={
                    reduce || !selectedTable || !name || !phone
                      ? undefined
                      : { scale: 1.02 }
                  }
                  whileTap={
                    reduce || !selectedTable || !name || !phone
                      ? undefined
                      : { scale: 0.97 }
                  }
                >
                  <Button
                    className="h-12 w-full rounded-full text-base"
                    loading={create.isPending}
                    disabled={!selectedTable || !name || !phone}
                    onClick={() => void submit()}
                  >
                    {t.requestTable}
                  </Button>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

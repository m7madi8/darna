"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Gem,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LocationLink } from "@/components/brand/location-link";
import { LanguageToggle } from "@/components/locale/language-toggle";
import { useLocale } from "@/components/locale/locale-provider";
import { Button } from "@/components/ui/button";
import {
  BOOKING_SLOT_GROUPS,
  DEFAULT_BOOKING_TIME,
  formatTime12,
  toReservationStartsAt,
} from "@/lib/booking-hours";
import { useCreatePublicReservation } from "@/features/public/use-public-booking";
import { driftBlob, softEase, softSpring } from "@/lib/guest-motion";
import {
  OCCASIONS,
  composeReservationNotes,
  occasionLabel,
  type OccasionId,
  type OccasionOption,
} from "@/lib/occasions";
import { PUBLIC_BRANCH_SLUG } from "@/lib/public-branch";
import { guestHeadingClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

const VIP_DURATION_MINUTES = 180;
type Step = 1 | 2 | 3;

const stepEase = softEase;

const panel = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 20 : -20,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: stepEase },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -16 : 16,
    transition: { duration: 0.3, ease: stepEase },
  }),
};

export default function VipPage() {
  const { t, locale, dir } = useLocale();
  const reduce = useReducedMotion();
  const create = useCreatePublicReservation(PUBLIC_BRANCH_SLUG);
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const ForwardArrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [step, setStep] = useState<Step>(1);
  const [slideDir, setSlideDir] = useState(1);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(DEFAULT_BOOKING_TIME);
  const [partySize, setPartySize] = useState(6);
  const [occasion, setOccasion] = useState<OccasionId>("wedding");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const eveningSlots = useMemo(
    () => BOOKING_SLOT_GROUPS.find((g) => g.id === "evening")?.slots ?? [],
    []
  );

  const vipOccasions = useMemo(
    () =>
      OCCASIONS.filter((o) => o.id !== "none").sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      ),
    []
  );

  function go(next: Step) {
    setSlideDir(next > step ? 1 : -1);
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function scrollToJourney() {
    document
      .getElementById("vip-journey")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!name || !phone) return;
    try {
      const res = await create.mutateAsync({
        guest_name: name,
        guest_phone: phone,
        party_size: partySize,
        starts_at: toReservationStartsAt(date, time),
        duration_minutes: VIP_DURATION_MINUTES,
        is_vip: true,
        notes: composeReservationNotes({
          occasion,
          locale,
          notes,
          vip: true,
        }),
      });
      setSubmitted(res.code || "VIP");
    } catch {
      setSubmitted(`VIP-${format(new Date(), "HHmm")}`);
    }
  }

  return (
    <main className="relative min-h-dvh bg-[#050908] text-cream-100">
      <Atmosphere reduce={Boolean(reduce)} />

      <motion.header
        className="relative z-30 mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: stepEase }}
      >
        <BrandLogo href="/" size="sm" priority />
        <div className="flex items-center gap-1">
          <LocationLink variant="icon" />
          <LanguageToggle />
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {submitted ? (
          <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))]">
            <SuccessView
              key="done"
              code={submitted}
              locale={locale}
              reduce={Boolean(reduce)}
              title={t.vipReceived}
              body={t.vipPending(submitted)}
              home={t.backHome}
            />
          </div>
        ) : (
          <motion.div
            key="journey"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero — media clipped in its own layer; content never clipped */}
            <section className="relative isolate w-full">
              <div className="absolute inset-0 overflow-hidden" aria-hidden>
                <Image
                  src="/hero-dining.jpg"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-[center_30%] scale-105"
                />
                <div className="absolute inset-0 bg-[#050908]/55" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(196,180,138,0.16),transparent_55%)]" />
                <div
                  className="absolute inset-x-0 bottom-0 h-[55%] sm:h-[50%]"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(5,9,8,0) 0%, rgba(5,9,8,0.25) 28%, rgba(5,9,8,0.65) 58%, rgba(5,9,8,0.92) 82%, #050908 100%)",
                  }}
                />
                {!reduce ? (
                  <motion.div
                    className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-cream-100/8 to-transparent"
                    animate={{ x: ["-20%", "180%"] }}
                    transition={{
                      duration: 9.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 2.5,
                    }}
                  />
                ) : null}
              </div>

              <div className="relative z-10 mx-auto flex min-h-[min(78dvh,42rem)] w-full max-w-4xl flex-col items-center justify-center px-5 pb-24 pt-20 text-center sm:pb-28 sm:pt-24">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: stepEase }}
                >
                  <Image
                    src="/logo.png"
                    alt={locale === "ar" ? t.brand : t.brandLatin}
                    width={720}
                    height={220}
                    priority
                    className="mx-auto h-auto w-[min(78vw,22rem)] object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
                  />
                </motion.div>

                <motion.div
                  className="relative mt-8 h-px w-40 overflow-hidden sm:w-56"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.35, ease: stepEase }}
                  aria-hidden
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-[#d4c4a0] to-transparent" />
                  {!reduce ? (
                    <motion.div
                      className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                      animate={{ x: ["-100%", "280%"] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 1.8,
                      }}
                    />
                  ) : null}
                </motion.div>

                <VipWordmark
                  label={t.vipTitle}
                  reduce={Boolean(reduce)}
                  locale={locale}
                />

                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.55, ease: stepEase }}
                  className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-cream-100/70 sm:text-lg"
                >
                  {t.vipTagline}
                </motion.p>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.65, ease: stepEase }}
                  className="mt-10 flex flex-col items-center gap-5"
                >
                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.03 }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    transition={softSpring}
                  >
                    <Button
                      type="button"
                      onClick={scrollToJourney}
                      className="h-14 rounded-full bg-gradient-to-r from-[#e8dcc0] via-[#f5efd8] to-[#c9b896] px-9 text-base font-medium text-[#1a1810] shadow-[0_12px_40px_rgba(212,196,160,0.28)] hover:from-[#f0e6d0] hover:to-[#d4c4a0]"
                    >
                      {t.reserveEvening}
                      <ForwardArrow className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <p className="max-w-xs text-[11px] leading-relaxed tracking-wide text-cream-200/35">
                    {t.perkTable} · {t.perkHost}
                  </p>
                </motion.div>
              </div>
            </section>

            <div
              id="vip-journey"
              className="relative z-10 mx-auto w-full max-w-2xl scroll-mt-8 bg-transparent px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-4 sm:max-w-3xl sm:px-8 sm:pb-20 sm:pt-6"
            >
              {/* Progress */}
              <div className="mx-auto max-w-md px-1">
                <div className="flex items-center justify-between gap-3 text-[11px] leading-none tracking-[0.12em] text-cream-200/40">
                  {[t.occasionTitle, t.evening, t.details].map((label, i) => {
                    const n = (i + 1) as Step;
                    const active = step === n;
                    const done = step > n;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          if (n < step) go(n);
                        }}
                        className={cn(
                          "py-1 transition",
                          active && "text-cream-200",
                          done && "text-cream-200/70"
                        )}
                      >
                        {done ? (
                          <span className="inline-flex items-center gap-1">
                            <Check className="h-3 w-3 shrink-0" />
                            <span>{label}</span>
                          </span>
                        ) : (
                          label
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 h-px bg-gradient-to-r from-transparent via-cream-200/20 to-transparent">
                  <motion.div
                    className="h-full origin-left bg-gradient-to-r from-transparent via-[#e8dcc0] to-transparent"
                    initial={false}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.55, ease: stepEase }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="relative mt-8 min-h-[18rem]">
                <AnimatePresence mode="wait" custom={slideDir}>
                  {step === 1 ? (
                    <motion.section
                      key="s1"
                      custom={slideDir}
                      variants={panel}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="space-y-1.5 text-center sm:text-start">
                        <h2
                          className={guestHeadingClass(
                            locale,
                            "text-2xl leading-[1.35] text-cream-100 sm:text-3xl"
                          )}
                        >
                          {t.occasionTitle}
                        </h2>
                        <p className="text-sm leading-relaxed text-cream-200/50">
                          {t.occasionHint}
                        </p>
                      </div>

                      <OccasionPicker
                        occasions={vipOccasions}
                        value={occasion}
                        onChange={setOccasion}
                        locale={locale}
                        reduce={Boolean(reduce)}
                      />

                      <StepNav
                        onBack={null}
                        onNext={() => go(2)}
                        nextLabel={t.evening}
                        Forward={ForwardArrow}
                        reduce={Boolean(reduce)}
                      />
                    </motion.section>
                  ) : null}

                  {step === 2 ? (
                    <motion.section
                      key="s2"
                      custom={slideDir}
                      variants={panel}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="space-y-1.5 text-center sm:text-start">
                        <h2
                          className={guestHeadingClass(
                            locale,
                            "text-2xl leading-[1.35] text-cream-100 sm:text-3xl"
                          )}
                        >
                          {t.whichEvening}
                        </h2>
                        <p className="text-sm leading-relaxed text-cream-200/50">
                          {t.vipDuration}
                        </p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block space-y-2">
                          <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                            {t.date}
                          </span>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={fieldClass()}
                          />
                        </label>

                        <div className="space-y-2">
                          <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                            {t.guests}
                          </span>
                          <div className="flex h-14 items-center justify-between rounded-2xl border border-cream-200/15 bg-black/30 px-2">
                            <button
                              type="button"
                              aria-label={t.fewerGuests}
                              className="flex h-11 w-11 items-center justify-center rounded-xl text-cream-200"
                              onClick={() =>
                                setPartySize((n) => Math.max(2, n - 1))
                              }
                            >
                              −
                            </button>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={partySize}
                                initial={
                                  reduce ? false : { opacity: 0, y: 8 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="text-center"
                              >
                                <p className="text-2xl font-semibold text-cream-50">
                                  {partySize}
                                </p>
                                <p className="text-[10px] text-cream-200/45">
                                  {t.guestsWord}
                                </p>
                              </motion.div>
                            </AnimatePresence>
                            <button
                              type="button"
                              aria-label={t.moreGuests}
                              className="flex h-11 w-11 items-center justify-center rounded-xl text-cream-200"
                              onClick={() =>
                                setPartySize((n) => Math.min(40, n + 1))
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-end justify-between">
                          <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                            {t.time}
                          </span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={time}
                              initial={
                                reduce
                                  ? false
                                  : { opacity: 0, y: 6, filter: "blur(4px)" }
                              }
                              animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                              }}
                              exit={{ opacity: 0, y: -6 }}
                              className="text-xl font-semibold text-cream-50"
                            >
                              {formatTime12(time, locale).labelFull}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {eveningSlots.map((slot) => {
                            const active = time === slot;
                            return (
                              <motion.button
                                key={slot}
                                type="button"
                                whileTap={
                                  reduce ? undefined : { scale: 0.94 }
                                }
                                onClick={() => setTime(slot)}
                                className={cn(
                                  "h-10 min-w-[4.25rem] rounded-full px-3.5 text-sm font-medium tabular-nums transition",
                                  active
                                    ? "bg-cream-200 text-forest-900"
                                    : "border border-cream-200/15 bg-black/25 text-cream-200/80 hover:border-cream-200/35"
                                )}
                              >
                                {formatTime12(slot, locale).clock}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <StepNav
                        onBack={() => go(1)}
                        onNext={() => go(3)}
                        backLabel={t.back}
                        nextLabel={t.continue}
                        Back={BackArrow}
                        Forward={ForwardArrow}
                        reduce={Boolean(reduce)}
                      />
                    </motion.section>
                  ) : null}

                  {step === 3 ? (
                    <motion.section
                      key="s3"
                      custom={slideDir}
                      variants={panel}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="space-y-1.5 text-center sm:text-start">
                        <h2
                          className={guestHeadingClass(
                            locale,
                            "text-2xl leading-[1.35] text-cream-100 sm:text-3xl"
                          )}
                        >
                          {t.vipRequestTitle}
                        </h2>
                        <p className="text-sm leading-relaxed text-cream-200/50">
                          {t.vipRequestHint}
                        </p>
                      </div>

                      {/* Live summary */}
                      <motion.div
                        layout
                        className="rounded-[1.35rem] border border-cream-200/15 bg-gradient-to-br from-cream-200/10 to-transparent px-4 py-4"
                      >
                        <p className="text-[11px] tracking-[0.16em] text-cream-300/60">
                          VIP · {occasionLabel(occasion, locale)}
                        </p>
                        <p className="mt-2 text-sm text-cream-200/80">
                          {date} · {formatTime12(time, locale).labelFull} ·{" "}
                          {partySize} {t.guestsWord}
                        </p>
                      </motion.div>

                      <form
                        className="space-y-5"
                        onSubmit={(e) => void submit(e)}
                      >
                        <div className="grid gap-5 sm:grid-cols-2">
                          <label className="block space-y-2">
                            <span className="text-[11px] tracking-[0.14em] text-cream-300/70">
                              {t.fullName}
                            </span>
                            <input
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
                              required
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={t.phonePlaceholder}
                              className={fieldClass()}
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
                            className={cn(
                              fieldClass(),
                              "h-auto resize-none py-3"
                            )}
                          />
                        </label>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-14 flex-1 rounded-full"
                            onClick={() => go(2)}
                          >
                            <BackArrow className="h-4 w-4" />
                            {t.back}
                          </Button>
                          <motion.div
                            className="flex-[1.4]"
                            whileHover={
                              reduce ? undefined : { scale: 1.015 }
                            }
                            whileTap={reduce ? undefined : { scale: 0.98 }}
                            transition={softSpring}
                          >
                            <Button
                              type="submit"
                              loading={create.isPending}
                              className="h-14 w-full rounded-full bg-cream-200 text-base text-forest-900 hover:bg-cream-100"
                            >
                              <Crown className="h-4 w-4" />
                              {t.vipSubmit}
                            </Button>
                          </motion.div>
                        </div>
                        <p className="text-center text-[11px] text-cream-200/40">
                          {t.vipDisclaimer}
                        </p>
                      </form>
                    </motion.section>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  href="/reservation"
                  className="inline-flex items-center gap-2 text-sm text-cream-200/40 transition hover:text-cream-200"
                >
                  <BackArrow className="h-4 w-4" />
                  {t.vipBackRegular}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function VipWordmark({
  label,
  reduce,
  locale,
}: {
  label: string;
  reduce: boolean;
  locale: "ar" | "en";
}) {
  const caption = locale === "ar" ? "تجربة خاصة" : "Private experience";

  return (
    <h1
      className="relative mt-8 w-full max-w-[min(100%,22rem)] select-none px-3 sm:max-w-md"
      dir="ltr"
      lang="en"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4c4a0]/[0.1] blur-3xl"
        aria-hidden
      />

      <motion.div
        className="relative flex w-full flex-col items-center"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05, delay: 0.22, ease: stepEase }}
      >
        <div className="mb-4 flex items-center gap-3" aria-hidden>
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4c4a0]/55 sm:w-14" />
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[#e8dcc0]/30" />
            <Gem className="relative h-3 w-3 text-[#e8dcc0]" strokeWidth={1.5} />
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4c4a0]/55 sm:w-14" />
        </div>

        <motion.span
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease: stepEase }}
          className="vip-wordmark text-center text-[clamp(3rem,14vw,5.75rem)]"
        >
          {label}
        </motion.span>

        <div className="mt-4 flex flex-col items-center gap-2.5" aria-hidden>
          <div className="flex items-center gap-2.5">
            <span className="h-px w-14 bg-gradient-to-r from-transparent via-[#d4c4a0]/50 to-transparent sm:w-20" />
            <span className="text-[7px] text-[#e8dcc0]/70">◆</span>
            <span className="h-px w-14 bg-gradient-to-r from-transparent via-[#d4c4a0]/50 to-transparent sm:w-20" />
          </div>
          <p
            className={cn(
              "text-[10px] leading-normal text-[#e8dcc0]/55 sm:text-[11px]",
              locale === "ar"
                ? "aref-ruqaa-regular tracking-[0.22em]"
                : "vip-caption"
            )}
          >
            {caption}
          </p>
        </div>
      </motion.div>
    </h1>
  );
}

function OccasionPicker({
  occasions,
  value,
  onChange,
  locale,
  reduce,
}: {
  occasions: OccasionOption[];
  value: OccasionId;
  onChange: (id: OccasionId) => void;
  locale: "ar" | "en";
  reduce: boolean;
}) {
  const selected = occasions.find((o) => o.id === value) ?? occasions[0];

  return (
    <div className="space-y-5">
      {/* Selected stage — one rich preview instead of repeating hints */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: stepEase }}
          className="relative px-1 py-4 text-center"
        >
          <div
            className="pointer-events-none absolute inset-x-8 top-1/2 h-24 -translate-y-1/2 rounded-full bg-[#d4c4a0]/[0.07] blur-2xl"
            aria-hidden
          />
          <div className="relative mx-auto mb-4 flex h-10 w-10 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[#d4c4a0]/25" />
            <Gem className="relative h-4 w-4 text-[#e8dcc0]" />
          </div>
          <p
            className={guestHeadingClass(
              locale,
              "text-[1.65rem] leading-tight text-cream-50 sm:text-3xl"
            )}
          >
            {occasionLabel(selected.id, locale)}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-cream-200/55">
            {selected.hint[locale]}
          </p>
          <div
            className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#d4c4a0]/55 to-transparent"
            aria-hidden
          />
        </motion.div>
      </AnimatePresence>

      {/* Compact menu — names only, no stacked cards */}
      <div
        role="listbox"
        aria-label={locale === "ar" ? "نوع المناسبة" : "Occasion"}
        className="relative"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream-200/20 to-transparent"
          aria-hidden
        />
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-2 sm:grid-cols-3 sm:gap-x-4">
          {occasions.map((o, i) => {
            const active = value === o.id;
            return (
              <motion.button
                key={o.id}
                type="button"
                role="option"
                aria-selected={active}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.03 * i,
                  duration: 0.4,
                  ease: stepEase,
                }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                onClick={() => onChange(o.id)}
                className={cn(
                  "group relative flex min-h-[3rem] items-center justify-center px-2 py-2.5 text-center transition",
                  active
                    ? "text-[#f0e6d0]"
                    : "text-cream-200/45 hover:text-cream-200/75"
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="occasion-glow"
                    className="absolute inset-x-1 inset-y-1 rounded-xl bg-[#d4c4a0]/[0.09]"
                    transition={{ duration: 0.35, ease: stepEase }}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-[1] text-[13px] leading-snug tracking-wide sm:text-sm",
                    active &&
                      guestHeadingClass(locale, "text-[15px] sm:text-base")
                  )}
                >
                  {occasionLabel(o.id, locale)}
                </span>
                {active ? (
                  <motion.span
                    layoutId="occasion-underline"
                    className="absolute inset-x-5 bottom-1.5 h-px bg-gradient-to-r from-transparent via-[#e8dcc0]/70 to-transparent"
                    transition={{ duration: 0.35, ease: stepEase }}
                    aria-hidden
                  />
                ) : null}
              </motion.button>
            );
          })}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cream-200/20 to-transparent"
          aria-hidden
        />
      </div>
    </div>
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
            "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(212,196,160,0.12), transparent 50%), linear-gradient(180deg, #050908 0%, #0a1410 45%, #050908 100%)",
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
        <motion.div
          className="pointer-events-none fixed bottom-[8%] right-[4%] -z-10 h-72 w-72 rounded-full bg-[#c4b48a]/10 blur-3xl"
          animate={driftBlob(22, [0, -24, 0], [0, -18, 0])}
        />
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
      initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: stepEase }}
      className="mx-auto mt-20 max-w-md text-center"
    >
      <motion.div
        className="mx-auto mb-8 flex justify-center"
        animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
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
        className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-cream-200/30 bg-cream-200/10"
        initial={reduce ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: stepEase }}
      >
        <Gem className="h-7 w-7 text-cream-200" />
      </motion.div>
      <h1 className={guestHeadingClass(locale, "text-3xl text-cream-50 sm:text-4xl")}>
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cream-200/60">{body}</p>
      <p className="mt-4 font-brand text-sm tracking-[0.2em] text-cream-300/70">
        {code}
      </p>
      <Link href="/" className="mt-10 inline-block w-full">
        <Button variant="outline" className="h-12 w-full rounded-full">
          {home}
        </Button>
      </Link>
    </motion.div>
  );
}

function StepNav({
  onBack,
  onNext,
  backLabel,
  nextLabel,
  Back,
  Forward,
  reduce,
}: {
  onBack: (() => void) | null;
  onNext: () => void;
  backLabel?: string;
  nextLabel: string;
  Back?: typeof ArrowLeft;
  Forward: typeof ArrowRight;
  reduce: boolean;
}) {
  return (
    <div className="flex gap-2 pt-2">
      {onBack && Back && backLabel ? (
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 rounded-full"
          onClick={onBack}
        >
          <Back className="h-4 w-4" />
          {backLabel}
        </Button>
      ) : null}
      <motion.div
        className={onBack ? "flex-[1.35]" : "w-full"}
        whileHover={reduce ? undefined : { scale: 1.015 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={softSpring}
      >
        <Button
          type="button"
          className="h-12 w-full rounded-full bg-cream-200 text-forest-900 hover:bg-cream-100"
          onClick={onNext}
        >
          {nextLabel}
          <Forward className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}

function fieldClass() {
  return "h-14 w-full rounded-2xl border border-cream-200/15 bg-black/35 px-4 text-base text-cream-50 outline-none transition placeholder:text-cream-200/30 focus:border-cream-200/40 focus:ring-2 focus:ring-cream-200/15";
}

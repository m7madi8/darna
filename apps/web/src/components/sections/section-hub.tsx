"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LocationLink, VipLink } from "@/components/brand/location-link";
import { LanguageToggle } from "@/components/locale/language-toggle";
import { useLocale } from "@/components/locale/locale-provider";
import { Button } from "@/components/ui/button";
import {
  fadeUp,
  floatSoft,
  heroStagger,
  slideBrand,
  softEase,
  softSpring,
} from "@/lib/guest-motion";
import { guestBrandClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

export type SectionTheme = "restaurant" | "lounge";

type SectionHubProps = {
  theme: SectionTheme;
  title: string;
  tagline: string;
  venue: "restaurant" | "lounge";
  accent?: ReactNode;
};

const themes: Record<
  SectionTheme,
  {
    pageBg: string;
    imageClass: string;
    veil: string;
    topFade: string;
    bottomFade: string;
    bottomGradient: string;
    titleClass: string;
    taglineClass: string;
    backClass: string;
  }
> = {
  restaurant: {
    pageBg: "bg-forest-700",
    imageClass: "object-cover object-center",
    veil: "bg-forest-700/62",
    topFade: "bg-gradient-to-b from-forest-800/45 via-transparent to-transparent",
    bottomFade:
      "bg-gradient-to-t from-forest-800/85 via-forest-700/20 to-transparent",
    bottomGradient:
      "linear-gradient(to bottom, rgba(35,68,49,0) 0%, rgba(35,68,49,0.4) 40%, rgba(28,54,40,0.88) 78%, #1c3628 100%)",
    titleClass: "text-cream-200",
    taglineClass: "text-cream-200/75",
    backClass:
      "text-cream-200/55 hover:text-cream-200 focus-visible:ring-cream-200/40",
  },
  lounge: {
    pageBg: "bg-[#060d0a]",
    imageClass: "object-cover object-[center_62%] brightness-[0.72] contrast-[1.05]",
    veil: "bg-[#060d0a]/55",
    topFade:
      "bg-gradient-to-b from-[#060d0a]/70 via-transparent to-transparent",
    bottomFade:
      "bg-gradient-to-t from-[#060d0a]/95 via-[#0a1510]/40 to-transparent",
    bottomGradient:
      "linear-gradient(to bottom, rgba(6,13,10,0) 0%, rgba(6,13,10,0.45) 40%, rgba(6,13,10,0.92) 78%, #060d0a 100%)",
    titleClass: "text-[#f0e6d0]",
    taglineClass: "text-[#e8dcc0]/70",
    backClass:
      "text-[#e8dcc0]/50 hover:text-[#e8dcc0] focus-visible:ring-[#c4b48a]/40",
  },
};

export function SectionHub({
  theme,
  title,
  tagline,
  venue,
  accent,
}: SectionHubProps) {
  const { t, dir, locale } = useLocale();
  const CtaArrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const isEnglish = locale === "en";
  const reduce = useReducedMotion();
  const look = themes[theme];

  const bookHref = `/reservation?venue=${venue}`;
  const vipHref = `/vip?venue=${venue}`;

  return (
    <div className={cn("relative min-h-dvh overflow-x-hidden", look.pageBg)}>
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute inset-[-6%]"
          initial={reduce ? false : { scale: 1.05, opacity: 0.8 }}
          animate={
            reduce
              ? { scale: 1, opacity: 1 }
              : {
                  scale: theme === "lounge" ? [1.06, 1.02, 1.05] : [1.05, 1, 1.03],
                  opacity: 1,
                }
          }
          transition={
            reduce
              ? { duration: 0.01 }
              : {
                  scale: {
                    duration: theme === "lounge" ? 28 : 22,
                    times: [0, 0.55, 1],
                    ease: softEase,
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  opacity: { duration: theme === "lounge" ? 1.6 : 1.2, ease: softEase },
                }
          }
        >
          <Image
            src="/hero-dining.jpg"
            alt=""
            fill
            priority
            quality={70}
            sizes="100vw"
            className={look.imageClass}
          />
        </motion.div>

        <div className={cn("absolute inset-0", look.veil)} />
        {theme === "lounge" ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(196,180,138,0.14),transparent_58%)]" />
            {!reduce ? (
              <>
                <motion.div
                  className="absolute -left-16 top-[28%] h-56 w-56 rounded-full bg-[#c4b48a]/10 blur-3xl"
                  animate={{
                    x: [0, 24, 0],
                    y: [0, -18, 0],
                  }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "mirror",
                  }}
                />
                <motion.div
                  className="absolute -right-10 bottom-[22%] h-64 w-64 rounded-full bg-[#234431]/35 blur-3xl"
                  animate={{
                    x: [0, -20, 0],
                    y: [0, 22, 0],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "mirror",
                  }}
                />
              </>
            ) : null}
          </>
        ) : null}
        <div className={cn("absolute inset-0", look.topFade)} />
        <div className={cn("absolute inset-0", look.bottomFade)} />
        <div
          className="absolute inset-x-0 bottom-0 h-[42%]"
          style={{ background: look.bottomGradient }}
        />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-4">
        <BrandLogo size="sm" priority href="/" />
        <div className="flex items-center gap-1">
          <LocationLink variant="icon" />
          <LanguageToggle />
        </div>
      </header>

      <main className="relative z-20 mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-6xl flex-col justify-end px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:justify-center sm:px-6 sm:pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-0">
        <motion.div
          className="w-full"
          variants={heroStagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="mb-3">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-1 py-0.5 text-xs tracking-[0.1em] transition focus-visible:outline-none focus-visible:ring-2",
                look.backClass
              )}
            >
              <BackArrow className="h-3.5 w-3.5" aria-hidden />
              <span>{t.backHome}</span>
            </Link>
          </motion.div>

          {isEnglish ? (
            <motion.div
              variants={slideBrand}
              className="relative mb-4 w-full sm:mb-5"
              dir="ltr"
              style={{ direction: "ltr" }}
            >
              <motion.div
                className="flex w-full justify-start"
                animate={reduce ? undefined : floatSoft}
              >
                <Image
                  src="/logo.png"
                  alt="DARNA"
                  width={720}
                  height={220}
                  priority
                  className="ms-0 me-auto block h-auto w-[min(68vw,20rem)] max-w-none object-left object-contain drop-shadow-[0_14px_32px_rgba(0,0,0,0.35)] sm:w-[min(55vw,22rem)]"
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} className="mb-3 sm:mb-4">
              <motion.div animate={reduce ? undefined : floatSoft}>
                <BrandLogo
                  href={null}
                  size="hero"
                  showWordmark={false}
                  priority
                  className="drop-shadow-[0_14px_32px_rgba(0,0,0,0.35)]"
                />
              </motion.div>
            </motion.div>
          )}

          {accent}

          <motion.h1
            variants={fadeUp}
            className={guestBrandClass(
              locale,
              cn(
                "mt-2 text-[clamp(2.25rem,8svh,4.5rem)] leading-[1.05]",
                look.titleClass
              )
            )}
          >
            {title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={cn(
              "mt-3 max-w-md text-sm leading-relaxed sm:mt-4 sm:text-base",
              look.taglineClass
            )}
          >
            {tagline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-5 flex w-full flex-col gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          >
            <motion.div
              className="w-full sm:w-auto"
              whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={softSpring}
            >
              <Link href={bookHref} className="block w-full sm:w-auto">
                <Button
                  size="lg"
                  className={cn(
                    "w-full rounded-full px-8 sm:w-auto",
                    theme === "lounge" &&
                      "bg-[#ece9d4] text-[#12100c] hover:bg-[#f5f2e3]"
                  )}
                >
                  {t.reserveCta}
                  <motion.span
                    aria-hidden
                    animate={
                      reduce
                        ? undefined
                        : {
                            x: dir === "rtl" ? [0, -4, 0] : [0, 4, 0],
                          }
                    }
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-flex"
                  >
                    <CtaArrow className="h-4 w-4" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="w-full sm:w-auto"
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={softSpring}
            >
              <VipLink
                href={vipHref}
                className={
                  theme === "lounge"
                    ? "border-[#c4b48a]/35 bg-[#c4b48a]/10 text-[#e8dcc0] hover:border-[#c4b48a]/55 hover:bg-[#c4b48a]/16"
                    : undefined
                }
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

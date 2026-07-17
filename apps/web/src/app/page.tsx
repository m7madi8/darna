"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

export default function HomePage() {
  const { t, dir, locale } = useLocale();
  const CtaArrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const isEnglish = locale === "en";
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-forest-700">
      {/* Full-bleed scene — overlay covers every edge, no side cut-off */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute inset-[-6%]"
          initial={reduce ? false : { scale: 1.04, opacity: 0.85 }}
          animate={
            reduce
              ? { scale: 1, opacity: 1 }
              : {
                  scale: [1.04, 1, 1.02],
                  opacity: 1,
                }
          }
          transition={
            reduce
              ? { duration: 0.01 }
              : {
                  scale: {
                    duration: 22,
                    times: [0, 0.55, 1],
                    ease: softEase,
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  opacity: { duration: 1.2, ease: softEase },
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
            className="object-cover object-center"
          />
        </motion.div>

        {/* Even forest veil — same strength left & right */}
        <div className="absolute inset-0 bg-forest-700/62" />
        {/* Soft vertical depth only (no side-biased gradient) */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-800/45 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-800/85 via-forest-700/20 to-transparent" />
        {/* Soft bottom blend into page */}
        <div
          className="absolute inset-x-0 bottom-0 h-[42%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(35,68,49,0) 0%, rgba(35,68,49,0.4) 40%, rgba(28,54,40,0.88) 78%, #1c3628 100%)",
          }}
        />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-4">
        <BrandLogo size="sm" priority href={null} />
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
          {isEnglish ? (
            <motion.div
              key="hero-en"
              variants={slideBrand}
              className="relative mb-4 w-full sm:mb-6"
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
                  className="ms-0 me-auto block h-auto w-[min(72vw,22rem)] max-w-none object-left object-contain drop-shadow-[0_14px_32px_rgba(0,0,0,0.35)] sm:w-[min(60vw,24rem)]"
                />
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.div
                key="hero-ar-mark"
                variants={fadeUp}
                className="mb-3 sm:mb-5"
              >
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

              <motion.h1
                key="hero-ar-title"
                variants={fadeUp}
                className={guestBrandClass(
                  locale,
                  "text-[clamp(2.5rem,10svh,6rem)] leading-[1.05] text-cream-200"
                )}
              >
                {t.brand}
              </motion.h1>
            </>
          )}

          <div className="max-w-2xl">
            <motion.p
              key={`tag-${locale}`}
              variants={fadeUp}
              className="mt-3 max-w-md text-sm leading-relaxed text-cream-200/75 sm:mt-4 sm:text-base lg:text-lg"
            >
              {t.tagline}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-5 flex w-full flex-col gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:items-center sm:gap-3"
            >
              <motion.div
                className="w-full sm:w-auto"
                whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={softSpring}
              >
                <Link href="/reservation" className="block w-full sm:w-auto">
                  <Button size="lg" className="w-full rounded-full px-8 sm:w-auto">
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
                <VipLink />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

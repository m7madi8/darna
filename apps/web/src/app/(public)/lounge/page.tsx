"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Wine } from "lucide-react";
import { SectionHub } from "@/components/sections/section-hub";
import { useLocale } from "@/components/locale/locale-provider";
import { driftBlob, fadeUp } from "@/lib/guest-motion";

export default function LoungePage() {
  const { t } = useLocale();
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {!reduce ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="absolute -left-16 top-[28%] h-56 w-56 rounded-full bg-[#c4b48a]/10 blur-3xl"
            animate={driftBlob(14, [0, 24, 0], [0, -18, 0])}
          />
          <motion.div
            className="absolute -right-10 bottom-[22%] h-64 w-64 rounded-full bg-[#234431]/35 blur-3xl"
            animate={driftBlob(18, [0, -20, 0], [0, 22, 0])}
          />
        </div>
      ) : null}

      <SectionHub
        theme="lounge"
        venue="lounge"
        title={t.lounge}
        tagline={t.loungeTagline}
        accent={
          <motion.div
            variants={fadeUp}
            className="mb-1 flex items-center gap-2 text-[#c4b48a]/65"
          >
            <motion.span
              animate={
                reduce
                  ? undefined
                  : { y: [0, -3, 0], opacity: [0.7, 1, 0.7] }
              }
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <Wine className="h-4 w-4" aria-hidden />
            </motion.span>
            <span className="text-[10px] tracking-[0.28em] uppercase sm:text-[11px]">
              DARNA · After dark
            </span>
          </motion.div>
        }
      />
    </div>
  );
}

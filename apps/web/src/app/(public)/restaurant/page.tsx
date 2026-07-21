"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { SectionHub } from "@/components/sections/section-hub";
import { useLocale } from "@/components/locale/locale-provider";
import { fadeUp } from "@/lib/guest-motion";

export default function RestaurantPage() {
  const { t } = useLocale();
  const reduce = useReducedMotion();

  return (
    <SectionHub
      theme="restaurant"
      venue="restaurant"
      title={t.restaurant}
      tagline={t.restaurantTagline}
      accent={
        <motion.div
          variants={fadeUp}
          className="mb-1 flex items-center gap-2 text-cream-200/50"
        >
          <motion.span
            animate={
              reduce
                ? undefined
                : { rotate: [0, -6, 0, 6, 0], scale: [1, 1.05, 1] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <UtensilsCrossed className="h-4 w-4" aria-hidden />
          </motion.span>
          <span className="text-[10px] tracking-[0.28em] uppercase sm:text-[11px]">
            DARNA · Dining
          </span>
        </motion.div>
      }
    />
  );
}

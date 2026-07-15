"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/locale/locale-provider";
import { guestBrandClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string | null;
  size?: "sm" | "md" | "lg" | "hero";
  /** Optional separate wordmark beside the mark — not fused into the logo */
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { box: "h-9 w-9", img: 36, text: "text-lg" },
  md: { box: "h-11 w-11", img: 44, text: "text-xl" },
  lg: { box: "h-14 w-14", img: 56, text: "text-2xl" },
  hero: {
    box: "h-[clamp(3.25rem,11svh,7rem)] w-[clamp(3.25rem,11svh,7rem)]",
    img: 128,
    text: "text-6xl sm:text-8xl",
  },
};

/** Logo mark only by default — wordmark stays separate when enabled. */
export function BrandLogo({
  href = "/",
  size = "md",
  showWordmark = false,
  className,
  priority,
}: BrandLogoProps) {
  const { locale, t } = useLocale();
  const s = sizes[size];
  const isArabic = locale === "ar";

  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className={cn("relative block bg-transparent", s.box)}>
        <Image
          src="/logo1.png"
          alt={isArabic ? t.brand : t.brandLatin}
          width={s.img}
          height={s.img}
          priority={priority}
          className="h-full w-full object-contain"
        />
      </span>
      {showWordmark ? (
        <span
          className={cn("text-cream-200", guestBrandClass(locale, s.text))}
        >
          {isArabic ? t.brand : t.brandLatin}
        </span>
      ) : null}
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} className="inline-flex transition hover:opacity-90">
      {content}
    </Link>
  );
}

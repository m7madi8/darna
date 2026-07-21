"use client";

import { Crown, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { DARNA_MAPS_URL } from "@/lib/brand";
import { useLocale } from "@/components/locale/locale-provider";
import { cn } from "@/lib/utils";

type LocationLinkProps = {
  /** `button` full CTA · `inline` address row · `icon` map-only control */
  variant?: "button" | "inline" | "icon";
  label?: string;
  className?: string;
};

export function LocationLink({
  variant = "button",
  label,
  className,
}: LocationLinkProps) {
  const { t } = useLocale();
  const text = label ?? t.location;

  if (variant === "icon") {
    return (
      <a
        href={DARNA_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-cream-200/60 transition hover:bg-cream-200/10 hover:text-cream-200",
          className
        )}
        aria-label={t.openMaps}
        title={t.getDirections}
      >
        <MapPin className="h-4 w-4" aria-hidden />
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "mx-auto mt-2.5 inline-flex max-w-full items-center justify-center gap-1.5 text-[11px] tracking-[0.1em] text-cream-200/50 sm:mx-0 sm:justify-start",
          className
        )}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="truncate">{text}</span>
      </span>
    );
  }

  return (
    <a
      href={DARNA_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-cream-200/25 bg-transparent px-6 text-sm font-medium text-cream-200 transition hover:border-cream-200/45 hover:bg-cream-200/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-200/40 sm:w-auto",
        className
      )}
      aria-label={t.openMaps}
    >
      <MapPin className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      <span>{t.getDirections}</span>
    </a>
  );
}

type VipLinkProps = {
  href?: string;
  className?: string;
};

/** Secondary guest CTA — VIP booking entry */
export function VipLink({ href = "/vip", className }: VipLinkProps) {
  const { t } = useLocale();

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-cream-200/30 bg-cream-200/8 px-6 text-sm font-medium text-cream-200 transition hover:border-cream-200/50 hover:bg-cream-200/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-200/40 sm:w-auto",
        className
      )}
      aria-label={t.vipCta}
    >
      <Crown className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
      <span>{t.vipCta}</span>
    </Link>
  );
}

type EventsLinkProps = {
  href?: string;
  className?: string;
};

/** Guest CTA — catering entry */
export function EventsLink({ href = "/catering", className }: EventsLinkProps) {
  const { t } = useLocale();

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#c4b48a]/35 bg-[#c4b48a]/10 px-6 text-sm font-medium text-[#e8dcc0] transition hover:border-[#c4b48a]/55 hover:bg-[#c4b48a]/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b48a]/40 sm:w-auto",
        className
      )}
      aria-label={t.eventsCta}
    >
      <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
      <span>{t.eventsCta}</span>
    </Link>
  );
}

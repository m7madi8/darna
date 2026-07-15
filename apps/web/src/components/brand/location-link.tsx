"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { DARNA_MAPS_URL } from "@/lib/brand";
import { useLocale } from "@/components/locale/locale-provider";
import { cn } from "@/lib/utils";

type LocationLinkProps = {
  /** `button` — secondary CTA beside booking; `inline` — address row on book page */
  variant?: "button" | "inline";
  /** Override label (e.g. branch address). Falls back to locale location string. */
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

  if (variant === "inline") {
    return (
      <a
        href={DARNA_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group mx-auto mt-2.5 inline-flex max-w-full items-center justify-center gap-1.5 rounded-full px-1 py-0.5 text-[11px] tracking-[0.1em] text-cream-200/50 transition hover:text-cream-200 sm:mx-0 sm:justify-start",
          className
        )}
        aria-label={t.openMaps}
      >
        <MapPin
          className="h-3.5 w-3.5 shrink-0 opacity-70 transition group-hover:opacity-100"
          aria-hidden
        />
        <span className="truncate underline-offset-4 group-hover:underline">
          {text}
        </span>
        <ExternalLink
          className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-70"
          aria-hidden
        />
      </a>
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

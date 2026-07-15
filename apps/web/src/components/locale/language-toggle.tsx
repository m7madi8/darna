"use client";

import { useLocale } from "@/components/locale/locale-provider";
import { cn } from "@/lib/utils";

/** Compact language swap — shows the other language only (no mixed am/pm-style clutter). */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggleLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.switchTo}
      className={cn(
        "inline-flex items-center text-[11px] tracking-[0.08em] text-cream-200/55 transition hover:text-cream-200",
        className
      )}
    >
      {locale === "ar" ? (
        <span className="font-brand tracking-[0.12em]">EN</span>
      ) : (
        <span>ع</span>
      )}
    </button>
  );
}

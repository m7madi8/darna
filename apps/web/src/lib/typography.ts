import type { Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

/**
 * دارنا wordmark
 * AR → Aref Ruqaa Bold (exact Google Fonts class)
 * EN → brand Latin stack
 */
export function guestBrandClass(locale: Locale, className?: string) {
  return cn(locale === "ar" ? "aref-ruqaa-bold" : "font-brand", className);
}

/**
 * Guest section headings (أي مساء؟، اختر طاولتك، …)
 */
export function guestHeadingClass(locale: Locale, className?: string) {
  return cn(
    locale === "ar" ? "aref-ruqaa-bold" : "font-sans font-semibold",
    className
  );
}
